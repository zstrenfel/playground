import React from 'react'
import { render } from 'react-dom'

import Word from './word'
import WordGuessForm from './wordguessform'

class Synonyms extends React.Component {

	constructor(props) {
  	super(props);
  	this.state = {correctWords:[]};
  }

	render() {
		console.log(this.props.currentTime);
		//check the guess
		var found = false;
		var current_guess = this.props.guess;
		var rows = [];
		for (var i=0; i < this.props.synonyms.length; i++) {
		    if (current_guess == this.props.synonyms[i].syn || this.state.correctWords.indexOf(this.props.synonyms[i].syn) >= 0) {
					found = true;
					this.state.correctWords.push(current_guess);
	       } else {
	       	found = false;
	       }
	       rows.push(<Word word={this.props.synonyms[i].syn} key={i} currentTime={this.props.currentTime} found={found}/>);
		}
		return (
			<div>
				{rows}
			</div>
		);
	}
}

export default Synonyms