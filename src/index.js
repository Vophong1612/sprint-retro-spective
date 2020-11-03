import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from './routes';
import {UserProvider} from './component/userContext/userContext';

const showMenuContent = (routes) => {
    var result = null;
    if (routes.length > 0)
    {
        result = routes.map((route, index) => {
            return (
                <Route
                key = {index}
                path = {route.path}
                exact = {route.exact}
                component = {route.main} />
            );
        })
    }

    return result;
}

function App() {
    return (
        <Router>
            <Switch>
                {showMenuContent(routes) }
            </Switch>
        </Router>
    );
}


ReactDOM.render(<UserProvider> <App /> </UserProvider> , document.getElementById("root"));
