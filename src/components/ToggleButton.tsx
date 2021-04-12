import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";


interface StockPriceToolbarProps {
    label: string;
    value?: boolean;
    handleShowStateChange: (value: boolean) => void;
}

const ToggleButton: React.FC<StockPriceToolbarProps> = (props) => {
    const [showState, setShowState] = useState<boolean>(!!props.value);

    useEffect(() => {
        setShowState(!!props.value);
    }, [props.value]);

    const onShowAverageChange = () => {
        setShowState(!showState);
        props.handleShowStateChange(!showState);
    };

    return (
        <Button size={"small"} className={`margin-l-sm ${showState ? "active" : ""}`} onClick={onShowAverageChange}>
            {
                props.label
            }
            {
                props.children
            }
        </Button>)
}

export default ToggleButton;