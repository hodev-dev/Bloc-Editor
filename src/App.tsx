import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import rootReducer from './reducers/rootReducer';
import Editor from './pages/Editor';
import './assets/tailwind.css';

const initialState = {};
const store = createStore(rootReducer, initialState, applyMiddleware(ReduxThunk));

function App() {
 
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path={"/"} component={Editor} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
