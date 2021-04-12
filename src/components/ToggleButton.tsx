import React, {useEffect, useState} from "react";
import {Checkbox, CheckboxProps, FormControlLabel, Switch, withStyles} from "@material-ui/core";
import { green } from "@material-ui/core/colors";

interface StockPriceToolbarProps {
    value?: boolean;
    label: string;
    handleShowStateChange: (value: boolean) => void;
}

const ToggleButton: React.FC<StockPriceToolbarProps> = (props) => {
    const [showState, setShowState] = useState<boolean>(!!props.value);

    useEffect(() => {
        setShowState(!!props.value);
    }, [props.value]);

    const onShowAverageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;

        setShowState(value);
        props.handleShowStateChange(value);
    };

    const GreenCheckbox = withStyles({
        root: {
            // color: green[400],
            '&$checked': {
                color: green[600],
            },
        },
        checked: {},
    })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

    return (
        <FormControlLabel
            control={<GreenCheckbox checked={showState} onChange={onShowAverageChange} />}
            label={props.label}
        />
    )
}

export default ToggleButton;