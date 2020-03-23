import React, {Component} from 'react';
import Chart from "chart.js";


class BarChart extends Component {
    myChart;
    chartRef = React.createRef();
    constructor(){
        super();
        this.state={
            casesList:[],
            country: null,
            language: 'en',
            phrases: [{"lang": "mk", "title": "Корона Статистика", "errorMsg":"Ве молиме, внесете држава.", "totalCases":"Вкупно случаи", "totalDeaths":"Вкупно смртни случаи", "active":"Активни","recovered":"Излечени","todayCases":"Денешни случаи","todayDeaths":"Денешни смртни случаи"}, {"lang":"en","totalCases":"Total cases", "totalDeaths": "Total deaths", "active":"Active","recovered":"Recovered","todayCases":"Today cases","todayDeaths":"Today deaths",  "errorMsg":"Please, input a country.","title":"Coronavirus Statistics"}],
            phrase: null
        };
        
        let phrase = this.state.phrases[1];
        document.title = phrase.title;
        this.state.phrase = phrase;
        
    }
    
     renderTableData() {
 //       fetch('https://coronavirus-19-api.herokuapp.com/countries')
        fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php',
        {  
            headers: {
              'X-RapidAPI-Host': 'coronavirus-monitor.p.rapidapi.com', 
              'X-RapidAPI-Key': process.env.REACT_APP_API_KEY
            }
        })
            .then(results=>{
            return results.json();
        })
        .then(data => {
            
            let casesList = [];
            let countriesList = [];
            data.countries_stat.map((c)=>{
                return(
                    casesList.push({"cases": c.cases.replace(',',''), "country":c.country_name, "deaths":c.deaths.replace(',',''), "recovered":c.total_recovered.replace(',',''), "todayDeaths":c.new_deaths.replace(',',''), "todayCases":c.new_cases.replace(',',''), "active":c.active_cases.replace(',','')}),
                    countriesList.push(c.country_name)
                )
            });
            this.drawChartJS(casesList);
            data.countries_stat.map((c)=>{  
             return(
                 <tr key={c.country_name}>
                     <td>{c.country_name}</td>
                     <td>{c.cases}</td>
                     <td>{c.new_cases}</td>
                     <td class="death">{c.deaths}</td>
                     <td>{c.new_deaths}</td>
                     <td class="recovered">{c.total_recovered}</td>
                     <td>{c.active_cases}</td>
                 </tr>
                )
            });
            
            this.setState({casesList: casesList});
        })
     }
     componentDidMount() {
      this.renderTableData();
      
    }
    getTimeline()
    {
        if(this.state.country != undefined)
        {
            window.location.href = '/timechart/country/'+this.state.country;
        }
        else{
            alert(this.state.phrase.errorMsg);
        }
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
                casesList.sort((a, b) => (parseInt(a.active) > parseInt(b.active)) ? -1 : 1);
                break;
            case "recovered":
                casesList.sort((a, b) => (parseInt(a.recovered) > parseInt(b.recovered)) ? -1 : 1);
                break;
            case "cases":
                casesList.sort((a, b) => (parseInt(a.cases) > parseInt(b.cases)) ? -1 : 1);
                break;
            case "deaths":
                casesList.sort((a, b) => (parseInt(a.deaths) > parseInt(b.deaths)) ? -1 : 1);
                break;
            case "todayCases":
                casesList.sort((a, b) => (parseInt(a.todayCases) > parseInt(b.todayCases)) ? -1 : 1);
                break;
            case "todayDeaths":
                casesList.sort((a, b) => (parseInt(a.todayDeaths) > parseInt(b.todayDeaths)) ? -1 : 1);
                break;
            default:
                casesList.sort((a, b) => (parseInt(a.cases) > parseInt(b.cases)) ? -1 : 1);
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
        if(str != null && str != "")
        {
            try{
            this.state.country = countryList[0];
            }
            catch{}
        }
        let datasetBars = [];
        let phrase = this.state.phrases[1];
        for (let index = 0; index < this.state.phrases.length; index++) {
            if(this.state.phrases[index].lang == this.state.language)
            {
                phrase = this.state.phrases[index];   
            }
        }
        this.state.phrase = phrase;
        document.title = phrase.title;

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
        
        
        try{
            this.myChart.destroy();
        }
        catch{}
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
    
      changeLanguage(lang) {
        this.setState({
          language:  lang
        })
        this.state.language = lang;
        this.drawChartJS(this.state.casesList);
      }
      getLang(){
          return this.state.language;
      }
    render(){
     return (
         
     <div>
    <h1>{this.state.language === 'en' ? 'Corona Virus Statistics' : 'Статистика за Корона вирусот'}</h1>
     <div className="infoData">
         <div>
         {this.state.language === 'en' ? 'Language:' : 'Јазик:'}
         
            <select className="infoChild" onChange={(e)=>this.changeLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="mk">Македонски</option>
            </select>
            </div><div>
            {this.state.language === 'en' ? 'Country:' : 'Држава:'}
            <input className="infoChild" placeholder={this.state.language === 'en' ? 'Type a country' : 'Внесете држава'} onChange={(e) => this.drawChartJS(this.state.casesList, e.target.value)} ></input>
            <input type="button" className="infoChild" onClick={(e) => this.getTimeline(this.state.casesList, e.target.value)} value={this.state.language === 'en' ? 'Chronological' : 'Хронолошки'} ></input>
            </div><div>{this.state.language === 'en' ? 'Order by' : 'Сортирај по'}
            <select className="infoChild" onChange={(e)=>this.drawChartJS(this.state.casesList,"",e.target.value)}>
                <option value="cases">{this.state.language === 'en' ? 'Number of total cases' : 'Вкупно случаи'}</option>
                <option value="deaths">{this.state.language === 'en' ? 'Number of total deaths' : 'Вкупно смртни случаи'}</option>
                <option value="todayCases">{this.state.language==='en'? 'Number of today cases': 'Денешни случаи'}</option>
                <option value="todayDeaths">{this.state.language==='en'? 'Number of today deaths': 'Денешни смртни случаи'}</option>
                <option value="active">{this.state.language==='en'? 'Number of active cases': 'Активни случаи'}</option>
                <option value="recovered">{this.state.language==='en'? 'Number of recovered cases': 'Излечени случаи'}</option>
            </select>
            </div>
            <div>
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