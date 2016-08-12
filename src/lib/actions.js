/*
  ROULADE ACTION TYPES
  This may deserve its own file
*/

// Mutation Actions
export const ROULADE_MUTATION_REQUEST = 'ROULADE_MUTATION_REQUEST'
export const ROULADE_MUTATION_SUCCESS = 'ROULADE_MUTATION_SUCCESS'
export const ROULADE_MUTATION_ERROR = 'ROULADE_MUTATION_ERROR'

// Query Actions
export const ROULADE_QUERY_REQUEST = 'ROULADE_QUERY_REQUEST'
export const ROULADE_QUERY_SUCCESS = 'ROULADE_QUERY_SUCCESS'
export const ROULADE_QUERY_ERROR = 'ROULADE_QUERY_ERROR'

/*
  ROULADE ACTIONS

  Query and Mutate are async actions, the rest are just normal Redux style actions.
  Since Roulade follows Redux's structure internally, we use actions and reducers
  to manipulate client-side application state. These actions should cover all
  potential graphQL server interaction.
*/

// Dependencies
import { isPlainObject, isArray, isUndefined, uniqueId } from 'lodash'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'

// Query Actions
export function query(root, vars, dataSpec, options = {}) {
  // Potential options include path, action, and noload.
  // Fill in default for path.  action and noload should remain undefined if undefined.
  const { action, noload } = options
  const path = options.path ? options.path : 'search'

  const client = createClient(options)

  return dispatch => {
    // handle loading state unless noload option specified
    if (!noload) {
      dispatch(queryRequest(root, vars, dataSpec))
    }

    let q
    if (typeof root === 'string') {
      q = root
    } else {
      // FIXME: Assert about the nature of `root`. We expect the result of a
      // roulade.QL template string, but we don't make sure that's what we've
      // got.
      q = root.pre + dataSpec.fragment
      if (root.post) {
        q += root.post
      }
    }

    client.query(q, vars).then(response => {
      // Set path to 'search', the default, if undefined
      let responsePath = isUndefined(path) ? 'search' : path
      response = response[responsePath]
      /* TODO - Add docs for this.
        if you pass an action to roulade's query action, it calls that action
        instead of updating the state itself. So if that action is present, we call
        both querySuccess as well as whatever action was passed to query() passing
        both the same arguments so users can do whatever they want w/ the query
        response.
      */
      if(action) {
        const customActionOnSuccess = () => {
          dispatch(querySuccess(response, root, vars, dataSpec, action, noload))
          dispatch(action(response, root, vars, dataSpec))
        }
        return customActionOnSuccess()
      } else {
        return dispatch(querySuccess(response, root, vars, dataSpec))
      }
    }, error => {
      console.log('GraphQL Query Failed: ', error)
      return dispatch(queryError(error, root, vars, dataSpec))
    })
  }
}

export function queryRequest(root, vars, fragment) {
  if (root === undefined) { throw new TypeError('`root` is required') }
  if (vars === undefined) { throw new TypeError('`vars` is required') }
  if (fragment === undefined) { throw new TypeError('`fragment` is required') }

  return {
    type: ROULADE_QUERY_REQUEST,
    root,
    vars,
    fragment
  }
}

export function querySuccess(response, root, vars, fragment, action, noload) {
  if (response === undefined) { throw new TypeError('`response` is required') }
  if (root === undefined) { throw new TypeError('`root` is required') }
  if (vars === undefined) { throw new TypeError('`vars` is required') }
  if (fragment === undefined) { throw new TypeError('`fragment` is required') }
  if (action) {
    return {
      type: ROULADE_QUERY_SUCCESS,
      response,
      root,
      vars,
      fragment,
      action,
      noload
    }
  }

  return {
    type: ROULADE_QUERY_SUCCESS,
    response,
    root,
    vars,
    fragment,
    action
  }
}

export function queryError(error, root, vars, fragment) {
  if (error === undefined) { throw new TypeError('`error` is required') }
  if (root === undefined) { throw new TypeError('`root` is required') }
  if (vars === undefined) { throw new TypeError('`vars` is required') }
  if (fragment === undefined) { throw new TypeError('`fragment` is required') }

  return {
    type: ROULADE_QUERY_ERROR,
    error,
    root,
    vars,
    fragment
  }
}


// Mutation Actions
export function mutate(name, fragment, vars, options = {}) {
  const { noload, request, error, success } = options

  const client = createClient(options)
  const mutation = `{
    ${name}(${formatVarObj(vars)})
    ${fragment}
  }`

  // this gives each mutation a unique ID for loading state purposes, however its
  // not known to the component that cares about it, so... blerg. See reducer for
  // more details on mutation loading state question.
  const uniqueName = uniqueId(name + '_')
  function formatVarObj(varObj) {
    // stringify & remove quotes from only 1st level keys
    const varString = JSON.stringify(varObj).replace(/\"([^(\")"]+)\":/g,"$1:")
    // return string after trimming braces
    return varString.substr(1,varString.length-2)
  }

  return (dispatch) => {
    // handle loading state unless noLoad option specified
    !noload ? dispatch(mutationRequest(uniqueName, fragment, vars, options)) : null
    client.mutate(mutation).then( response => {
      const result = success ?
        dispatch(success(response, name, fragment, vars, options)) &&
        dispatch(mutationSuccess(response, uniqueName, fragment, vars, options)) :
        dispatch(mutationSuccess(response, uniqueName, fragment, vars, options))
      return result
    }, error => {
      return dispatch(mutationError(error, uniqueName, fragment, vars, options))
    })
  }
}

// Given an option object, construct an appropriate Lokka client.
// TODO: Give consumers more control over this. Maybe they won't want to do
// HTTP transport.
function createClient(options) {
  const host = options.host || ''

  // TODO: The change for headers and host should be replicated in Backstage.
  // Or we should finally pull Roulade out.
  const headers = options.token ? {
    authorization: `Token token='${options.token}'`,
  } : {}

  return new Lokka({
    transport: new Transport(host + '/graphql', {headers}),
  })
}

export function mutationRequest(name, fragment, vars, options) {
  if (name === undefined || typeof name !== 'string') {
    throw new TypeError('`name` is required and must be a string')
  }
  if (fragment === undefined || typeof fragment !== 'string') {
    throw new TypeError('`fragment` is required and must be a string')
  }
  if (vars === undefined || typeof vars !== 'object') {
    throw new TypeError('`vars` is required and must be an object')
  }
  return {
    type: ROULADE_MUTATION_REQUEST,
    name, fragment, vars, options
  }
}
export function mutationSuccess(response, name, fragment, vars, options) {
  if (name === undefined || typeof name !== 'string') {
    throw new TypeError('`name` is required and must be a string')
  }
  if (fragment === undefined || typeof fragment !== 'string') {
    throw new TypeError('`fragment` is required and must be a string')
  }
  if (vars === undefined || typeof vars !== 'object') {
    throw new TypeError('`vars` is required and must be an object')
  }
  return {
    type: ROULADE_MUTATION_SUCCESS,
    response, name, fragment, vars, options
  }
}
export function mutationError(error, name, fragment, vars, options) {
  if (name === undefined || typeof name !== 'string') {
    throw new TypeError('`name` is required and must be a string')
  }
  if (name === undefined || typeof name !== 'string') {
    throw new TypeError('`name` is required and must be a string')
  }
  if (fragment === undefined || typeof fragment !== 'string') {
    throw new TypeError('`fragment` is required and must be a string')
  }
  if (vars === undefined || typeof vars !== 'object') {
    throw new TypeError('`vars` is required and must be an object')
  }
  return {
    type: ROULADE_MUTATION_ERROR,
    error, name, fragment, vars, options
  }
}
