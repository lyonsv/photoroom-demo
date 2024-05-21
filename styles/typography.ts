import styled, { css } from 'styled-components'
import { headerFont, baseFont } from './fonts'

interface Heading {
  light?: boolean
  typeface?: boolean
  accent?: boolean
  lowercase?: boolean
  'data-testid'?: string
}

const headerStyles = css<Heading>`
  text-rendering: optimizeLegibility;
  font-family: ${headerFont};
  text-transform: ${props => (props.lowercase ? 'none' : 'uppercase')};
  color: ${props =>
    props.light ? props.theme.colors.light : props.theme.colors.base};
`

const H1 = styled.h1<Heading>`
  font-size: ${props => props.theme.fontScale.h1};
  ${headerStyles};
`

const H2 = styled.h2<Heading>`
  font-size: ${props => props.theme.fontScale.h2};
  ${headerStyles};
`

const H3 = styled.h3<Heading>`
  font-size: ${props => props.theme.fontScale.h3};
  ${headerStyles};
`

const H4 = styled.h4<Heading>`
  font-size: ${props => props.theme.fontScale.h4};
  ${headerStyles};
`

const H5 = styled.h5<Heading>`
  font-size: ${props => props.theme.fontScale.h5};
  ${headerStyles};
`

const H6 = styled.h6<Heading>`
  font-size: ${props => props.theme.fontScale.h6};
  ${headerStyles};
`

const P = styled.p<Heading>`
  font-size: ${props => props.theme.fontScale.base};
  line-height: 1.5em;
  font-family: ${baseFont};

  ${props =>
    props.light &&
    css`
      color: ${props => props.theme.colors.light};
      line-height: 1.75em;
    `}
`

export { H1, H2, H3, H4, H5, H6, P }
