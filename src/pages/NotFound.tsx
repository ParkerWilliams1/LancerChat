import React from 'react';
import '../styles/not-found.sass';

export default class NotFound extends React.Component {
  override render(): React.JSX.Element {
    return <section className="not-found">
      <h1>404 Page Not Found</h1>
    </section>;
  }
}
