import React from 'react';
import Home from './component/home/home';
import Login from './component/login/login';
import Board from './component/board/board';
import Register from './component/login/register';

const routes = [
    {
        path: "/",
        exact: true,
        main: () => <Home />
    },
    {
        path: "/login",
        exact: false,
        main: () => <Login />
    },
    {
        path: "/register",
        exact: false,
        main: () => <Register />
    },
    {
        path: "/board",
        exact: false,
        main: () => <Board />
    }
];

export default routes;