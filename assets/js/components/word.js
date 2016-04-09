import React from 'react'
import { render } from 'react-dom'

class Word extends React.Component {

	constructor(props) {
  	super(props);
  	this.state = {time_elapsed:0};
  }

	render() {
		if (this.props.currentTime%10 == 0) {
			this.state.time_elapsed += 1;
		}
		var modified_word = this.props.word.substring(0, this.state.time_elapsed);
		if (this.props.found) {
			return (
				<div>
					{this.props.word}
				</div>
			)
		} else {
			return (
				<div>
					{modified_word}
				</div>
			)
		}
	}
}

export default Word