import React, {useEffect, useState} from "react";
import Dropdown, {Option} from 'react-dropdown';
import {ChartService} from "../services/chart.service";

interface StockSymbolProps {
    handleSymbolChange: (value: string) => void;
}

const StockSymbol: React.FC<StockSymbolProps> = (props) => {
    const [selectedSymbol, setSelectedSymbol] = useState<string>();
    const [symbolOptions, setSymbolOptions] = useState<string[]>([]);

    useEffect(() => {
        getDataAsync();
    }, []);

    const getDataAsync = async () => {
        const chartService: ChartService = new ChartService();

        const data = await chartService.getSymbols() || [];
        const dropdownOptions: string[] = [];

        for(const stockSymbol of data) {
            dropdownOptions.push(stockSymbol.symbol)
        }

        setSymbolOptions(dropdownOptions);
        if(dropdownOptions.length > 0) {
            onChangeSymbol({label: dropdownOptions[0], value: dropdownOptions[0]})
        }
    }

    const onChangeSymbol = (option: Option) => {
        setSelectedSymbol(option.value);
        props.handleSymbolChange(option.value);
    }

    return (
        <Dropdown options={symbolOptions} onChange={onChangeSymbol} value={selectedSymbol} placeholder="Select a symbol" />
    )
}

export default StockSymbol;