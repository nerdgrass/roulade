/*
  ROULADE REDUCER

  This is where the magic happens (insert '/giphy sorcery' here)! Roulade behaves
  like a redux app under the hood - it uses actions and reducers to mutate client
  state.

*/

// Dependencies
import { cloneDeep, get, set, unset } from 'lodash'

// This generates a cursor for a nonexistent field in application state to handle
// loading status. Its injected in the top level of the cursor (side by side w/
// where the query results end up). It adds 'Status' to the same name. IE, a Query
// for results would end up with:
// results: {
//   resultsStatus: 'loading' || 'loaded'
// }
// Its up to the components to consume this status as they will, but the status
// of a component's query will be made available to the component.
function generateLoadingCursor(type, cursor) {
  const subcursorArray = cursor.match("^[^.]*")
  return subcursorArray[0] + '.' + subcursorArray[0] + type + 'Status'
}

// Roulade Reducer
export function rouladeReducer(state, action) {
  const oldState = cloneDeep(state)
  switch(action.type) {

    // Query handlers
    case 'ROULADE_QUERY_REQUEST':
      const loadingQueryCursor = generateLoadingCursor('Query', action.fragment.cursor)
      return set(oldState, loadingQueryCursor, 'loading')
    case 'ROULADE_QUERY_ERROR':
      const errorErrorCursor = generateLoadingCursor('Query', action.fragment.cursor)
      return set(oldState, errorErrorCursor, 'error')
    case 'ROULADE_QUERY_SUCCESS':
      if (!action.noload) {
        if (action.action) {
          const loadedQueryCursor = generateLoadingCursor('Query', action.fragment.cursor)
          return set(oldState, loadedQueryCursor, 'loaded' )
        } else {
          const stateWithQueryResponse = set(oldState, action.fragment.cursor, action.response)
          const loadedQueryCursor = generateLoadingCursor('Query', action.fragment.cursor)
          return set(stateWithQueryResponse, loadedQueryCursor, 'loaded' )
        }
      } else {
        return oldState
      }
      break




// Mutation Handlers
// So, do we need loading state for the mutations? I'm not sure how a component
// would know the particular instance of mutation state would apply to it,
// especially considering it gets a random ID attached in roulade actions.
// Specifically, do we need to handle loading state at all w/ mutations?
    case 'ROULADE_MUTATION_REQUEST':
      // const loadingMutationCursor = generateLoadingCursor('results.mutation', action.name)
      // return set(oldState, loadingMutationCursor, 'loading')
      return state
    case 'ROULADE_MUTATION_ERROR':
      // const errorMutationCursor = generateLoadingCursor('results.mutation', action.name)
      // return set(oldState, errorMutationCursor, 'error')
      return state
    case 'ROULADE_MUTATION_SUCCESS':
      // if (!action.noload) {
      //   if (action.success) {
      //     const loadedMutationCursor = generateLoadingCursor('results.mutation', action.name)
      //     // Change this to remove loading state
      //     return unset(oldState, loadedMutationCursor)
      //   }
      // }
      return state
    default:
      return state
  }
}
