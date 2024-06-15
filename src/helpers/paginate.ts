export function paginateData<T>(inputArray: T[], itemsPerPage: number, currentPageIndex: number): T[] {
  const minIndex = currentPageIndex * itemsPerPage;
  const maxIndex = (currentPageIndex + 1) * itemsPerPage;

  return inputArray.slice(minIndex, maxIndex);
}
