import {Resolution} from "../enums/resolution.enum";
import {DateRange} from "./date-range.model";

export interface StockSettings {
    symbol?: string;
    resolution?: Resolution;
    dateRange?: DateRange;
    showAverage?: boolean;
}