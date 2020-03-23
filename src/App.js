import React , {Component} from 'react';
import './App.css';
import BarChart from './BarChart'

class App extends Component {
  
  state = {
    w: 700,
    h: 500,
  }

  render() {
    return (
      <div className="App">
        <BarChart width={this.state.width} height={this.state.height} />
      </div>
    );
  }
}
export default App;
