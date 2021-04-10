import React from 'react';
import './content/App.css';
import StockPriceDashboard from "./components/StockPriceDashboard";

function App() {
    return (
        <div className="App">
            <div className="container">
                <StockPriceDashboard />
            </div>
        </div>
    );
}

export default App;
