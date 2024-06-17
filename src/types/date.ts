export type DateRangeObj =
  | string
  | null
  | {
      from: string;
      to: string;
    };

export interface UnixTimestamp {
  startDate: number;
  endDate: number;
}
