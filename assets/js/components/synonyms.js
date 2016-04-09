import React from 'react'
import { render } from 'react-dom'

import Word from './word'
import WordGuessForm from './wordguessform'

class Synonyms extends React.Component {

	constructor(props) {
  	super(props);
  	this.state = {correctWords:[]};
  }

  handlePoints() {
  	this.props.givePoints();
  }

	render() {
		//check the guess
		var found = false;
		var current_guess = this.props.guess;
		var opponent_guess = this.props.opponentGuess;
		var correctWords = this.state.correctWords;
		var rows = [];
		for (var i=0; i < this.props.synonyms.length; i++) {
		    if (current_guess == this.props.synonyms[i].syn && correctWords.indexOf(this.props.synonyms[i].syn) == -1) {
		    	console.log('new word');
		    	found = true;
		    	correctWords.push(current_guess);
		    	this.handlePoints();
		    } else if (opponent_guess == this.props.synonyms[i].syn) {
					found = true;
					correctWords.push(current_guess);
	       } else if (correctWords.indexOf(this.props.synonyms[i].syn) >= 0) {
	       	found = true;
	       } else {
	       	found = false;
	       }
	       rows.push(<Word word={this.props.synonyms[i].syn} key={i} currentTime={this.props.currentTime} found={found}/>);
		}
		return (
			<div className="synonym-wrapper">
				{rows}
			</div>
		);
	}
}

export default Synonyms