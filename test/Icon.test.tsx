import React from 'react'
import renderer from 'react-test-renderer'
import Account from '../src/Account'

test(`Render Icon`, () => {
  renderer.create(<Account />)
})