import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {InitializeService} from "./services/initialize.service";
import {toast} from "react-toastify";

const initializeService = InitializeService.getInstance();

initializeService.init().then(() => {
    ReactDOM.render(
        // <React.StrictMode>
            // <App />
        // </React.StrictMode>
        <App />,
        document.getElementById('root')
    );
}).catch(() => {
    toast.error("Application can not be initialized.")
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
