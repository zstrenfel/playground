import React from 'react'
import { render } from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import App from './app'
import Home from './components/home'
import Arena from './components/arena'


render (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Arena} />
      <Route path="/home" component={Home}/>
      <Route path="/arena/:arena/:name" component={Arena}/>
    </Route>
  </Router>,
  document.getElementById('container')
);