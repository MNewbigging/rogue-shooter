import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from './state/AppState';

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  // Is the app still loading
  if (appState.loading) {
    return <div>loading</div>;
  }

  // Confirm start with click
  if (!appState.started) {
    return (
      <div id={'start-confirm'} onClick={appState.onClickToStart}>
        Click to start
      </div>
    );
  }

  return <div></div>;
});
