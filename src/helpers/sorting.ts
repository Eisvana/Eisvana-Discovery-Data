import type { Sorting } from '@/types/sorting';
import { orders } from '@/variables/mappings';

/**
 * returns a *new* array, sorted by the column specified in the sortingCol index.
 * @param inputArray Array of arrays which should be sorted
 * @param sortingCol Index of column for which should be sorted
 */
export function sortArray(inputArray: (string | number)[][], sortingCol: number) {
  const sortedArray = inputArray.toSorted((a, b) => {
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

export function sortData(inputArray: (string | number)[][], sorting: Sorting) {
  const sortedArray = sortArray(inputArray, sorting.col);

  for (let i = 0; i < sortedArray.length; i++) {
    sortedArray[i].unshift(`${i + 1}.`);
  }

  return sorting.order === orders.asc ? sortedArray.toReversed() : sortedArray;
}

const toggleSortingOrder = (sortingObj: Sorting) =>
  (sortingObj.order = sortingObj.order === orders.asc ? orders.desc : orders.asc);

export function sortByColumn(event: Event, sortingObj: Sorting) {
  const element = event.target;
  if (!(element instanceof HTMLDivElement)) return;
  const parent = element.parentElement;
  if (!parent) return;
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
