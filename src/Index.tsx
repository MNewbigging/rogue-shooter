import './index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { AppState } from './state/AppState';

const appState = new AppState();

const root = createRoot(document.getElementById('ui-root'));

root.render(<App appState={appState} />);

appState.loadGame();

if (module.hot) {
  module.hot.accept();
}
