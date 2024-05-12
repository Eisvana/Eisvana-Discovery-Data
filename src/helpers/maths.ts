import { orders } from '@/variables/mappings';
import type { Sorting } from '@/types/data';
import { sortArray } from './sorting';

export const getPercentage = (amount: number, total: number, decimals: number = 1) =>
  parseFloat((total ? (amount / total) * 100 : 0).toFixed(decimals)); // NoSonar this calculates a percentage

export function sortData(inputArray: (string | number)[][], sorting: Sorting) {
  const sortedArray = sortArray(inputArray, sorting.col);

  for (let i = 0; i < sortedArray.length; i++) {
    sortedArray[i].unshift(`${i + 1}.`);
  }

  return sorting.order === orders.asc ? sortedArray.toReversed() : sortedArray;
}
