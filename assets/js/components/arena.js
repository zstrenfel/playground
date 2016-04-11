import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'
import CountdownTimer from './countdownTimer'
import classNames from 'classnames'
import Modal from 'react-modal'
import { browserHistory } from 'react-router'

import Word from './word'
import Synonyms from './synonyms'
import WordGuessForm from './wordguessform'
import Data from './wordlistLevel1.json'
import emoji from 'node-emoji'
import Player from './Player'


var data = Data.data[0];
var socket = io('http://localhost:8000');

const customStyles = {
  overlay: {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    textAlign             : 'center',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Arena extends React.Component {

  constructor(props) {
    super(props);
    this.state = {guess: "",
                  opponentGuess: "",
                  user:  "",
                  opponent: "Einstein",
                  room: "",
                  myScore: 0,
                  opponentScore: 0,
                  timeRemaining: 60,
                  isMounted: false,
                  start: false,
                  synonyms: [],
                  modal: false
                };
    this.handleTick = this.handleTick.bind(this);
    this.handleTimeEnd = this.handleTimeEnd.bind(this);
    this.handleGuessEntry = this.handleGuessEntry.bind(this);
    this.tick = this.tick.bind(this);
    this.givePoints = this.givePoints.bind(this);
    this.handleData = this.handleData.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  /** Before mount, set room, user, synonyms in state based on query string and inputed date. */
  componentWillMount() {
    let pathname = this.props.location.pathname.split('/');
    let roomNum = (pathname[pathname.length-2]);
    let name = (pathname[pathname.length-1]);
    let syns = data.synonyms.map((synonym) => {
      return {word: synonym.syn, active: true};
    });
    this.setState({room: roomNum, user: name, isMounted: true, synonyms: syns});
  }

  /** Set up component to handle Socket.io events */
  componentDidMount() {
    //Iitialization
    let data;
    //commment this out later
    // this.interval = setInterval(this.tick, 1000);
    //set room
    socket.emit('join_room', {room: this.state.room })
    //send user data
    socket.emit('init', {user: this.state.user, room: this.state.room});


    //recieve message
    socket.on('pull_message', (data) => {
      let mapped = this.state.synonyms.map((synonym) => {
      if (synonym.word === data.message) {
          return {word: synonym.word, active: false};
      }
        return synonym;
      });
      data = {synonyms: mapped};
      this.handleData(data);
    });
    socket.on('take_name', (user) => {
      data = {opponent: user};
      this.handleData(data);
      this.startGame()
    })
    //recieve user data
    socket.on('init', (user) => {
      data = {opponent: user};
      this.handleData(data);
      socket.emit('give_name', {user: this.state.user, room: this.state.room});
      this.startGame()
    })
    //Recieve point data
    socket.on('take_points', (score) => {
      data = {opponentScore: score};
      this.handleData(data);
    })
  }
  startGame() {
    this.setState({start: true});
    this.interval = setInterval(this.tick, 1000);
  }
  endGame() {
    console.log('game over');
    clearInterval(this.interval);
    this.openModal();
  }


  /** Cancels the timer; sets isMounted in state to false */
  componentWillUnmount() {
    this.setState({isMounted: false});
    clearInterval(this.interval);
  }

  // Handles updating state for Socket.io events
  handleData(data) {
    this.setState(data, () => {console.log("added data", data)});
  }

  /** Timer function -- decreases every second */
  tick() {
    this.setState({timeRemaining: this.state.timeRemaining - 1});
    if (this.state.timeRemaining <= 0) {
      this.endGame();
    }
  }
  handleTimeEnd() {
    console.log('timer is done');
  }
  handleTick(time) {
    console.log("time remaining: ", time);
  }

  openModal() {
    this.setState({modal: true});
  }

  closeModal(home) {
    this.setState({modal: false});
    if (this.state.timeRemaining <= 0) {
      this.returnHome();
    }
  }

  returnHome() {
    //emit leaving room
    console.log('going home');
    clearInterval(this.interval);
    browserHistory.push('/home');
  }



  /** Checks to see if a users guess is in the synonym dictionary,
   * and sets that word to inactive if it hasn't been guessed */
  handleGuessEntry(g) {
    let correct = false;
    let remaining = 0;
    let mapped = this.state.synonyms.map((synonym) => {
      if (synonym.word === g && synonym.active) {
          correct = true;
          return {word: synonym.word, active: false};
      } else if (synonym.active) { remaining ++ }
      return synonym;
      })
    if (correct) {
      socket.emit('push_message', {room: this.state.room, message: g});
      this.givePoints();
    }
    if (remaining === 0) {
      this.endGame();
    }
    this.setState({synonyms:mapped})
  }

  /** Gives user an amount of points in relation to time for a correct guess  */
  givePoints() {
    let points = Math.floor(2 * this.state.timeRemaining) + this.state.myScore;
    socket.emit('tell_points', {room: this.state.room, score: points});
    this.setState({myScore: points})
  }
  /** Render the synonyms */
  renderSynonyms() {
    let rows = this.state.synonyms.map((s) => {
        if (s !== undefined) {
          return (<Word word={s.word} key={s.word} currentTime={this.state.timeRemaining} found={!s.active}/>)
        }
      })
    return rows;
  }

  render() {
    let rows = this.renderSynonyms();
    let opponent = this.state.opponent === "" ? "Waiting..." : this.state.opponent;
    let mainClasses = classNames('question-content', {show: this.state.start});
    let hiddenClasses = classNames('block', {show: !this.state.start});

    let finalMessage = this.state.myScore >= this.state.opponentScore ? "won!" : "lost :(";
    return (
      <div className="arena">
        <header style={{textAlign: 'left'}}>
          <h3> Wordlike Playground </h3>
        </header>
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

            <div className="synonyms-title">
              <h2> Synonyms: </h2>
            </div>
            <div className="synonym-wrapper">
              {rows}
            </div>
            <WordGuessForm onGuessSubmit={this.handleGuessEntry}/>
        </div>
        <div className={hiddenClasses}>
          <p className="">
            There doesn't seem to be anyone online right now {emoji.get('snowman')}<br/>
            Would you like to start the game anyways?
            <button onClick={this.startGame}> Let's Play </button>
          </p>
        </div>

        <div className="player-zone">
          <Player name={this.state.user} score={this.state.myScore} opponent={this.state.opponentScore} />
          <Player name={this.state.opponent} score={this.state.opponentScore} opponent={this.state.myScore} />
        </div>


        <Modal isOpen={this.state.modal} onRequestClose={this.closeModal} style={customStyles} >
            <h1> Congratulations {this.state.user}! You've {finalMessage} </h1>
            <p> We've hope you've enjoyed our game {emoji.get('blush')} </p>
           <button onClick={this.closeModal.bind(this)}>close</button>
        </Modal>
      </div>
    )
  }
}

export default Arena;