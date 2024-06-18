import type { FilterStoreState } from '@/stores/filter';
import type { DiscoveryData } from './data';
import type { UnixTimestamp } from './date';

export type FilterConfig = Omit<Omit<FilterStoreState, 'date'>, 'categories'> & { unixTimestamp: UnixTimestamp };

export interface WorkerMessage {
  regions: string[];
  categories: string[];
  filterConfig: FilterConfig;
}

interface FinalWorkerResponse {
  status: 'finished';
}

interface InitialWorkerResponse {
  status: 'initialised';
  data: [][];
}

interface DataWorkerResponse {
  status: 'running';
  index: number;
  data: DiscoveryData[];
}

interface ErrorWorkerResponse {
  status: 'error';
  data: Error;
}

export type WorkerResponse = InitialWorkerResponse | FinalWorkerResponse | DataWorkerResponse | ErrorWorkerResponse;
