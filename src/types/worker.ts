import type { FilterStoreState } from '@/stores/filter';
import type { DiscoveryData } from './data';
import type { UnixTimestamp } from './date';

// Filter worker
export type FilterConfig = Omit<FilterStoreState, 'date' | 'categories'> & { unixTimestamp: UnixTimestamp };

export interface LoaderWorkerMessage {
  regions: string[];
  categories: string[];
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
