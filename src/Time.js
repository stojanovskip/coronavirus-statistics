import React , {Component} from 'react';
import './App.css';
import TimeChart from './TimeChart'

class Time extends Component {
  
  state = {
    country:this.props.match.params
  }

componentDidMount(){
  const country  = this.props.match.params;
  this.setCountry(country);
}
async setCountry(country){
  await this.setState({country:country});
}
  render() {
    return (
      <div className="App">
        <TimeChart country={this.state.country} />
      </div>
    );
  }
}
export default Time;
