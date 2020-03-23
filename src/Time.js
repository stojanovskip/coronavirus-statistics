import React , {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TimeChart from './TimeChart'

class Time extends Component {
  
  state = {
    w: 700,
    h: 500,
    country:this.props.match.params
  }
componentDidMount(){
  const  country  = this.props.match.params;
  this.state.country = country;
}
  render() {
    return (
      <div className="App">
        <TimeChart country={this.state.country} width={this.state.width} height={this.state.height} />
      </div>
    );
  }
}
export default Time;
