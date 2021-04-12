import React, {useState} from "react";
import {Button, ButtonGroup} from "@material-ui/core";
import {DateRanges} from "../enums/date-ranges.enum";
import {DateRangeService} from "../services/date-range.service";
import {DateRange} from "../models/date-range.model";

interface DateRangesShortcutProps {
    selectedDateRange?: DateRanges;
    handleDateRangeChange: (selectedDateRange: DateRanges, value: DateRange) => void;
}

const DateRangesShortcut: React.FC<DateRangesShortcutProps> = (props) => {
    const dateRangeService = new DateRangeService();
    const dateRangeOptions = dateRangeService.getDateRangesOptions();

    const [selectedDateRange, setSelectedDateRange] = useState<string>(dateRangeOptions[props.selectedDateRange || DateRanges.CurrentDay]);

    const onChangeDateRanges = (dateRangeOption: string) => (e: React.MouseEvent) => {
        // @ts-ignore
        setSelectedDateRange(dateRangeOptions[dateRangeOption]);
        const dateRange = dateRangeService.resolveDateRange((Number(dateRangeOption) as unknown) as DateRanges);
        props.handleDateRangeChange((Number(dateRangeOption) as unknown) as DateRanges, dateRange);
    }

    return (
        <ButtonGroup size="small" aria-label="small outlined button group" aria-labelledby={"Resolution"}>
            {
                Object.keys(dateRangeOptions).map(option => (
                    // @ts-ignore
                    <Button key={option} className={selectedDateRange === dateRangeOptions[option] ? "active" : ""} onClick={onChangeDateRanges(option)}>{dateRangeOptions[option]}</Button>
                ))
            }
        </ButtonGroup>
    )
}

export default DateRangesShortcut;