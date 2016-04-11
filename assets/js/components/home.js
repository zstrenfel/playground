import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router';
import ArenaList from '../../../ArenaList.json'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arenas: ArenaList.arenas,
      name:"",
      selected:""
    }
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
        <header>
          <img src={'./imgs/wp.png'} alt="Wordlike Playground"/>
          <h1> Wordlike Playground </h1>
        </header>
        <div className="name">
          <h2> Enter Your Name </h2>
          <input onChange={this.handleChange} value={this.state.name}/>
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