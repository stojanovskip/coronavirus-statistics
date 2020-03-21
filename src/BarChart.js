import React, {Component} from 'react';
import * as d3 from "d3";
import Chart from "chart.js";


class BarChart extends Component {
    myChart;
    chartRef = React.createRef();
    constructor(){
        super();
        this.state={
            casesList:[],
            language: 'en',
            phrases: [{"lang": "mk","totalCases":"Вкупно случаи", "totalDeaths":"Вкупно смртни случаи", "active":"Активни","recovered":"Излечени","todayCases":"Денешни случаи","todayDeaths":"Денешни смртни случаи"}, {"lang":"en","totalCases":"Total cases", "totalDeaths": "Total deaths", "active":"Активни","recovered":"Recovered","todayCases":"Today cases","todayDeaths":"Today deaths"}]
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
            data.map((c)=>{  
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
        })
     }
     componentDidMount() {
      this.renderTableData();
      
    }
    drawChartJS(casesList, str, orderBy){
        if(str == null)
        {
            str="";
        }
        
        const myChartRef = this.chartRef.current.getContext("2d");
        let deathList = [];
        let countryList = [];
        let caseList = [];
        let todayDeathsList = [];
        let todayCasesList = [];
        let activeList = [];
        let recoveredList = [];
        
        switch(orderBy){
            case "active":
                casesList.sort((a, b) => (a.active > b.active) ? -1 : 1);
                break;
            case "recovered":
                casesList.sort((a, b) => (a.recovered > b.recovered) ? -1 : 1);
                break;
            case "cases":
                casesList.sort((a, b) => (a.cases > b.cases) ? -1 : 1);
                break;
            case "deaths":
                casesList.sort((a, b) => (a.deaths > b.deaths) ? -1 : 1);
                break;
            case "todayCases":
                casesList.sort((a, b) => (a.todayCases > b.todayCases) ? -1 : 1);
                break;
            case "todayDeaths":
                casesList.sort((a, b) => (a.todayDeaths > b.todayDeaths) ? -1 : 1);
                break;
            default:
                casesList.sort((a, b) => (a.cases > b.cases) ? -1 : 1);
                break;
        }

        for(let i = 0; i<casesList.length;i++)
        {
            if(casesList[i].country.toLowerCase().includes(str.toLowerCase())){
                deathList.push(casesList[i].deaths);
                countryList.push(casesList[i].country);
                caseList.push(casesList[i].cases);
                todayDeathsList.push(casesList[i].todayDeaths);
                todayCasesList.push(casesList[i].todayCases);
                activeList.push(casesList[i].active);
                recoveredList.push(casesList[i].recovered)
            }
        }
        let datasetBars = [];
        let phrase = this.state.phrases[0];
        for (let index = 0; index < this.state.phrases.length; index++) {
            if(this.state.phrases[index].lang == this.state.language)
            {
                phrase = this.state.phrases[index];   
            }
        }
        if(str==="")
        {
            datasetBars = [
                {
                    label: phrase.totalDeaths,
                    type: "line",
                    data: deathList,
                    borderColor: "#7F171F",
                    fill: "#7F171F",
                },
                {
                    label: phrase.totalCases,
                    data: caseList,
                    type: "line",
                    borderColor:" #003366",
                    fill:" #003366",
                },
                {
                    label: phrase.todayCases,
                    type: "line",
                    borderColor:"#B67721",
                    fill:"#B67721",
                    data: todayCasesList,
                },
                {
                    label: phrase.recovered,
                    type: "line",
                    borderColor:"#21B6A8",
                    fill:"#21B6A8",
                    data: recoveredList,
                },
                {
                    label: phrase.todayDeaths,
                    type: "line",
                    borderColor: "#B6212D",
                    fill: "#B6212D",
                    data: todayDeathsList,
                },
                {
                    label: phrase.active,
                    type: "line",
                    borderColor:"#177F75",
                    fill:"#177F75",
                    data: activeList,
                }
            ];
        }
        else{
            datasetBars = [{
                  label: phrase.totalDeaths,
                  type: "bar",
                  data: deathList,
                  backgroundColor: "#7F171F",
                  fill: "#7F171F",
                },
              {                    
                  label: phrase.totalCases,
                  data: caseList,
                  type: "bar",
                  backgroundColor:" #003366",
                  fill:" #003366",
              },
              {
                  label: phrase.todayCases,
                  type: "bar",
                  backgroundColor:"#B67721",
                  fill:"#B67721",
                  data: todayCasesList,
              },
              {
                  label: phrase.recovered,
                  type: "bar",
                  backgroundColor:"#21B6A8",
                  fill:"#21B6A8",
                  data: recoveredList,
              },
              {
                  label: phrase.todayDeaths,
                  type: "bar",
                  backgroundColor: "#B6212D",
                  data: todayDeathsList,
                  labels: todayDeathsList
              },
              {
                  label: phrase.active,
                  type: "bar",
                  labels: activeList,
                  backgroundColor:"#177F75",
                  fill:"#177F75",
                  data: activeList,
              }
            ]
        }
        
        //this.setState({casesList: casesList});
        try{
            this.myChart.destroy();
        }
        catch{}
            console.log("destroyed");
      this.myChart = new Chart(myChartRef, {
          type: "bar",
          data: {
              //Bring in data
              labels: countryList,
              datasets: datasetBars
          },
          options: { 
              maintainAspectRatio: false,
              responsive: true
          }
          
      });
      this.myChart.canvas.parentNode.style.height = '90vh';

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
      changeLanguage(lang) {
        console.log("language changed to: " + lang);
        this.setState({
          language:  lang
        })
        this.state.language = lang;
        this.drawChartJS(this.state.casesList);
      }
      getLang(){
          return this.state.language;
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
    <h1>{this.state.language === 'en' ? 'Corona Virus Statistics' : 'Статистика за Корона вирусот'}</h1>
     <div className="infoData">
         <div>
         {this.state.language === 'en' ? 'Language:' : 'Јазик:'}
         </div>
        <div>
            <select onChange={(e)=>this.changeLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="mk">Македонски</option>
            </select>
            </div><div>
            {this.state.language === 'en' ? 'Country:' : 'Држава:'}
            </div><div><input placeholder={this.state.language === 'en' ? 'Type a country' : 'Внесете држава'} onChange={(e) => this.drawChartJS(this.state.casesList, e.target.value)} ></input>
            </div><div>{this.state.language === 'en' ? 'Order by' : 'Сортирај по'}
            </div><div><select onChange={(e)=>this.drawChartJS(this.state.casesList,"",e.target.value)}>
                <option value="cases">{this.state.language === 'en' ? 'Number of total cases' : 'Вкупно случаи'}</option>
                <option value="deaths">{this.state.language === 'en' ? 'Number of total deaths' : 'Вкупно смртни случаи'}</option>
                <option value="todayCases">{this.state.language==='en'? 'Number of today cases': 'Денешни случаи'}</option>
                <option value="todayDeaths">{this.state.language==='en'? 'Number of today deaths': 'Денешни смртни случаи'}</option>
                <option value="active">{this.state.language==='en'? 'Number of active cases': 'Активни случаи'}</option>
                <option value="recovered">{this.state.language==='en'? 'Number of recovered cases': 'Излечени случаи'}</option>
            </select>
            </div>
        </div>
            <canvas 
                id="myChart"
                ref={this.chartRef}
            />
        </div>
    )
    }
  }
      
  export default BarChart;