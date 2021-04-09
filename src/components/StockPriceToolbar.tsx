import React, {useEffect, useState} from "react";
import {ChartService} from "../services/chart.service";
import Dropdown, {Option} from 'react-dropdown';
import {Resolution} from "../enums/resolution.enum";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {DateRange} from "../models/date-range.model";

interface StockPriceToolbarProps {
    handleSymbolChange: (value: string) => void;
    handleResolutionChange: (value: Resolution) => void;
    handleDateRangeChange: (value: DateRange) => void;
}

const StockPriceToolbar: React.FC<StockPriceToolbarProps> = (props) => {
    const [selectedSymbol, setSelectedSymbol] = useState<string>();
    const [selectedResolution, setSelectedResolution] = useState<string>();
    const [symbolOptions, setSymbolOptions] = useState<string[]>([]);
    const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(new Date());
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(new Date());
    const [error, setError] = useState<string | null>(null);

    const resolutionOptions = [ ...Object.keys(Resolution).filter(key => typeof key === "string") ];

    useEffect(() => {
        getDataAsync();
        setSelectedResolution(Resolution.W);
    }, []);

    const onChangeSymbol = (option: Option) => {
        setSelectedSymbol(option.value);
        props.handleSymbolChange(option.value);
    }

    const onChangeResolution = (option: Option) => {
        setSelectedResolution(option.value);
        // @ts-ignore
        props.handleResolutionChange(Resolution[option.value]);
    }

    const onStartDateChange = (date: Date | null) => {
        setSelectedStartDate(date);
        props.handleDateRangeChange({
            start: date || new  Date(),
            end: selectedEndDate || new  Date()
        });
    };

    const onEndDateChange = (date: Date | null) => {
        setSelectedEndDate(date);
        props.handleDateRangeChange({
            start: selectedStartDate || new  Date(),
            end: date || new  Date()
        });
    };

    const getDataAsync = async () => {
        const chartService: ChartService = new ChartService();

        try {
            const data = await chartService.getSymbols() || [];
            const dropdownOptions: string[] = [];

            for(const stockSymbol of data) {
                dropdownOptions.push(stockSymbol.symbol)
            }

            setSymbolOptions(dropdownOptions);
            if(dropdownOptions.length > 0) {
                onChangeSymbol({label: dropdownOptions[0], value: dropdownOptions[0]})
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            {
                error
            }
            {
                !error &&
                <div className="flexbox" style={{width: "100%",paddingRight: "30px", marginBottom: "10px",overflow: "visible", position: "relative"}}>
                    <Dropdown options={symbolOptions} onChange={onChangeSymbol} value={selectedSymbol} placeholder="Select a symbol" />
                    <Dropdown options={resolutionOptions} onChange={onChangeResolution} value={selectedResolution} placeholder="Select resolution" />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-start"
                            label="Date picker start"
                            value={selectedStartDate}
                            onChange={onStartDateChange}

                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-end"
                            label="Date picker end"
                            value={selectedEndDate}
                            onChange={onEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
            }
        </>
    )
}

export default StockPriceToolbar;