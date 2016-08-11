/*
  ROULADE INDEX
  Just import/export & renaming to present a pretty API
*/

import * as actions from './src/actions'
import { rouladeReducer as reducer } from './src/reducer'
import combineReducers from './src/combineReducers'
import { wrapper } from './src/wrapper'
import { BODY, QL } from './src/dsl'

export {
  actions,
  reducer,
  combineReducers,
  wrapper,
  QL,
  BODY,
}
