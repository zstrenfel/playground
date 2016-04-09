import React from 'react'
import { render } from 'react-dom'

import Word from './word'
import WordGuessForm from './wordguessform'

class Synonyms extends React.Component {


	render() {
		
		//check the guess
		console.log("This is running agains!!!")
		var id_count = 0;
		var synonymsList = this.props.synonyms.map(function(synonyms) {
			//var currentTime = d.getTime();
			id_count += 1;
			return (
        <Word word={synonyms.syn} key={id_count}/>
      )
		});
		return (
			<div className="synonymsList">
				{synonymsList}
			</div>
		)
	}
}

export default Synonyms