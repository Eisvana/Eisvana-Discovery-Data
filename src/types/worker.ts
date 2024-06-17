import type { FilterStoreState } from '@/stores/filter';
import type { DiscoveryData } from './data';
import type { UnixTimestamp } from './date';

export type FilterConfig = Omit<Omit<FilterStoreState, 'date'>, 'categories'> & { unixTimestamp: UnixTimestamp };

export interface WorkerMessage {
  path: string;
  filterConfig: FilterConfig;
}

export interface WorkerResponse {
  data: DiscoveryData[];
}
