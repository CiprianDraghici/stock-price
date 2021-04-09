import {SeriesPoint} from "./series-point.model";

export interface Series {
    name: string;
    values: SeriesPoint[];
}