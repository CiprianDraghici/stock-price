import React, {useEffect, useState} from "react";
import {ChartService} from "../services/chart.service";
import VirtualizedSelect from "react-virtualized-select";
// @ts-ignore
import createfilteroptions from "react-select-fast-filter-options";
import {Option} from "react-select";
import ControlLabel from "./panel/ControlLabel";
import {ChartSettingsService} from "../services/chart-settings.service";

interface StockSymbolProps {
    symbol?: string;
    handleSymbolChange: (value: string) => void;
}

const StockSymbol: React.FC<StockSymbolProps> = (props) => {
    const chartSettings: ChartSettingsService = ChartSettingsService.getInstance();

    const [selectedSymbol, setSelectedSymbol] = useState<Option>();
    const [symbolOptions, setSymbolOptions] = useState<Option[]>([]);

    useEffect(() => {
        getDataAsync();
    }, []);

    useEffect(() => {
        const option = symbolOptions.find(x => x.value === props.symbol);
        if(!option) { return; }

        setSelectedSymbol(option);
    }, [props.symbol]);

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
            chartSettings.setSpecificProperty("symbol", dropdownOptions[0].value as string);
        }
    }

    const onChangeSymbol = (option: Option | null) => {
        if(!option) { return; }

        setSelectedSymbol(option);

        props.handleSymbolChange(option.value as string);
    }

    return (
        <ControlLabel text={"Symbol"} useContainer={false}>
            <VirtualizedSelect options={symbolOptions} filterOptions={createfilteroptions({options: symbolOptions})} value={selectedSymbol} onChange={onChangeSymbol} clearable={false} placeholder="Select a symbol" />
        </ControlLabel>
    )
}

export default StockSymbol;