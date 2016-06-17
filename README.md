# Roulade v0.0.3
Roulade is a library to enable React & Redux applications to easily work with
GraphQL servers. Please note that this library is under heavy development -
please pardon the rough edges.

## Installation
* `npm install roulade`

## API
### Wrapper
`wrapper` is a higher-order function allows you to state a component's data
requirements inline with the component then call those requirements later when
required.

Recommended usage of Roulade with Redux & React is to export your components with
the wrapper function (a la `wrapper(component)`).
```
const Todo = (props) => { //Component goes here }
wrapper(Todo, {
  fragment: `
    ... on Todo {
      id
      status
    }
  `
})
```
Wrapper adds the following methods to a wrapped component:
* `component.exposeFragment()` which will return the stated data requirements to
the wrapped component. Roulade commonly refers to data requirements as `dataSpec`.
Using the example above, `Todo.exposeFragment()` would return the following
template string:
```
`
  ... on Todo {
    id
    status
  }
`
```

### Actions
  * `actions.query(root, vars, dataSpec, options)`
    - **Root** - *QL Template String* - This is a template string encoded via the
    `QL` module. TODO - MORE DOCS NEEDED
    - **Vars** - *Object* - This object contains the query variables required for
    the graphQL query.
    - **Data Spec** - *QL Template String* - TODO - MORE DOCS NEEDED
    - **Options** - *Object* - This object contains Roulade-specific config for
    the specified mutation. Options are as follows:
      * `noload` - *Boolean* - This option specifies whether or not you would like
      Roulade to generate and manage loading state for this query.
      * `action` - *Function* - This option specifies a function to be called if
      the query is successful. In a redux-style architecture, this should
      probably be an action.
  * `actions.mutate(name, fragment, vars, options)`
    - **Name** - *String* - This is the name of the mutation you would like to
    invoke on the server.
    - **Fragment** - *Template String* - This is the fragment you would like to
    get back from the server on mutation success.
    - **Vars** - *Object* - This object contains the query variables the mutation
    specified by `name` requires. When parsing the `vars` object, the `mutate`
    function uses the object's keys as the variable names. So a `vars` object of
    `{ thing: 'stuff' }` would be rendered as `$thing: 'stuff'` in the mutation.
    The `vars` object can have as many keys as needed and the values of those keys
    can be strings, ints, bools, even nested objects - whatever is a valid JS obj
    and works for your GraphQL endpoint.
    - **Options** - *Object* - This object contains Roulade-specific config for
    the specified mutation. Options are as follows:
      * `request` - *Function* - This option specifies a function to be called
      immediately before attempting the mutation. In a redux-style architecture,
      this should probably be an action.
      * `success` - *Function* - This option specifies a function to be called
      if the mutation is successful. In a redux-style architecture, this should
      probably be an action.
      * `error` - *Function* - This option specifies a function to be called
      if the mutation isn't successful. In a redux-style architecture, this
      should probably be an action.


## Notes
  * Internal structure mirrors Redux as much as possible
    * State manipulation done by action/reducer
  * Assumes users will be using smart/dumb component paradigm
    - Like what Redux suggests (IE, we're designing for redux apps)
    - Smart components can also be referred to as 'container' components

### Component Interface
  * Components all use `{...this.props}` shorthand
    * Automatically pass down all props everywhere
    * Needed in case of props and/or children changing dynamically
  * HO fns wrap components & state their data requirements
    - Syntax needed to express data requirements
      * Probably involves template strings
    - Method needed to expose data requirements to parent components
      * This allows smart components to compose queries based off children
    - Use higher order functions for now, investigate decorator solution
  * Smart components need a way to compose query & pass it down via props
    - Example:
      * <App> composes the query action
        - Via template string for query vars
        - Via children's HO fn method to expose data reqs
      * <App> passes query action down to <SearchBar /> via props
      * <SearchBar> calls completed query action from props in clickHandler

### Actions
  * Roulade actions are generic, as in should cover all graphQL needs
    * Queries: query, queryRequest, querySuccess, queryError
    * Mutations: mutation, mutationRequest, mutationSuccess, mutationError
  * Possible place to format data req syntax, if needed by Action
  * Takes output of container query constructor & performs graphQL operation

### Roulade Reducer
  * Implemented via replacing & extending redux's `combineReducers` function
    - this is optional! the actual roulade reducer fn is exposed as well
  * Covers all Roulade actions above
  * Possible place to format data req syntax, if needed by state
  * Takes response from graphQL & cursor, outputs modified state
    * state cursor should point to where in app state results go
    * maybe add in optional formatting function argument?
    * Lodash `get()`/`set()` methods used for manipulating state

### Unanswered Questions/Unfinished Areas
  * How do we handle 'loading' states of components?
  * What component wrapper syntax do we need to express data requirements?
    - IE edges, nodes, etc
  * How do we construct state cursors w/o making this more complex?
    - use compoent.exposeData() to expose cursor as well as fragment. Rename?
    - use lodash get/set syntax for cursor (IE, 'results.resultsItems')
    - Manually set cursor at top of component tree. Figure out how to generate
      cursors after Roulade is functional.
  * MUTATIONS ARE NOT DONE
    - Calling the mutation works, but handling a successful mutation does not
    - Mutation cursors (IE, where do we put the mutate action's response) is at
      an impasse.
    - This is probably an issue w/ cursors in general - how do we
      make cursors that can traverse an array when the wrapper function has no
      access to component props?

### Documented Code Examples ('documented' may/may not be subjective)
  * For Roulade's source, check out:
    - `/reducers/roulade.js` is the reducer that manipulates client app state
    - `/roulade/actions.js` is an example implementation of Roulade actions.
    - `/roulade/combineReducers.js` injects roulade's reducer along w/ extending
      redux's `combineReducers` call.
    - `/roulade/wrapper.js` is the higher order function that wraps components
      and exposes their data requirements.
  * For examples of Roulade's implementation, check out:
    - `/containers/app.js` has the actual roulade query implementation
    - `/components/results.js` has an example of a dumb parent component grabbing
      child data requirements
    - `/components/ticket.js` has an example of a dumb component declaring its
      data requirements in fragment form

### Custom `combineReducers`
The only way to manipulate state in Redux is via dispatching an action that
triggers a store's reducer functions. However, normal redux reducers create
application state. If you have a `todo` reducer, all state that is being
manipulated will show up as:
```
state: {
  todo: {
    // todo state here
  }
}
```
This is a good idea - it makes reducers directly map application state, leading
to simpler & more manageable state. However, for our purposes, its bad news bears.

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
