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
		
		//check the guess
		console.log("This is running agains!!!")
		console.log(this.props)
		var id_count = 0;
		var current_guess = this.props.guess;
		console.log(current_guess);
		console.log(this.state.correctWords);
		var rows = [];
		for (var i=0; i < this.props.synonyms.length; i++) {
		    if (current_guess == this.props.synonyms[i].syn || this.state.correctWords.indexOf(this.props.synonyms[i].syn) >= 0) {
					rows.push(<Word word={this.props.synonyms[i].syn} key={i}/>);
					this.state.correctWords.push(current_guess);
	       } else {
	       	var substring = this.props.synonyms[i].syn.substring(0, 3);
	        rows.push(<Word word={substring} key={i}/>);
	       }
		}
		return (
			<div>
				{rows}
			</div>
		);
		// var synonymsList = this.props.synonyms.map(function(synonyms) {
		// 	//var currentTime = d.getTime();
		// 	id_count += 1;
		// 	if (current_guess == synonyms.syn && synonyms.syn.indexOf(correctWords) < 0) {
		// 		correctWords.push(current_guess);
		// 		return (
		// 			<Word word={synonyms.syn} key={id_count}/>
		// 		)
		// 	} else {
		// 		var substring = synonyms.syn.substring(0, 3);
		// 		return (
	 //        <Word word={substring} key={id_count}/>
	 //      )
	 //    }
		// });
		// this.state.correctWords = correctWords;
		// console.log(this.state.correctWords);
		// return (
		// 	<div className="synonymsList">
		// 		{synonymsList}
		// 	</div>
		// )
	}
}

export default Synonyms