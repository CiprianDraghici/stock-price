import React, {useState} from "react";
import {FormControlLabel, Switch} from "@material-ui/core";

interface StockPriceToolbarProps {
    showStateText: string;
    hideStateText: string;
    handleShowStateChange: (value: boolean) => void;
}

const ToggleButton: React.FC<StockPriceToolbarProps> = (props) => {
    const [showState, setShowState] = useState<boolean>(false);

    const onShowAverageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        setShowState(value);
        props.handleShowStateChange(value);
    };

    return (
        <FormControlLabel
            control={<Switch checked={showState} onChange={onShowAverageChange} />}
            label={showState ? props.hideStateText : props.showStateText}
        />
    )
}

export default ToggleButton;