import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'

let socket = io(`http://localhost:8000`);


class Arena extends React.Component {
  constructor(props) {
    super(props);
    this.state = {guess: "",
                  user:  "",
                  opponent: "",
                  room: "",
                  myScore: 0,
                  opponentScore: 0}
    this.changeHandler = this.changeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    let pathname = this.props.location.pathname.split('/');
    let roomNum = (pathname[pathname.length-2]);
    let name = (pathname[pathname.length-1]);
    this.setState({room: roomNum, user: name});
  }
  componentDidMount() {
    //set room
    socket.emit('join_room', {room: this.state.room })
    //recieve message
    socket.on('pull_message', (data) => {
      console.log('message recived', data);
    });
    //send user data
    socket.emit('init', {user: this.state.user, room: this.state.room});
    //recieve user data
    socket.on('init', (opponent) => {
      this.setState({opponent: opponent})
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let message = {
      room: this.state.room,
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
        <h1>Welcome to the Arena, {this.state.user}!</h1>

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