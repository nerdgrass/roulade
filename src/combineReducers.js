/*
  ROULADE COMBINEREDUCERS REPLACEMENT

  The only way to manipulate state in Redux is via dispatching an action that
  triggers a store's reducer functions. However, normal redux reducers create
  application state. If you have a `todo` reducer, all state that is being
  manipulated will show up as:

  state: {
    todo: {
      // todo state here
    }
  }

  This is a good idea - it makes reducers directly map application state, leading
  to simpler & more managable state. However, for our purposes, its bad news bears.

  To provide a simple & clean interface for GraphQL, we need to abstract async
  Actions somewhat - we don't need a different action for every query, we need
  one query that can be reused. To this end, we're replacing & extending redux's
  `combineReducers` function to allow for us to manipulate the state so that
  components can state the data they need and then Roulade can get it for them.

  By replacing `combineReducers`, Roulade gets access to the store's internal state,
  which is never exposed anywhere else. We replace it with a function that does
  the exact same thing the redux `combineReducers` function does, unless a Roulade
  action has been fired. Then we run it through Roulade's own reducer that takes
  the cursor from the action and updates state w/ the successful response from
  the graphQL server.

*/


// Dependencies
import { combineReducers as reduxCombineReducers } from 'redux'
import { rouladeReducer } from '../roulade/reducer'

// If user wants to replace redux's combineReducers fn
const combineReducers = (reducers) => {
  const combinedReducers = reduxCombineReducers(reducers)
  return function (state, action) {
    const updatedAppState = combinedReducers(state, action)
    return rouladeReducer(updatedAppState, action)
  }
}

export default combineReducers
