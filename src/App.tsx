import React from 'react';
import { Provider } from 'react-redux';
import userReducer from './store/reducers/User';
import { createStore, combineReducers } from 'redux';
import Home from './components/Home/Home';

const rootReducer = combineReducers({
    user: userReducer,
});

const store = createStore(rootReducer);

const App = () => {
    //This background component only applies in Sign In and Sign Up
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  };
  
  export default App;