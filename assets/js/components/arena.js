import React from 'react'
import { render } from 'react-dom'

import Word from './word'
import Synonyms from './synonyms'
import WordGuessForm from './wordguessform'
import Data from './wordlistLevel1.json'

var data = Data.data[0];

class Arena extends React.Component { 

  constructor(props) {
  	super(props);
  	this.state = {guess: "", currentTime: 100};
  	//this.handleGuessEntry = this.handleGuessEntry.bind(this);
  }

  handleGuessEntry(g) {
  	console.log("The below is g");
  	console.log(g)
  	this.setState({guess: g})

  }

  render() {
    //test here by decrementing time
    console.log("Changing time");
    this.state.currentTime -= 5;
    return (
      <div className="content">
        <h1> This is our cool application </h1>
        
        <h2> This is the main word </h2>
      	{data.word}
      	
      	<h2> These are the synoyms to guess </h2>
      	<Synonyms synonyms={data.synonyms} guess={this.state.guess} currentTime={this.state.currentTime}/>

      	<h2> This is the entry form </h2>
				<WordGuessForm onGuessSubmit={this.handleGuessEntry.bind(this)}/>
      </div>
    )
  }

}


export default Arena;