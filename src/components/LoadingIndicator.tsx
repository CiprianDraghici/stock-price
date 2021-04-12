import React from "react";
import {createStyles, Theme} from "@material-ui/core/styles";
import {Backdrop, CircularProgress, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff'
        },
    }),
);

const LoadingIndicator: React.FC = (props) => {
    const classes = useStyles();

    return (
        <div>
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default LoadingIndicator;