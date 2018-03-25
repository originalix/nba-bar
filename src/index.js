import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from './styles/theme';
import './styles/global';
import configureStore from './store';
import App from './containers/App';

const store = configureStore();

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/']} initialIndex={1}>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

module.hot.accept();
