import { isDiscoveryData } from '@/helpers/typeGuards';
import type { DiscoveryData } from '@/types/data';
import type { FilterConfig, LoaderWorkerMessage, LoaderWorkerResponse } from '@/types/worker';
import { regions as allEisvanaRegions } from '@/variables/regions';
import { dayInMs } from '@/variables/time';

onmessage = async ({ data }: MessageEvent<LoaderWorkerMessage>) => {
  try {
    await loadData(data);
    const finalResponse: LoaderWorkerResponse = {
      status: 'finished',
    };
    postMessage(finalResponse);
  } catch (error) {
    console.warn('something happened in worker:', error);
    sendWorkerError(error);
  } finally {
    close();
  }
};

async function loadData({ categories, filterConfig }: LoaderWorkerMessage) {
  try {
    // using standard dynamic import was weird, so we're using the glob import feature instead
    // standard dynamic import didn't have the `default` field in its type, so it couldn't be properly accessed
    // might also have had something to do with the limitation on dynamic import that you have to specify a more specific file pattern, but I'm not sure whether that only applies to imports from the current directory
    const dataImports = import.meta.glob('../assets/*.json', { import: 'default' });
    const imports = categories.flatMap((category) => {
      const entries = Object.entries(dataImports); // [[path/to/file.json, () => import(file.json)], [path/to/anotherfile.json, () => import(anotherfile.json)]]
      return entries.filter((item) => item[0].endsWith(`${category}.json`)).map((item) => item[1]);
    });

    const amountOfRequests = imports.length;
    const initialMessage: LoaderWorkerResponse = {
      status: 'initialised',
      data: Array.from({ length: amountOfRequests }, () => []),
    };
    postMessage(initialMessage);
    const importData = imports.map((item, index) => addData(item, index, filterConfig));
    await Promise.all(importData);
  } catch (error) {
    console.warn(error);
    sendWorkerError(error);
  }
}

async function addData(getData: () => Promise<unknown>, index: number, filterConfig: FilterConfig) {
  try {
    const data = await getData();
    if (!Array.isArray(data)) return;
    const trueDiscoveryData = data.filter((item) => isDiscoveryData(item));
    const filteredData = applyFilter(trueDiscoveryData, filterConfig);
    const workerResponse: LoaderWorkerResponse = {
      status: 'running',
      data: filteredData,
      index,
    };
    postMessage(workerResponse);
  } catch (error) {
    sendWorkerError(error);
  }
}

function applyFilter(
  data: DiscoveryData[],
  { regions, unixTimestamp, tagged, procName, intersections, searchTerms, caseSensitivity, platforms }: FilterConfig
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

    const isValidNamed = procName === '' || (procName && !item.Name) || (!procName && item.Name);

    if (!isValidNamed) return false;

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

function sendWorkerError(error: unknown) {
  const errorMessage = typeof error === 'string' ? error : 'something went wrong';
  const workerResponse: LoaderWorkerResponse = {
    status: 'error',
    data: error instanceof Error ? error : new Error(errorMessage),
  };
  postMessage(workerResponse);
}
