import React, {useEffect, useState} from "react";
import {ChartService} from "../services/chart.service";
import Dropdown, {Option} from 'react-dropdown';
import {Resolution} from "../enums/resolution.enum";

interface StockPriceToolbarProps {
    handleSymbolSelection: (value: string) => void;
}

const StockPriceToolbar: React.FC<StockPriceToolbarProps> = (props) => {
    const [selectedSymbol, setSelectedSymbol] = useState<string>();
    const [selectedResolution, setSelectedResolution] = useState<string>();
    const [symbolOptions, setSymbolOptions] = useState<string[]>([]);
    const [resolutionOptions, setResolutionOptions] = useState<string[]>([
        ...Object.keys(Resolution).filter(key => typeof key === "string")
    ]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDataAsync();


    }, []);

    const onChangeSymbol = (option: Option) => {
        setSelectedSymbol(option.value);
        props.handleSymbolSelection(option.value);
    }

    const onChangeResolution = (option: Option) => {
        setSelectedResolution(option.value);
        console.log(option.value);
        // @ts-ignore
        console.log(Resolution[option.value]);
    }

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
                </div>
            }
        </>
    )
}

export default StockPriceToolbar;