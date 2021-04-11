import React, {useEffect, useState} from "react";
import {ChartService} from "../services/chart.service";
import VirtualizedSelect from "react-virtualized-select";
// @ts-ignore
import createfilteroptions from "react-select-fast-filter-options";
import {Option, Options} from "react-select";

interface StockSymbolProps {
    handleSymbolChange: (value: string) => void;
}

const StockSymbol: React.FC<StockSymbolProps> = (props) => {
    const [selectedSymbol, setSelectedSymbol] = useState<Option>();
    const [symbolOptions, setSymbolOptions] = useState<Option[]>([]);

    useEffect(() => {
        getDataAsync();
    }, []);

    const getDataAsync = async () => {
        const chartService: ChartService = new ChartService();

        const data = await chartService.getSymbols() || [];
        const dropdownOptions: Option[] = [];

        for(const stockSymbol of data) {
            dropdownOptions.push({
                label: stockSymbol.symbol,
                value: stockSymbol.symbol
            });
        }

        setSymbolOptions(dropdownOptions);
        if(dropdownOptions.length > 0) {
            onChangeSymbol(dropdownOptions[0]);
        }
    }

    const onChangeSymbol = (option: Option | null) => {
        if(!option) { return; }

        setSelectedSymbol(option);
        props.handleSymbolChange(option.value as string);
    }

    return (
        <VirtualizedSelect options={symbolOptions} filterOptions={createfilteroptions({options: symbolOptions})} value={selectedSymbol} onChange={onChangeSymbol} clearable={false} placeholder="Select a symbol" />
    )
}

export default StockSymbol;