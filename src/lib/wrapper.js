/*
  REDUX/GRAPHQL NETWORK LAYER: HIGHER ORDER FUNCTION WRAPPER
  This HO Fn should wrap components and take a data requirement declaration.
*/

// Dependencies
import { merge } from 'lodash'

// Exports
export function wrapper(component, data) {
  component.helloWorld = function() {
    console.log('added helloWorld method to component')
  }
  // Unused, mostly for logging/testing purposes
  component.exposeCursor = function() {
    return data.cursor
  }
  component.merge = function(obj1, obj2) {
    return merge(obj1, obj2)
  }
  // used when calling actions
  component.exposeData = function() {
    return {
      cursor: data.cursor,
      fragment: data.fragment
    }
  }
  // used when composing fragments
  component.exposeFragment = function() {
    return data.fragment
  }
  // expose mutation
  component.exposeMutations = function() {
    return {
      mutations: data.mutations
    }
  }
  // get specific mutation
  component.getMutation = function(mutation) {
    return data.mutations[mutation]
  }

  return component
}
