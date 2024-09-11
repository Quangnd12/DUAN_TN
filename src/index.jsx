import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StateProvider } from './Client/src/utils/StateProvider';
import reducer, { initialState } from './Client/src/utils/reducer';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <React.StrictMode>
        <StateProvider initialState={initialState} reducer={reducer}>
          <Router>
            <App />
          </Router>
        </StateProvider>
    </React.StrictMode>

);
