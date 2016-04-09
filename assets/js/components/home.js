import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router';
import ArenaList from '../../../ArenaList.json'
import io from 'socket.io-client'

let socket = io(`http://localhost:8000`)

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {arenas: ArenaList.arenas }
  }
  getArenas() {
    let arenaList = this.state.arenas.map((arena) => {
      let linkLocation = '/arena' + arena.altName
      return (
        <li key={arena.arenaNumber}><Link to={`/arena/${arena.altName}`}> {arena.arenaName} </Link></li>
      )
    })
    return arenaList;
  }
  render() {
    console.log('here');
    let arenas = this.getArenas();
    return (
      <div className="home">
        <h2>Choose an Arena</h2>
        <div className="arena-list">
          <ul>
            {arenas}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;