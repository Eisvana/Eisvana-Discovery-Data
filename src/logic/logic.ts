import { orders, platformColours, platformMapping } from '@/objects/mappings';
import type { Sorting, ValueOf } from '@/types/data';

export function paginateData(inputArray: ([] | {})[], itemsPerPage: number): ([] | {} | string | number)[][] {
  const pages = inputArray.reduce((resultArray: ([] | {} | string | number)[][], item, index) => {
    const chunkIndex = Math.floor(index / itemsPerPage);

    resultArray[chunkIndex] ??= []; // start a new chunk

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return pages;
}

/**
 * returns a *new* array, sorted by the column specified in the sortingCol index.
 * @param inputArray Array of arrays which should be sorted
 * @param sortingCol Index of column for which should be sorted
 */
export function sortArray(inputArray: (string | number)[][], sortingCol: number) {
  const sortedArray = structuredClone(inputArray).sort((a, b) => {
    const aValue = a[sortingCol];
    const bValue = b[sortingCol];
    const aNum = typeof aValue === 'string' ? parseFloat(aValue) : aValue;
    const bNum = typeof bValue === 'string' ? parseFloat(bValue) : bValue;

    if (isNaN(aNum) || isNaN(bNum)) {
      return bValue < aValue ? 1 : -1;
    } else {
      return bNum - aNum;
    }
  });

  return sortedArray;
}

const toggleSortingOrder = (sortingObj: Sorting) =>
  (sortingObj.order = sortingObj.order === orders.asc ? orders.desc : orders.asc);

export function sortByColumn(event: Event, sortingObj: Sorting) {
  const element = event.target as HTMLDivElement;
  const parent = element.parentElement!;
  const index = Array.from(parent.children).indexOf(element) - 1;
  if (sortingObj.col === index) {
    toggleSortingOrder(sortingObj);
  } else {
    sortingObj.col = index;
    sortingObj.order = orders.desc;
    parent.querySelector('[aria-sort]')?.removeAttribute('aria-sort');
  }
  element.setAttribute('aria-sort', sortingObj.order);
}

export const getPercentage = (amount: number, total: number, decimals: number = 1) =>
  parseFloat((total ? (amount / total) * 100 : 0).toFixed(decimals)); // NoSonar this calculates a percentage

export function sortData(inputArray: (string | number)[][], sorting: Sorting) {
  const sortedArray = sortArray(inputArray, sorting.col);

  for (let i = 0; i < sortedArray.length; i++) {
    sortedArray[i].unshift(`${i + 1}.`);
  }

  if (sorting.order === orders.asc) sortedArray.reverse();

  return sortedArray;
}

/**
 * returns the days in between two date strings, including the starting day string. Returns in the format yyyy-mm-dd.
 */
export function getDatesBetween(startDate: string | undefined, endDate: string | undefined) {
  if (!startDate || !endDate) return [];
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const dates = [];
  const currentDate = new Date(startDateObj);
  while (currentDate <= endDateObj) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates.map((date) => date.toISOString().split('T')[0]);
}

export function setPlatformColours(array: ValueOf<typeof platformMapping>[]) {
  return array.map((platform) => {
    // TODO: Refactor this to use an object which is accessed
    const platformColourLookup = {
      [platformMapping.ST]: platformColours.steam,
      [platformMapping.PS]: platformColours.ps,
      [platformMapping.XB]: platformColours.xb,
      [platformMapping.GX]: platformColours.gog,
      [platformMapping.NI]: platformColours.switch,
    };

    return platformColourLookup[platform];
  });
}

export function getRandomColour() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16); // NoSonar I have no idea what these numbers are...
}
