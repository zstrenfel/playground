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
import Player from './Player'


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
    let syns = data.synonyms.map((synonym) => {
      return {word: synonym.syn, active: true};
    });
    this.setState({room: roomNum, user: name, isMounted: true, synonyms: syns});
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
    let correct,
        correctWords = this.state.correctWords;
    let mapped = this.state.synonyms.map((synonym) => {
      if (synonym.word === g) {
        if (correctWords[g] == null) {
          correct = [g, ...this.state.correctWords];
          return {word: synonym.word, active: false};
        }
      }
        return synonym;
      })
    if (correct) {
      this.setState({synonyms:mapped, correctWords: correct});
      socket.emit('push_message', {room: this.state.room, message: g});
    } else {
      this.setState({synonyms:mapped})
    }
  }
  handleTimeEnd() {
    console.log('timer is done');
  }
  handleTick(time) {
    console.log("time remaining: ", time);
  }
  givePoints() {
    let points = Math.floor(2 * this.state.timeRemaining) + this.state.myScore;
    this.setState({myScore: points})
    socket.emit('tell_points', {room: this.state.roomNum, score: points});
  }
  renderSynonyms() {
    let rows = this.state.synonyms.map((s) => {
        if (s !== undefined) {
          return (<Word word={s.word} key={s.word} currentTime={data.currentTime} found={!s.active}/>)
        }
      })
    return rows;
  }
  render() {
    let rows = this.renderSynonyms();
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
          <Player name={this.state.user} score={this.state.myScore} sponsor={'Saparkul'} />
          <Player name={this.state.opponent} score={this.state.opponentScore} sponsor={'Saparkul'} />
        </div>
      </div>
    )
  }
}

export default Arena;