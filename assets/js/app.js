import React from 'react'
import { render } from 'react-dom'


class App extends React.Component {
  render() {
    return (
      <div className="content">
      <header><h1>Playground</h1></header>
        {this.props.children}
      </div>
    )
  }
}

export default App