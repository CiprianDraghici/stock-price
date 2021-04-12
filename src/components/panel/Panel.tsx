import React from "react";
import {Card, CardContent, CardHeader, createStyles, makeStyles, Theme} from "@material-ui/core";

interface PanelProps {
    headerComponent?: React.ReactElement | React.ElementType;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullHeightCard: {
            height: "100%",
        },
    }),
);

export const Panel: React.FC<PanelProps> = (props) => {
    const classes = useStyles();

    return (
        <Card className={classes.fullHeightCard}>
            {
                props.headerComponent &&
                <CardHeader component={props.headerComponent as React.ElementType} />
            }
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
}

export default Panel;