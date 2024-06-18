import { isDiscoveryData } from '@/helpers/typeGuards';
import type { DiscoveryData } from '@/types/data';
import type { FilterConfig, WorkerMessage, WorkerResponse } from '@/types/worker';
import { regions as allEisvanaRegions } from '@/variables/regions';

onmessage = async ({ data }: MessageEvent<WorkerMessage>) => {
  await loadData(data);
  const finalResponse: WorkerResponse = {
    status: 'finished',
  };
  postMessage(finalResponse);
  close();
};

async function loadData({ regions, categories, filterConfig }: WorkerMessage) {
  try {
    const animalImports = import.meta.glob('../assets/animals/*.json', { import: 'default' });
    const baseImports = import.meta.glob('../assets/bases/*.json', { import: 'default' });
    const floraImports = import.meta.glob('../assets/flora/*.json', { import: 'default' });
    const mineralImports = import.meta.glob('../assets/minerals/*.json', { import: 'default' });
    const planetImports = import.meta.glob('../assets/planets/*.json', { import: 'default' });
    const settlementImports = import.meta.glob('../assets/settlements/*.json', { import: 'default' });
    const systemImports = import.meta.glob('../assets/systems/*.json', { import: 'default' });

    const importMapping: Record<string, Record<string, () => Promise<unknown>>> = {
      base: baseImports,
      creature: animalImports,
      flora: floraImports,
      mineral: mineralImports,
      planet: planetImports,
      settlement: settlementImports,
      system: systemImports,
    };

    const regionMapping: string[] = Object.values(allEisvanaRegions);

    const activeRegionCodes = regions
      .map((item) => regionMapping.indexOf(item) + 1)
      .filter(Boolean)
      .map((item) => `EV${item}`);

    const imports = categories.flatMap((category) => {
      const entries = Object.entries(importMapping[category]); // [[path/to/file.json, () => import(file.json)], [path/to/anotherfile.json, () => import(anotherfile.json)]]
      return entries
        .filter((item) => activeRegionCodes.some((regionCode) => item[0].endsWith(`${regionCode}.json`)))
        .map((item) => item[1]);
    });

    const amountOfRequests = imports.length;
    const initialMessage: WorkerResponse = {
      status: 'initialised',
      data: Array.from({ length: amountOfRequests }, () => []),
    };
    postMessage(initialMessage);
    const importData = imports.map((item, index) => addData(item, index, filterConfig));
    await Promise.all(importData);
  } catch (error) {
    console.warn(error);
  }
}

async function addData(getData: () => Promise<unknown>, index: number, filterConfig: FilterConfig) {
  const data = await getData();
  if (!Array.isArray(data)) return;
  const trueDiscoveryData = data.filter((item) => isDiscoveryData(item));
  const filteredData = applyFilter(trueDiscoveryData, filterConfig);
  const workerResponse: WorkerResponse = {
    status: 'running',
    data: filteredData,
    index,
  };
  postMessage(workerResponse);
}

function applyFilter(
  data: DiscoveryData[],
  { regions, unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, platforms }: FilterConfig
) {
  const { startDate = 0, endDate = 0 } = unixTimestamp;

  const regionData = regions.map((item) => searchRegion(item));

  // handle case sensitivity option
  const searchName = caseSensitivity.name ? searchTerms.name : searchTerms.name.toLowerCase();
  const searchDiscoverer = caseSensitivity.discoverer ? searchTerms.discoverer : searchTerms.discoverer.toLowerCase();

  // shorten variable names
  const intersectionName = intersections.name;
  const intersectionGlyphs = intersections.glyphs;
  const intersectionDiscoverer = intersections.discoverer;
  const searchGlyphs = searchTerms.glyphs.slice(1).toUpperCase();

  function filterFunc(item: DiscoveryData) {
    // handle case sensitivity option
    const itemName = caseSensitivity.name ? item.Name : item.Name.toLowerCase();
    const itemDiscoverer = caseSensitivity.discoverer ? item.Discoverer : item.Discoverer.toLowerCase();

    // shorten variable names
    const itemGlyphs = item.Glyphs.slice(1);

    // begin filtering
    const dayInMs = 24 * 60 * 60 * 1000; // NoSonar 24h times 60 minutes times 60 seconds times 1000 milliseconds
    const isValidDate =
      (!startDate && !endDate) ||
      (startDate < item.Timestamp && item.Timestamp < endDate + dayInMs) ||
      (startDate < item.Timestamp && !endDate) ||
      (!startDate && item.Timestamp < endDate + dayInMs);

    if (!isValidDate) return false;

    const isValidPlatform = (!platforms.length && !item.Platform) || platforms.includes(item.Platform);

    if (!isValidPlatform) return false;

    const isValidTagged =
      tagged === '' || (tagged && item['Correctly Prefixed']) || (!tagged && !item['Correctly Prefixed']);

    if (!isValidTagged) return false;

    const isValidName =
      !searchName ||
      (intersectionName === 'includes' && itemName.includes(searchName)) ||
      (intersectionName === 'is' && itemName === searchName) ||
      (intersectionName === '!includes' && !itemName.includes(searchName)) ||
      (intersectionName === '!is' && itemName !== searchName);

    if (!isValidName) return false;

    const isValidGlyphs =
      !searchGlyphs ||
      (intersectionGlyphs === 'includes' && itemGlyphs.includes(searchGlyphs)) ||
      (intersectionGlyphs === 'is' && itemGlyphs === searchGlyphs) ||
      (intersectionGlyphs === '!includes' && !itemGlyphs.includes(searchGlyphs)) ||
      (intersectionGlyphs === '!is' && itemGlyphs !== searchGlyphs);

    if (!isValidGlyphs) return false;

    const isValidDiscoverer =
      !searchDiscoverer ||
      (intersectionDiscoverer === 'includes' && itemDiscoverer.includes(searchDiscoverer)) ||
      (intersectionDiscoverer === 'is' && itemDiscoverer === searchDiscoverer) ||
      (intersectionDiscoverer === '!includes' && !itemDiscoverer.includes(searchDiscoverer)) ||
      (intersectionDiscoverer === '!is' && itemDiscoverer !== searchDiscoverer);

    if (!isValidDiscoverer) return false;

    const isValidRegion =
      (!regionData.length && !item.Glyphs) || regionData.some((region) => item.Glyphs.slice(4) === region.regionGlyphs); // NoSonar region glyphs start at index 4

    return isValidRegion;
  }

  return data.filter(filterFunc);
}

function searchRegion(region: string) {
  const regionGlyphs = Object.entries(allEisvanaRegions).find((item) => item[1] === region)?.[0] ?? '';
  return { regionGlyphs };
}