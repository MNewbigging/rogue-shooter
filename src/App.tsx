import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from './AppState';

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  // Is the app still loading
  if (appState.loading) {
    return <div>loading</div>;
  }

  return <div></div>;
});
