import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'
import CountdownTimer from './countdownTimer'
import classNames from 'classnames'

import Word from './word'
import Synonyms from './synonyms'
import WordGuessForm from './wordguessform'
import Data from './wordlistLevel1.json'
import emoji from 'node-emoji'


var data = Data.data[0];
var socket = io('http://localhost:8000');

class Arena extends React.Component {

  constructor(props) {
    super(props);
    this.state = {guess: "",
                  opponentGuess: "",
                  currentTime: 100,
                  user:  "",
                  opponent: "",
                  room: "",
                  myScore: 0,
                  opponentScore: 0,
                  timeRemaining: 60,
                  isMounted: false,
                  start: true,
                };
    this.handleTick = this.handleTick.bind(this);
    this.handleTimeEnd = this.handleTimeEnd.bind(this);
    this.handleGuessEntry = this.handleGuessEntry.bind(this);
    this.tick = this.tick.bind(this);
    this.givePoints = this.givePoints.bind(this);
  }

  /** Timer function */
  tick() {
    this.setState({timeRemaining: this.state.timeRemaining - 1});
    if (this.state.timeRemaining <= 0) {
      clearInterval(this.interval);
      console.log('time is up');
    }
  }

  componentWillMount() {
    let pathname = this.props.location.pathname.split('/');
    let roomNum = (pathname[pathname.length-2]);
    let name = (pathname[pathname.length-1]);
    this.setState({room: roomNum, user: name, isMounted: true});
  }

  //mostly for socket io
  componentDidMount() {
    //commment this out later
    this.interval = setInterval(this.tick, 1000);
    //set room
    socket.emit('join_room', {room: this.state.room })
    //recieve message
    socket.on('pull_message', (data) => {
      console.log('message recived', data);
      this.setState({opponentGuess: data.message})
    });
    socket.on('take_name', (opponent) => {
      this.setState({opponent: opponent, start: true})
      this.interval = setInterval(this.tick, 1000);
    })
    //send user data
    socket.emit('init', {user: this.state.user, room: this.state.room});
    //recieve user data
    socket.on('init', (opponent) => {
      this.setState({opponent: opponent, start: true})
      socket.emit('give_name', {user: this.state.user, room: this.state.room});
      this.interval = setInterval(this.tick, 1000);
    })
    socket.on('take_points', (points) => {
      console.log(points);
      this.setState({opponentScore: points})
    })
  }
  componentWillUnmount() {
    this.setState({isMounted: false});
    clearInterval(this.interval);
  }
  handleGuessEntry(g) {
    this.setState({guess: g})
    socket.emit('push_message', {room: this.state.room, message: g});
  }
  handleTimeEnd() {
    console.log('timer is done');
  }
  handleTick(time) {
    console.log("time remaining: ", time);
  }
  startGame() {
    if (this.state.opponent === "") {
    }
  }
  givePoints() {
    let points = Math.floor(2 * this.state.timeRemaining) + this.state.myScore;
    console.log('points', points);
    this.setState({myScore: points})
    socket.emit('tell_points', {room: this.state.roomNum, score: points});
  }

  render() {
    let opponent = this.state.opponent !== "" ? () => {return (<h3>this.state.opponent</h3>)} : "Waiting for opponent..."
    let mainClasses = classNames('question-content', {show: this.state.start});
    let hiddenClasses = classNames('block', {show: !this.state.start});
    return (
      <div className="arena">
        <div className={mainClasses}>
          <div className="timer-wrapper">
            <h2 className="left main-word">{data.word}</h2>
            <div className='timer'>
              {this.state.timeRemaining}
            </div>
          </div>

          <h2 className="synonyms-title"> Synonyms: </h2>
          <Synonyms givePoints={this.givePoints} synonyms={data.synonyms} guess={this.state.guess} opponentGuess={this.state.opponentGuess} currentTime={this.state.timeRemaining}/>
          <WordGuessForm onGuessSubmit={this.handleGuessEntry}/>
        </div>
        <div className={hiddenClasses}>
          <p className="fade">
            {emoji.get('snowman')}<br/>
            Waiting for someone else to join...
          </p>
        </div>
        <div className="player-zone">
          <div className="player">
            <div className="my-points points">{this.state.myScore}</div>
            <div className="profile">
              <h3>{this.state.user}</h3>
              <div className="sponsor">
                Sponsoring: Saparkul
              </div>
            </div>
          </div>
          <div className="player">
            <div className="opponent-points points">{this.state.opponentScore}</div>
            <div className="profile">
              {opponent}
              <div className="sponsor">
                Sponsoring: Saparkul
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Arena;