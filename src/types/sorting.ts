import type { orders } from "@/variables/mappings";
import type { ValueOf } from "./utility";

export interface Sorting {
  col: number;
  order: ValueOf<typeof orders>;
}
