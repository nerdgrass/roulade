/*
  ROULADE INDEX
  Just import/export & renaming to present a pretty API
*/

import * as actions from './actions'
import { rouladeReducer as reducer } from './reducer'
import combineReducers from './combineReducers'
import { wrapper } from './wrapper'
import { BODY, QL } from './dsl'

export {
  actions,
  reducer,
  combineReducers,
  wrapper,
  QL,
  BODY,
}
