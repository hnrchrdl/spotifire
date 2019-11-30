import './global.css';
import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withStore from '../store/withStore';

class SpotifireApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withStore(SpotifireApp);
