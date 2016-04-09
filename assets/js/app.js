import React from 'react'
import { render } from 'react-dom'


class App extends React.Component {

  render() {
    return (
      <div className="content">
        {this.props.children}
      </div>
    )
  }
}

export default App