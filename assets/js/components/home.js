import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router';
import ArenaList from '../../../ArenaList.json'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {arenas: ArenaList.arenas, name:"" }
    this.handleChange = this.handleChange.bind(this);
  }
  getArenas() {
    let self = this;
    let arenaList = this.state.arenas.map((arena) => {
      return (
        <li key={arena.arenaNumber}><Link to={`/arena/${arena.altName}/${this.state.name}`}> {arena.arenaName} </Link></li>
      )
    })
    return arenaList;
  }
  handleChange(e) {
    e.preventDefault;
    this.setState({name: e.target.value});
  }
  render() {
    let arenas = this.getArenas();
    return (
      <div className="home">
        <div className="name">
          <h2> Enter Your Name </h2>
          <input onChange={this.handleChange} value={this.state.name}/>
        </div>
        <div className="cause">
          <h2> Choose a Cause </h2>
          <div className="cause wrapper">
            <div className="cause-third">
              <img src={'./imgs/saparkul.jpg'} />
              <h3>Saparkul</h3>
            </div>
            <div className="cause-third">
              <img src={'./imgs/sergio.jpg'} />
              <h3>Sergio</h3>
            </div>
            <div className="cause-third">
              <img src={'./imgs/yazan.jpg'} />
              <h3>Yazan</h3>
            </div>
          </div>
          <footer> sponsored by <img src={'./imgs/kiva.png'} /></footer>
        </div>
        <div className="arena-wrapper">
          <h2>Choose an Arena</h2>
          <div className="arena-list">
            <ul>
              {arenas}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;