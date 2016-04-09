import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router';
import ArenaList from '../../../ArenaList.json'
import Cause from './cause'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {arenas: ArenaList.arenas, name:"", selected:""}
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
            <Cause name={'Saparkul'} src={'./imgs/saparkul.jpg'} location={'Peru'} story={'A loan of $350 helps Saparkul to buy feed and vitamins for her pigs.'}/>
            <Cause name={'Yazan'} src={'./imgs/yazan.jpg'} location={'Russia'} story={'A loan of $2,350 helps Yazan to buy a new play station device for his internet cafe.'}/>
            <Cause name={'Sergio'} src={'./imgs/sergio.jpg'} location={'Gutamala'} story={'A loan of $900 helps Sergio to purchase more refrigerators for resale. '}/>
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