// this should take an array of arrays or an array of objects. TS won't let me properly type that though.
export function paginateData(inputArray: any[], itemsPerPage: number): any[][] {
  const pages = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / itemsPerPage);

    resultArray[chunkIndex] ??= []; // start a new chunk

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return pages;
}
