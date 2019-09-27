import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { reducer } from "./reducer.js";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const store = createStore(reducer,
    compose(applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore( reducer, composeEnhancers( applyMiddleware( thunk ) ) );

ReactDOM.render(
<BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
</BrowserRouter>, document.getElementById('root'));

serviceWorker.register();

export default store;


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// serviceWorker.unregister();
