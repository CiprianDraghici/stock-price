import React, {useEffect} from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {DateRange} from "../models/date-range.model";
import {Grid} from "@material-ui/core";

interface TimePeriodProps {
    dateRange?: DateRange;
    handlePeriodChange: (value: DateRange) => void;
}

const TimeRange: React.FC<TimePeriodProps> = (props) => {
    const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(props.dateRange ? new Date(props.dateRange.startDate) : new Date());
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(props.dateRange ? new Date(props.dateRange.endDate) : new Date());

    const onStartDateChange = (date: Date | null) => {
        setSelectedStartDate(date);
    };

    const onEndDateChange = (date: Date | null) => {
        setSelectedEndDate(date);
    };

    const onClosePicker = () => {
        props.handlePeriodChange({
            startDate: selectedStartDate || new  Date(),
            endDate: selectedEndDate || new  Date()
        });
    }

    useEffect(() => {
        setSelectedStartDate(props.dateRange ? new Date(props.dateRange.startDate) : new Date());
        setSelectedEndDate(props.dateRange ? new Date(props.dateRange.endDate) : new Date());
    }, [props.dateRange]);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between">
                <KeyboardDatePicker
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-start"
                    label="Start date"
                    value={selectedStartDate}
                    onChange={onStartDateChange}
                    onClose={onClosePicker}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardDatePicker
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-end"
                    label="End date"
                    value={selectedEndDate}
                    onChange={onEndDateChange}
                    onClose={onClosePicker}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
        </MuiPickersUtilsProvider>
    )
}

export default TimeRange;