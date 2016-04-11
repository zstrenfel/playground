import React from 'react'
import { render } from 'react-dom'
import emoji from 'node-emoji'


class App extends React.Component {

  render() {
    return (
      <div className="content">
        {this.props.children}
      <footer className="final">
        Made with {emoji.get('coffee')} & {emoji.get('heart')} by Zach & Sachal. Check out the repository <a href="#">here</a>.
      </footer>
      </div>
    )
  }
}

export default App