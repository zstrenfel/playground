import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'

let socket = io(`http://localhost:8000`);


class Arena extends React.Component {
  constructor(props) {
    super(props);
    this.state = {guess: "",
                  user: {name: "John"},
                  opponent: {}}
    this.changeHandler = this.changeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    socket.on('pull_message', (data) => {
      console.log('message recived', data);
    });
    socket.emit('init', this.state.user);
  }


  handleSubmit(e) {
    e.preventDefault();
    let message = {
      guess: this.state.guess
    }
    socket.emit('push_message', message)
    this.setState({guess: ""});
  }
  changeHandler(e) {
    this.setState({guess: e.target.value});
  }

  render() {
    return (
      <div className="arena">
        <h1>Welcome to the Arena!</h1>

        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.guess}
            onChange={this.changeHandler}
          />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default Arena;