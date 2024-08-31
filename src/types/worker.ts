import type { FilterStoreState } from '@/stores/filter';
import type { DiscoveryCategories, DiscoveryData } from './data';
import type { UnixTimestamp } from './date';

// Data loader worker
export type FilterConfig = Omit<FilterStoreState, 'date' | 'categories'> & { unixTimestamp: UnixTimestamp };

export interface LoaderWorkerMessage {
  categories: DiscoveryCategories[];
  filterConfig: FilterConfig;
}

interface FinalLoaderWorkerResponse {
  status: 'finished';
}

interface InitialLoaderWorkerResponse {
  status: 'initialised';
  data: [][];
}

interface DataLoaderWorkerResponse {
  status: 'running';
  index: number;
  data: DiscoveryData[];
}

interface ErrorLoaderWorkerResponse {
  status: 'error';
  data: Error;
}

export type LoaderWorkerResponse =
  | InitialLoaderWorkerResponse
  | FinalLoaderWorkerResponse
  | DataLoaderWorkerResponse
  | ErrorLoaderWorkerResponse;
