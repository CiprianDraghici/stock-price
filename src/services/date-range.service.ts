import {DateRanges} from "../enums/date-ranges.enum";
import moment from "moment";
import {DateRange} from "../models/date-range.model";

export class DateRangeService {
    public resolveDateRange(range: DateRanges): DateRange {
        return {
            startDate: this.getRangeStartDate(range),
            endDate: this.getRangeEndDate(range)
        };
    }

    public getRangeStartDate(range: DateRanges): Date {
        switch (range) {
            case DateRanges.CurrentDay:
                return moment().startOf("day").toDate();
            case DateRanges.LastDay:
                return moment().startOf("day").subtract({ days: 1 }).toDate();
            case DateRanges.CurrentWeek:
                return moment().startOf("week").toDate();
            case DateRanges.LastWeek:
                return moment().startOf("week").subtract({ weeks: 1 }).toDate();
            case DateRanges.CurrentMonth:
                return moment().startOf("month").toDate();
            case DateRanges.LastMonth:
                return moment().startOf("month").subtract({ months: 1 }).toDate();
            case DateRanges.CurrentYear:
                return moment().startOf("year").toDate();
            case DateRanges.LastYear:
                return moment().startOf("year").subtract({ years: 1 }).toDate();
            default:
                return moment().startOf("day").toDate();
        }
    }

    public getRangeEndDate(range: DateRanges): Date {
        switch (range) {
            case DateRanges.CurrentDay:
                return moment().endOf("day").toDate();
            case DateRanges.LastDay:
                return moment().endOf("day").subtract({ days: 1 }).toDate();
            case DateRanges.CurrentWeek:
                return moment().endOf("week").toDate();
            case DateRanges.LastWeek:
                return moment().endOf("week").subtract({ weeks: 1 }).toDate();
            case DateRanges.CurrentMonth:
                return moment().endOf("month").toDate();
            case DateRanges.LastMonth:
                return moment().endOf("month").subtract({ months: 1 }).toDate();
            case DateRanges.CurrentYear:
                return moment().endOf("year").toDate();
            case DateRanges.LastYear:
                return moment().endOf("year").subtract({ years: 1 }).toDate();
            default:
                return moment().endOf("day").toDate();
        }
    }

    public getDateRangesOptions = () => {
        return {
            [DateRanges.CurrentDay]: "Current Day",
            [DateRanges.CurrentWeek]: "Current Week",
            [DateRanges.CurrentMonth]: "Current Month",
            [DateRanges.CurrentYear]: "Current Year",
            [DateRanges.LastDay]: "Last Day",
            [DateRanges.LastWeek]: "Last Week",
            [DateRanges.LastMonth]: "Last Month",
            [DateRanges.LastYear]: "Last Year"
        }
    }

    // public getDateRangesOptions = () => {
    //     return [
    //         {
    //             label: "Current Day",
    //             value: DateRanges.CurrentDay
    //         },
    //         {
    //             label: "Current Week",
    //             value: DateRanges.CurrentWeek
    //         },
    //         {
    //             label: "Current Month",
    //             value: DateRanges.CurrentMonth
    //         },
    //         {
    //             label: "Current Year",
    //             value: DateRanges.CurrentYear
    //         },
    //         {
    //             label: "Last Day",
    //             value: DateRanges.LastDay
    //         },
    //         {
    //             label: "Last Week",
    //             value: DateRanges.LastWeek
    //         },
    //         {
    //             label: "Last Month",
    //             value: DateRanges.LastMonth
    //         },
    //         {
    //             label: "Last Year",
    //             value: DateRanges.LastYear
    //         }
    //     ]
    // }
}