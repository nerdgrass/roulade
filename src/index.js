/*
  ROULADE INDEX
  Just import/export & renaming to present a pretty API
*/

import * as actions from './lib/actions'
import { rouladeReducer as reducer } from './lib/reducer'
import combineReducers from './lib/combineReducers'
import { wrapper } from './lib/wrapper'
import { BODY, QL } from './lib/dsl'

export {
  actions,
  reducer,
  combineReducers,
  wrapper,
  QL,
  BODY,
}
