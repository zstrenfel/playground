import React from 'react'
import { render } from 'react-dom'

class Word extends React.Component {

	render() {
		return (
			<div>
				{this.props.word}
			</div>
		)
	}
}

export default Word