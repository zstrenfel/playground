import React from 'react'
import { render } from 'react-dom'

class Word extends React.Component {

	constructor(props) {
  	super(props);
  	this.state = {time_elapsed:1, goldenNum: false};
  }

  componentWillReceiveProps() {
    if (this.props.currentTime == 0) {
      return;
    }
  	if (this.props.currentTime%7 == 0 && (Math.random() > .5)) {
			let l = this.state.time_elapsed + 1;
			var randomNum = Math.floor(Math.random()*100);
			this.setState({time_elapsed: l, goldenNum: false});
			if (randomNum%2 == 0) {
				this.setState({time_elapsed: l, goldenNum: true});
			}
		}
  }

	render() {
		
		
		var modified_word = this.props.word.substring(0, this.state.time_elapsed);
		
		var num_us = this.props.word.length - modified_word.length;
		var list_us = [];
		var index = 0;
		while (index < num_us) {
			list_us.push("_");
			index += 1;
		}
		var str_us = list_us.join(" ");
		modified_word = modified_word.concat(str_us);

		
		if (this.state.goldenNum == true) {
			if (this.props.found) {
				//this.props.handlePoints(10);
				return (
					<div className="word found">
						{this.props.word}
					</div>
				)
			} else {
				return (
					<div className="word golden">
						{modified_word}
					</div>
				)
			}
		} else {
			if (this.props.found) {
				return (
					<div className="word found">
						{this.props.word}
					</div>
				)
			} else {
				return (
					<div className="word">
						{modified_word}
					</div>
				)
			}
		}
	}
}

export default Word