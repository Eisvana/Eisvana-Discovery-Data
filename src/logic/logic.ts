import { Orders } from "@/objects/mappings";
import type { Sorting } from '@/types/data';

export function paginateData(inputArray: ([] | {})[], itemsPerPage: number): ([] | {})[][] {
  const pages = inputArray.reduce((resultArray: ([] | {})[][], item, index) => {
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

const toggleSortingOrder = (sortingObj: Sorting) => (sortingObj.order = sortingObj.order === Orders.asc ? Orders.desc : Orders.asc);

export function sortByColumn(event: Event, sortingObj: Sorting) {
  const element = event.target as HTMLDivElement;
  const parent = element.parentElement!;
  const index = Array.from(parent.children).indexOf(element) - 1;
  if (sortingObj.col === index) {
    toggleSortingOrder(sortingObj);
  } else {
    sortingObj.col = index;
    sortingObj.order = Orders.desc;
    parent.querySelector('[aria-sort]')?.removeAttribute('aria-sort');
  }
  element.setAttribute('aria-sort', sortingObj.order);
}

export const getPercentage = (amount: number, total: number, decimals: number = 1) => parseFloat((total ? (amount / total) * 100 : 0).toFixed(decimals)); // NoSonar this calculates a percentage

export function sortData(inputArray: (string | number)[][], sorting: Sorting) {
  const sortedArray = sortArray(inputArray, sorting.col);

  for (let i = 0; i < sortedArray.length; i++) {
    sortedArray[i].unshift(`${i + 1}.`);
  }

  if (sorting.order === Orders.asc) sortedArray.reverse();

  return sortedArray;
}
