import * as Colors from 'styles/colors'
import * as Spacing from 'styles/spacing'
import fontScale from 'styles/fontScale'

interface Theme {
  colors: {
    accent: string
    base: string
    light: string
    complement: string
  }
  borders: {
    light: string
  }
  gradients: {
    linear: string
    linearMobile: string
  }
  spacings: {
    defaultGridGap: string
  }
  breakpoints: {
    small: string
  }
  fontScale: {
    h00: string
    h0: string
    h1: string
    h2: string
    h3: string
    h4: string
    h5: string
    h6: string
    base: string
  }
}

const theme: Theme = {
  colors: {
    accent: Colors.blue,
    base: Colors.black,
    light: Colors.xLightGray,
    complement: Colors.magenta,
  },
  borders: {
    light: '1px solid ${Colors.lightGray}',
  },
  gradients: {
    linear: 'linear-gradient(-90deg, rgba(0,0,0,0) 20%, rgba(0,0,0, 1))',
    linearMobile:
      'linear-gradient(-90deg, rgba(0,0,0,0.5) 20%, rgba(0,0,0, 1))',
  },
  spacings: {
    defaultGridGap: '0.5rem',
  },
  breakpoints: {
    small: Spacing.breakpoint,
  },
  fontScale: {
    ...fontScale,
  },
}

export default theme
