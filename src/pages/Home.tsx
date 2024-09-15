import React from 'react';

export default class Home extends React.Component {
  override render(): React.JSX.Element {
    return (
      <div className="page">
        <h2>Homepage</h2>
        <p>words on the homepage</p>
      </div>
    );
  }
}
