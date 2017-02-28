import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'css-wipe'
import './styles.css'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    console.clear()
    const NewApp = require('./App').default
    ReactDOM.render(
      <NewApp />,
      document.getElementById('root')
    );
  })
}
