import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound';
import AppHeader from './components/AppHeader';
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
        <AppHeader />
        <Outlet />
      </React.Fragment>
    ),
    errorElement: null,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

// Setup a global error handler
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<NotFound />} />
  </React.StrictMode>
);
