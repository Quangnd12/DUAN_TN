import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Client from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { StateProvider } from './utils/StateProvider';
import reducer, { initialState } from './utils/reducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Router>
        <Client />
      </Router>
    </StateProvider>
  </React.StrictMode>
);


