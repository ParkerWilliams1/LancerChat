import React from 'react';

import './styles/app.sass';

export default class App extends React.Component {
  override render(): React.JSX.Element {
    return (
      <div className="app">
        <h1>Lancerchat</h1>
      </div>
    );
  }
}
