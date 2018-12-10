import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MainPage } from './components/pages/MainPage/MainPage';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { InnerPage } from './components/pages/InnerPage/InnerPage';

const appElement = document.createElement('app');
appElement.id = 'app';
document.body.appendChild(appElement);

const App = () => (
    <Router>
        <div>
            <Route exact path="/" component={MainPage} />
            <Route path="/inner" component={InnerPage} />
        </div>
    </Router>
);

ReactDOM.render(
    <App />,
    appElement
);