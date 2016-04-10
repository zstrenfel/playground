import React from 'react'
import { render } from 'react-dom'

let Player = ({ score, name, sponsor }) => {
  return (
    <div className="player">
      <div className="my-points points">{score}</div>
      <div className="profile">
        <h2>{name}</h2>
      </div>
    </div>
    )
}

export default Player