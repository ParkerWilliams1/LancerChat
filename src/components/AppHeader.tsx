import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AppHeader.sass';

expor default class AppHeader extends React.Component {
  override render(): React.JSX.Element {
    return (
      <header className="app-header">
        <h1>
          <Link to="/">
            lancer<span>chat</span>
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
