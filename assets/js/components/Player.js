import React from 'react'
import { render } from 'react-dom'

let Player = ({ score, name, sponsor }) => {
  return (
    <div className="player">
      <div className="my-points points">{score}</div>
      <div className="profile">
        <h3>{name}</h3>
        <div className="sponsor">
          Sponsoring: {sponsor}
        </div>
      </div>
    </div>
    )
}

export default Player