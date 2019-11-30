import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const initialState = {};

export default (state = initialState) => {
  const composeEnhancers =    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose; // eslint-disable-line

  const store = createStore(reducer, state, composeEnhancers(applyMiddleware(thunk)));

  return store;
};
