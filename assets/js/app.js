import React from 'react'
import { render } from 'react-dom'
import emoji from 'node-emoji'


class App extends React.Component {
  render() {
    return (
      <div className="content">
      <header><h1>Playground</h1></header>
        {this.props.children}
      <footer className="final"> Made with {emoji.get('coffee')} & {emoji.get('heart')} & {emoji.get('eggplant')} & {emoji.get('new_moon_with_face')} & {emoji.get('beers')}.</footer>
      </div>
    )
  }
}

export default App