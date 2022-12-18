import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { reducer } from "./reducer/reducer.js";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';


// import {
//     createBrowserRouter,
//     createRoutesFromElements,
//     Route,
//     RouterProvider,
//     Routes
//   } from "react-router-dom";


const store = createStore(reducer,
    compose(applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

// const router = createBrowserRouter(
//     createRoutesFromElements(
//     <Provider store={store}>
//         <App />
//     </Provider>
//     )
//   );

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore( reducer, composeEnhancers( applyMiddleware( thunk ) ) );

ReactDOM.render(
<BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
</BrowserRouter>, document.getElementById('root'));


// ReactDOM.createRoot(document.getElementById('root')).render(
//     <React.StrictMode>
//         <RouterProvider router={router} />
//     </React.StrictMode>
// )

serviceWorker.register();

export default store;


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// serviceWorker.unregister();
