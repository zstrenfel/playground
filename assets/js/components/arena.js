import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'
import CountdownTimer from './countdownTimer'

import Word from './word'
import Synonyms from './synonyms'
import WordGuessForm from './wordguessform'
import Data from './wordlistLevel1.json'

var data = Data.data[0];

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

  constructor(props) {
  	super(props);
  	this.state = {guess: "",
                  currentTime: 100,
                  user:  "",
                  opponent: "Geraldo",
                  room: "",
                  myScore: 0,
                  opponentScore: 0,
                  timer: true,
                  timeRemaing: 10000,
                  isMounted: false,
                };
    this.changeHandler = this.changeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleTimeEnd = this.handleTimeEnd.bind(this);
    this.handleGuessEntry = this.handleGuessEntry.bind(this);
  }

  componentWillMount() {
    let pathname = this.props.location.pathname.split('/');
    let roomNum = (pathname[pathname.length-2]);
    let name = (pathname[pathname.length-1]);
    this.setState({room: roomNum, user: name, isMounted: true});
  }
  //mostly for socket io
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
  componentWillUnmount() {
    this.setState({isMounted: false})
  }
  handleGuessEntry(g) {
  	console.log("The below is g");
  	console.log(g)
  	this.setState({guess: g})
  }
  handleTimeEnd() {
    console.log('timer is done');
  }

  render() {
    //test here by decrementing time
    console.log("Changing time");
    this.state.currentTime -= 5;
    return (
      <div className="arena">
        <h1>Welcome to the Arena, {this.state.user}!</h1>
        <div className="timer-wrapper">
          <CountdownTimer start={this.state.timer}
                      initialTimeRemaining={10000}
                      completeCallback={this.handleTimeEnd}
                      />
        </div>

        <h2> This is the main word </h2>
      	{data.word}

      	<h2> These are the synoyms to guess </h2>
      	<Synonyms synonyms={data.synonyms} guess={this.state.guess} currentTime={this.state.currentTime}/>

      	<h2> This is the entry form </h2>
				<WordGuessForm onGuessSubmit={this.handleGuessEntry}/>

        <div className="player-zone">
          <div className="player">
            <div className="my-points points">{this.state.myScore}</div>
            <div className="profile">
              <h3>{this.state.user}</h3>
              <div className="sponsor">
                Sponsoring: Saparkul
                <img src={'./imgs/saparkul.jpg'} />
              </div>
            </div>
          </div>
          <div className="player">
            <div className="opponent-points points">{this.state.opponentScore}</div>
            <div className="profile">
              <h3>{this.state.opponent}</h3>
              <div className="sponsor">
                Sponsoring: Saparkul
                <img src={'./imgs/saparkul.jpg'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}


export default Arena;