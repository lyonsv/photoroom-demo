import React from 'react'
import Layout from 'layouts/Base'
import { H1, P } from 'styles/typography'
import { Container } from 'styles/layout'
import Photoroom from 'components/Photoroom'

const Home: React.FC = () => {
  return (
      <Layout>
      <Container>
        <H1 light data-testid='homepage-title'>
          Photoroom example
          </H1>
          <P light>👋 Hi there. You can try out the photoroom api for adding a floating shadow here.</P>
          <P light>✏️  Put your background in the left and your object in the right below. I didn't have time to add labels and fix the layout.</P>
          <P light>💡 This just applies the floating shadow from the photoroom api. You can find out more in their <a href="https://www.photoroom.com/api/docs/reference?_gl=1*18d75db*_ga*MTQwNDY2Njk3Ni4xNzE1ODg5Mzkx*_ga_JBZP7ETRKK*MTcxNjMyNTc5My4xNS4xLjE3MTYzMjY3NTMuMC4wLjA.">docs.</a></P>
        <Photoroom />
      </Container>
    </Layout>
  )
}

export default Home
