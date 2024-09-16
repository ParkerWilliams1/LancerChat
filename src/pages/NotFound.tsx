import React from 'react';
import '../styles/NotFound.sass';

export default class NotFound extends React.Component {
  override render(): React.JSX.Element {
    return (
      <main className="not-found">
        <h1>404 Page Not Found</h1>
        <p>This page does not exist.</p>
      </main>
    );
  }
}
