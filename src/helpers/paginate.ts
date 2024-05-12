export function paginateData<T>(inputArray: T[], itemsPerPage: number): T[][] {
  const pages = inputArray.reduce((resultArray: T[][], item, index) => {
    const chunkIndex = Math.floor(index / itemsPerPage);

    resultArray[chunkIndex] ??= []; // start a new chunk

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return pages;
}
