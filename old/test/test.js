import chai, { expect } from 'chai'


import { actions, reducer } from '../index.js'

// Mocks
const mockState = {
  parentState: {
    foo: 'bar',
    childState: []
  }
}
const mockSchema = {
  cursor: 'parentState.childState',
  fragment: `id`
}
const mockResponse = [
  {
    id: '00',
    foo: 'bar'
  },
  {
    id: '01',
    bar: 'baz'
  }
]

describe('Actions', function() {
  context('Query', function() {
    // unsure how to test yet
  })
  context('Query Request', function() {
    it('returns an object', function() {
      expect(actions.queryRequest('foo', {}, mockSchema)).to.be.an('object')
    })
    it('has type: ROULADE_QUERY_REQUEST', function() {
      expect(actions.queryRequest('foo', {}, mockSchema))
        .to.have.property('type', 'ROULADE_QUERY_REQUEST')
    })
    it('has schema argument in return object', function() {
      expect(actions.queryRequest('foo', {}, mockSchema))
        .to.have.property('fragment', mockSchema)
    })
  })
  context('Query Success', function() {
    it('returns an object', function() {
      expect(actions.querySuccess(mockResponse, 'foo', {}, mockSchema))
        .to.be.an('object')
    })
    it('has type: ROULADE_QUERY_SUCESS', function() {
      expect(
        actions.querySuccess(mockResponse, 'foo', {}, mockSchema)
      ).to.have.property('type', 'ROULADE_QUERY_SUCCESS')
    })
    it('has response argument in return object', function() {
      expect(
        actions.querySuccess(mockResponse, 'foo', {}, mockSchema)
      ).to.have.property('response', mockResponse)
    })
    it('has schema argument in return object', function() {
      expect(
        actions.querySuccess(mockResponse, 'foo', {}, mockSchema)
      ).to.have.property('fragment', mockSchema)
    })
  })
  context('Query Error', function() {
    it('returns an object', function() {
      expect(actions.queryError('ERROR', 'foo', {}, mockSchema))
        .to.be.an('object')
    })
    it('has type: ROULADE_QUERY_ERROR', function() {
      expect(actions.queryError('ERROR', 'foo', {}, mockSchema))
        .to.have.property('type', 'ROULADE_QUERY_ERROR')
    })
  })

  context('Mutate', function() {
    // Unsure how to test yet.
  })
  context('Mutation Request', function() {
    it('throws an error if name param is not a string', () => {
      expect(()=>{actions.mutationRequest(42, `thing`, {lolcats: 'cats'})})
        .to.throw('`name` is required and must be a string')
        expect(()=>{actions.mutationRequest()})
          .to.throw('`name` is required and must be a string')
    })
    it('throws an error if fragment param is not a string', () => {
      expect(()=>{actions.mutationRequest('thing', 42, {lolcats: 'cats'})})
        .to.throw('`fragment` is required and must be a string')
      expect(()=>{actions.mutationRequest('thing')})
        .to.throw('`fragment` is required and must be a string')
    })
    it('throws an error if vars param is not an object', () => {
      expect(()=>{actions.mutationRequest('thing', `thing`, 'cats')})
        .to.throw('`vars` is required and must be an object')
      expect(()=>{actions.mutationRequest('thing', `thing`)})
        .to.throw('`vars` is required and must be an object')
    })
    it('returns an object', function() {
      expect(actions.mutationRequest(`lol`, `thing`, {lolcats: 'cats'}))
        .to.be.an('object')
    })
    it('has type: ROULADE_MUTATION_REQUEST', function() {
      expect(actions.mutationRequest(`lol`, `thing`, {lolcats: 'cats'}))
        .to.have.property('type', 'ROULADE_MUTATION_REQUEST')
    })
  })
  context('Mutation Error', function() {
    it('throws an error if name param is not a string', () => {
      expect(()=>{actions.mutationError(new Error('graphQL error'), 42, `thing`, {lolcats: 'cats'})})
        .to.throw('`name` is required and must be a string')
        expect(()=>{actions.mutationError(new Error('graphQL error'))})
          .to.throw('`name` is required and must be a string')
    })
    it('throws an error if fragment param is not a string', () => {
      expect(()=>{actions.mutationError(new Error('graphQL error'),'thing', 42, {lolcats: 'cats'})})
        .to.throw('`fragment` is required and must be a string')
      expect(()=>{actions.mutationError(new Error('graphQL error'),'thing')})
        .to.throw('`fragment` is required and must be a string')
    })
    it('throws an error if vars param is not an object', () => {
      expect(()=>{actions.mutationError(new Error('graphQL error'),'thing', `thing`, 'cats')})
        .to.throw('`vars` is required and must be an object')
      expect(()=>{actions.mutationError(new Error('graphQL error'),'thing', `thing`)})
        .to.throw('`vars` is required and must be an object')
    })
    it('returns an object', function() {
      expect(actions.mutationError(new Error('graphQL error'), 'stuff', `thing`, {lolcats: 'cats'}))
        .to.be.an('object')
    })
    it('has type: ROULADE_MUTATION_ERROR', function() {
      expect(actions.mutationError(new Error('graphQL error'), 'stuff', `thing`, {lolcats: 'cats'}))
        .to.have.property('type', 'ROULADE_MUTATION_ERROR')
    })
  })
  context('Mutation Success', function() {
    it('throws an error if name param is not a string', () => {
      expect(()=>{actions.mutationSuccess('response', 42, `thing`, {lolcats: 'cats'})})
        .to.throw('`name` is required and must be a string')
        expect(()=>{actions.mutationSuccess('response')})
          .to.throw('`name` is required and must be a string')
    })
    it('throws an error if fragment param is not a string', () => {
      expect(()=>{actions.mutationSuccess('response', 'thing', 42, {lolcats: 'cats'})})
        .to.throw('`fragment` is required and must be a string')
      expect(()=>{actions.mutationSuccess('response', 'thing')})
        .to.throw('`fragment` is required and must be a string')
    })
    it('throws an error if vars param is not an object', () => {
      expect(()=>{actions.mutationSuccess('response', 'thing', `thing`, 'cats')})
        .to.throw('`vars` is required and must be an object')
      expect(()=>{actions.mutationSuccess('response', 'thing', `thing`)})
        .to.throw('`vars` is required and must be an object')
    })
    it('returns an object', function() {
      expect(actions.mutationSuccess('response', 'thing', 'stuff', {lolcats: 'cats'}))
        .to.be.an('object')
    })
    it('has type: ROULADE_MUTATION_SUCCESS', function() {
      expect(actions.mutationSuccess('response', 'thing', 'stuff', {lolcats: 'cats'}))
        .to.have.property('type', 'ROULADE_MUTATION_SUCCESS')
    })
  })

})

describe('Reducer', function() {
  context('Query Request', function() {
    const mockQueryRequest = {
      type: 'ROULADE_QUERY_REQUEST',
      fragment: mockSchema
    }
    it('injects loading status into state w/ value of loading', function() {
      expect(
        reducer(mockState, mockQueryRequest)
      ).to.have.deep.property('parentState.parentStateQueryStatus', 'loading')
    })
  })
  context('Query Success', function() {
    const mockQuerySuccess = {
      type: 'ROULADE_QUERY_SUCCESS',
      response: mockResponse,
      fragment: mockSchema
    }
    it('injects response into state', function() {
      expect(
        reducer(mockState, mockQuerySuccess)
      ).to.have.deep.property('parentState.childState', mockResponse)
    })
    it('updates loading cursor to have value of loaded', function() {
      expect(
        reducer(mockState, mockQuerySuccess)
      ).to.have.deep.property('parentState.parentStateQueryStatus', 'loaded')
    })
  })
  context('Query Error', function() {
    const mockQueryError = {
      type: 'ROULADE_QUERY_ERROR',
      error: 'ERROR!!!1',
      fragment: mockSchema
    }
    it('updates loading cursor to have value of error', function() {
      expect(
        reducer(mockState, mockQueryError)
      ).to.have.deep.property('parentState.parentStateQueryStatus', 'error')
    })
  })
})
