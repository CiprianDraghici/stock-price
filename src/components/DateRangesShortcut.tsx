import React, {useState} from "react";
import {Resolution} from "../enums/resolution.enum";
import {Button, ButtonGroup} from "@material-ui/core";
import ControlLabel from "./panel/ControlLabel";
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

    const onChangeResolution = (resolutionOption: string) => (e: React.MouseEvent) => {
        // @ts-ignore
        setSelectedDateRange(dateRangeOptions[resolutionOption]);
        const dateRange = dateRangeService.resolveDateRange((Number(resolutionOption) as unknown) as DateRanges);
        props.handleDateRangeChange((Number(resolutionOption) as unknown) as DateRanges, dateRange);
    }

    return (
        <ButtonGroup size="small" aria-label="small outlined button group" aria-labelledby={"Resolution"}>
            {
                Object.keys(dateRangeOptions).map(option => (
                    // @ts-ignore
                    <Button key={option} className={selectedDateRange === dateRangeOptions[option] ? "active" : ""} onClick={onChangeResolution(option)}>{dateRangeOptions[option]}</Button>
                ))
            }
        </ButtonGroup>
    )
}

export default DateRangesShortcut;