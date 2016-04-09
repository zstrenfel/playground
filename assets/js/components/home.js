import React from 'react'
import { render } from 'react-dom'



class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {arenas: ["Arena 1", "Arena 2", "Arena 3"]};
  }
  getArenas() {
    let arenaList = this.state.arenas.map((arena) => {
      return (
        <li> {arena} </li>
      )
    })
    return arenaList;
  }
  render() {
    let arenas = this.getArenas();
    return (
      <div>
        <h1>this is the home screen </h1>
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