import React from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'

let Player = ({ score, name, opponent }) => {
  let playerClass = classNames('points');
  if (score > opponent) {
    playerClass = classNames('points', 'winning');
  } else if (score < opponent) {
    playerClass = classNames('points', 'losing');
  }
  return (
    <div className='player'>
      <div className={playerClass}>{score}</div>
      <div className="profile">
        <h2>{name}</h2>
      </div>
    </div>
    )
}

export default Player