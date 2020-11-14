import React from 'react';
import Home from './component/home/home';
import Login from './component/login/login';
import Board from './component/board/board';
import Register from './component/login/register';
import ChangePassWord from './component/login/change-password';

const routes = [
    {
        path: "/change-password",
        exact: false,
        main: () => <ChangePassWord />
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
    },
    {
        path: "/",
        exact: true,
        main: () => <Home />
    },
];

export default routes;