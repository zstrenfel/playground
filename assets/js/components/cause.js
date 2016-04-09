import React from 'react'
import { render } from 'react-dom'

let Cause = ({ name, location, story, src }) => {
  return (
    <div className="cause-third">
      <img src={src} />
      <h3>{name}</h3>
      <aside><b>{location}</b><br/>{story}</aside>
    </div>
    )
}

export default Cause