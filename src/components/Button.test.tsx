import React from 'react'
import { render } from 'react-testing-library'

import Button, { DecoyButton } from './Button'

it(`renders Button`, () => {
  const { container } = render(<Button>foo</Button>)
  expect(container.firstChild).toMatchSnapshot()
})

it(`renders primary Button`, () => {
  const { container } = render(<Button primary>Primary</Button>)
  expect(container.firstChild).toMatchSnapshot()
})

it(`renders danger Button`, () => {
  const { container } = render(<Button danger>Danger!</Button>)
  expect(container.firstChild).toMatchSnapshot()
})

it(`renders DecoyButton`, () => {
  const { container } = render(<DecoyButton>DecoyButton</DecoyButton>)
  expect(container.firstChild).toMatchSnapshot()
})
