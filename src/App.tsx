import React from 'react';

import { AppState } from './AppState';

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = ({ appState }) => {
  return <div>hello!</div>;
};
