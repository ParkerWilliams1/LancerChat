import React from 'react';
import '../styles/NotFound.sass';

export default class NotFound extends React.Component {
  override render(): React.JSX.Element {
    return (
      <main className="not-found">
        <h2>404 Page Not Found</h2>
        <p>This page does not exist.</p>
      </main>
    );
  }
}
