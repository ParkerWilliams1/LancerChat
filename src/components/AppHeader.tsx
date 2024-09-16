import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/app-header.sass';

export default class AppHeader extends React.Component {
  override render(): React.JSX.Element {
    return <header className="app-header">
      <h2>Lancerchat</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </ul>
      </nav>
    </header>;
  }
}
