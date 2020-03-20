import React, {Component} from 'react';
import * as d3 from "d3";
import Chart from "chart.js";


class BarChart extends Component {
    chartRef = React.createRef();
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
                    casesList.push({"cases": c.cases, "country":c.country, "deaths":c.deaths, "recovered":c.recovered, "todayDeaths":c.todayDeaths, "todayCases":c.todayCases, "active":c.active}),
                    countriesList.push(c.country)
                )
            });
            this.drawChartJS(casesList);
//            this.drawChart(casesList, countriesList);
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
    drawChartJS(casesList){
        const myChartRef = this.chartRef.current.getContext("2d");
        let deathList = [];
        let countryList = [];
        let caseList = [];
        let todayDeathsList = [];
        let todayCasesList = [];
        let activeList = [];
        let recoveredList = [];
        for(let i = 0; i<casesList.length;i++)
        {
            deathList.push(casesList[i].deaths);
            countryList.push(casesList[i].country);
            caseList.push(casesList[i].cases);
            todayDeathsList.push(casesList[i].todayDeaths);
            todayCasesList.push(casesList[i].todayCases);
            activeList.push(casesList[i].active);
            recoveredList.push(casesList[i].recovered)
        }
      new Chart(myChartRef, {
          type: "bar",
          data: {
              //Bring in data
              labels: countryList,
              datasets: [
                  {
                      label: "Deaths",
                      type: "line",
                      data: deathList,
                      borderColor: "#7F171F",
                      fill: "#7F171F",
                      },
                  {
                      label: "Cases",
                      data: caseList,
                      type: "line",
                      borderColor:" #003366",
                      fill:" #003366",
                  },
                  {
                      label: "Today Cases",
                      type: "line",
                      borderColor:"#B67721",
                      fill:"#B67721",
                      data: todayCasesList,
                  },
                  {
                      label: "Recovered",
                      type: "line",
                      borderColor:"#21B6A8",
                      fill:"#21B6A8",
                      data: recoveredList,
                  },
                  {
                      label: "Today Deaths",
                      type: "line",
                      borderColor: "#B6212D",
                      fill: "#B6212D",
                      data: todayDeathsList,
                  },
                  {
                      label: "Active",
                      type: "line",
                      borderColor:"#177F75",
                      fill:"#177F75",
                      data: activeList,
                  }
              ]
          },
          options: {
              chartArea: {
            backgroundColor: 'rgba(255, 255,255, 1)'
        },  title: {
            display: true,
            text: 'Corona Virus Statistics'
        }
          }
      });
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
          
    render(){/*
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
     )*/
     return (
        <div>
            <canvas
                id="myChart"
                ref={this.chartRef}
            />
        </div>
    )
    }
  }
      
  export default BarChart;