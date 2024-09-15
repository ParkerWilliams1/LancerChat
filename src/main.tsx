import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from 'react-router-dom';
import Home from './pages/Home';
import './styles/global.sass';

const rootElement = document.getElementById('app-root');
if (rootElement === null) {
  throw new Error('Failed to render, #app-root not found.');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Fragment>
        <nav>
          <Link to="/">Home</Link>
          <Link to="login">Login</Link>
          <Link to="signup">Sign Up</Link>
        </nav>
        <Outlet />
      </React.Fragment>
    ),
    errorElement: (
      <React.Fragment>
        <nav>
          <Link to="/">Home</Link>
          <Link to="login">Login</Link>
          <Link to="signup">Sign Up</Link>
        </nav>
        <h1>404 Page Not Found</h1>
      </React.Fragment>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
