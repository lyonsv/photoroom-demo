import React from 'react'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from 'styles/global'
import theme from 'styles/theme'

type PageType = {
  title?: string
  description?: string
  children: React.ReactNode
}

const Page: React.FC<PageType> = ({
  title,
  description,
  children,
}: PageType) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='Description' content={description} />
      <link rel='icon' href='/favicon.ico' />
    </Head>
    {children}
  </ThemeProvider>
)

Page.defaultProps = {
  title: 'Built Base App',
  description: 'Can be used to setup projects with Next.js',
}

export default Page
