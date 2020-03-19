import React, {Component} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    constructor(){
        super();
        this.state={
            countries:[],
            casesList:[],
            countriesList:[]
        };
    }
    
     renderTableData() {
        fetch('https://coronavirus-19-api.herokuapp.com/countries')
        .then(results=>{
            return results.json();
        })
        .then(data => {
            
            let casesList = [];
            let countriesList = [];
            data.map((c)=>{
                return(
                    casesList.push({"cases": c.cases, "country":c.country}),
                    countriesList.push(c.country)
                )
            });
            this.drawChart(casesList, countriesList);
            let countries = data.map((c)=>{  
             return(
                 <tr key={c.country}>
                     <td>{c.country}</td>
                     <td>{c.cases}</td>
                     <td>{c.todayCases}</td>
                     <td class="death">{c.deaths}</td>
                     <td>{c.todayDeaths}</td>
                     <td class="recovered">{c.recovered}</td>
                     <td>{c.active}</td>
                 </tr>
                )
            });
            
            this.setState({casesList: casesList});
            this.setState({countriesList: countriesList});
            this.setState({countries: countries});
        })
     }
     componentDidMount() {
        this.renderTableData();

    }
    
    drawChart(casesList) {
      let w = 1000;
      let h = 500;
      const svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("margin-left", 100)
      .style("overflow-x", "scroll");
      
      svg.selectAll("rect")
        .data(casesList)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 70)
        .attr("y", (d, i) => h - d.cases/600)
        .attr("width", 65)
        .attr("height", (d, i) => d.cases/600 )
        .attr("fill", "grey")

        svg.selectAll("text")
        .data(casesList)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 70 + 2)
        .attr("y", (d, i) => h - d.cases/600 - 10)
        .text(d => d.country)
      }
          
    render(){
        return (
        <div>
            <div id={"#" + this.props.id}></div>
     
           <h1 id='title'>CoVid19 Cases</h1>
            <div class="tbl-header">
           <table align="center">
               <thead>
               <tr>
               <th>Country</th>
               <th>Cases</th>
               <th>Today Cases</th>
               <th>Deaths</th>
               <th>Today Deaths</th>
               <th>Recovered</th>
               <th>Active</th>
               </tr>
               </thead>
               </table>
               </div>
               <div class="tbl-content">
               <table>
              <tbody>
                 {this.state.countries}
              </tbody>
           </table>
           </div>
        </div>
     )
    }
  }
      
  export default BarChart;