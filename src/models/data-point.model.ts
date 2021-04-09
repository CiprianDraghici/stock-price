import {SeriesPoint} from "./series-point.model";

export interface DataPoint extends SeriesPoint {
    label?: string;
    [key: string]: any;
}