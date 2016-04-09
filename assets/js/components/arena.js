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
                  synonyms: [],
                  correctWords: []
                };
    this.handleTick = this.handleTick.bind(this);
    this.handleTimeEnd = this.handleTimeEnd.bind(this);
    this.handleGuessEntry = this.handleGuessEntry.bind(this);
    this.tick = this.tick.bind(this);
    this.givePoints = this.givePoints.bind(this);
    this.handleData = this.handleData.bind(this);
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
    console.log(name, roomNum);
    for (var i; i < data.synonyms.length; i++) {
      synonyms.push({"word": data.synonyms[i], "active": true,});
    }
  }

  //mostly for socket io
  componentDidMount() {
    let data;
    //commment this out later
    this.interval = setInterval(this.tick, 1000);
    //set room
    socket.emit('join_room', {room: this.state.room })
    //send user data
    socket.emit('init', {user: this.state.user, room: this.state.room});
    //recieve message
    socket.on('pull_message', (data) => {
      data = {opponentGuess: data.message};
      this.handleData(data);
    });
    socket.on('take_name', (user) => {
      data = {opponent: user, start: true};
      this.handleData(data);
      this.interval = setInterval(this.tick, 1000);
    })

    //recieve user data
    socket.on('init', (user) => {
      data = {opponent: user, start: true};
      this.handleData(data);
      socket.emit('give_name', {user: this.state.user, room: this.state.room});
      this.interval = setInterval(this.tick, 1000);
    })
    socket.on('take_points', (points) => {
      console.log('taking points', points);
      data = {opponentScore: points};
      this.handleData(data);
    })
  }
  handleData(data) {
    this.setState(data, () => {console.log("added data", data)});
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
    this.setState({myScore: points})
    socket.emit('tell_points', {room: this.state.roomNum, score: points});
  }

  var found = false;
  var current_guess = this.state.guess;
  var opponent_guess = this.state.opponentGuess;
  var correctWords = this.state.correctWords;
  var rows = [];
  for (var i=0; i < data.synonyms.length; i++) {
      if (current_guess == data.synonyms[i].syn && correctWords.indexOf(data.synonyms[i].syn) == -1) {
        console.log('new word');
        found = true;
        correctWords.push(current_guess);
        this.givePoints();
      } else if (opponent_guess == data.synonyms[i].syn) {
        found = true;
        correctWords.push(current_guess);
       } else if (correctWords.indexOf(data.synonyms[i].syn) >= 0) {
        found = true;
       } else {
        found = false;
       }
       rows.push(<Word word={data.synonyms[i].syn} key={i} currentTime={data.currentTime} found={found}/>);
  }

  render() {
    let opponent;
    if (this.state.opponent === "") {
      opponent = "Waiting..."
    } else {
      opponent = this.state.opponent
    }
    let mainClasses = classNames('question-content', {show: this.state.start});
    let hiddenClasses = classNames('block', {show: !this.state.start});
    return (
      <div className="arena">
        <div className={mainClasses}>

            <div className="word-wrapper">
              <h2 className="main-word">{data.word}</h2>
              <aside className="definition">{data.definition}</aside>
            </div>
            <div className="timer-wrapper">
              <div className='timer'>
                {this.state.timeRemaining}
              </div>
            </div>

            <h2 className="synonyms-title"> Synonyms: </h2>
            <div className="synonym-wrapper">
              {rows}
            </div>
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