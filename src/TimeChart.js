import React, {Component} from 'react';
import Chart from "chart.js";


class TimeChart extends Component {
    myChart;
    chartRef = React.createRef();
    constructor(){
        super();
        this.state={
            casesList:[],
            country: null,
            language: 'en',
            phrase: null,
            opts: [],
            phrases: [{"lang": "mk", "title": "Корона Статистика", "totalCases":"Вкупно случаи", "totalDeaths":"Вкупно смртни случаи", "active":"Активни","recovered":"Излечени","todayCases":"Нови случаи","todayDeaths":"Нови смртни случаи"}, {"lang":"en","totalCases":"Total cases", "totalDeaths": "Total deaths", "active":"Active","recovered":"Recovered","todayCases":"New cases","todayDeaths":"New deaths", "title":"Coronavirus Statistics"}]
        };
        this.setCountry();
        
        let phrase = this.state.phrases[1];
        document.title = phrase.title;
        this.state.phrase = phrase;

    }
    
     renderTableData(country, orderBy) {
         this.state.country = country;
 //       fetch('https://coronavirus-19-api.herokuapp.com/countries')
        fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country='+country,
        {  
            headers: {
              'X-RapidAPI-Host': 'coronavirus-monitor.p.rapidapi.com', 
              'X-RapidAPI-Key': 'e9843df6f7mshaa54667ec07baf1p12224cjsn04cf86d86a81'
            }
        })
            .then(results=>{
            return results.json();
        })
        .then(data => {
            
            let casesList = [];
            let countriesList = [];
            data.stat_by_country.map((c)=>{
                
                try{
                    c.total_cases = c.total_cases.replace(',','');
                    c.total_deaths = c.total_deaths.replace(',','');
                    c.total_recovered = c.total_recovered.replace(',','');
                    c.new_deaths = c.new_deaths.replace(',','');
                    c.new_cases = c.new_cases.replace(',','');
                    c.active_cases = c.active_cases.replace(',','');
                }catch{
                    
                }
                return(
                    casesList.push({"cases": c.total_cases, "country":c.country_name, "deaths":c.total_deaths, "recovered":c.total_recovered, "todayDeaths":c.new_deaths, "todayCases":c.new_cases, "active":c.active_cases, "time":c.record_date}),
                    countriesList.push(c.country_name)
                )
            });
            this.drawChartJS(casesList, "", orderBy);
/*            data.stat_by_country.map((c)=>{  
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
            });*/   
            
            this.setState({casesList: casesList});
        })
     }
     componentDidMount() {
        this.renderTableData(this.props.country.country);  
//        this.setCountry();    
    }
    getTimeline(orderBy)
    {
        if(this.state.country != undefined)
        {        
            this.renderTableData(this.state.country, orderBy);  
        }
        else{
            alert(this.state.phrase.errorMsg);
        }
    }

    setCountry()
    {
        let opts = []; 
        let countries = [];
        fetch('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php',
        {  
            headers: {
              'X-RapidAPI-Host': 'coronavirus-monitor.p.rapidapi.com', 
              'X-RapidAPI-Key': 'e9843df6f7mshaa54667ec07baf1p12224cjsn04cf86d86a81'
            }
        })
            .then(results=>{
            return results.json();
        })
        .then(data => {
            data.countries_stat.map((c)=>{
                countries.push(c.country_name);
            });
            countries.sort();
            countries.forEach(c => {
                if(this.props.country.country == c)
                    {
                        opts.push(<option key= {c} selected value={c}> {c} </option>);    
                    }
                    else{
                        opts.push(<option key= {c} value={c}> {c} </option>); 
                    }
            });
            this.state.opts = opts;
    
        })   
    }
    drawChartJS(casesList, str, orderBy){
        if(str == null)
        {
            str="";
        }
        
        const myChartRef = this.chartRef.current.getContext("2d");
        let deathList = [];
        let countryList = [];
        let timelist = [];
        let caseList = [];
        let todayDeathsList = [];
        let todayCasesList = [];
        let activeList = [];
        let recoveredList = [];
        
        switch(orderBy){
            case "asc":
                casesList.sort((a, b) => (new Date(a)>new Date(b)) ? -1 : 1);
                break;
            case "desc":
                casesList.sort((a, b) => (new Date(a)>new Date(b)) ? 1 : -1);
                break;
            default:
                casesList.sort((a, b) => (new Date(a)>new Date(b)) ? -1 : 1);
                break;
        }

        for(let i = 0; i<casesList.length;i++)
        {
            if(casesList[i].country.toLowerCase().includes(str.toLowerCase())){
                deathList.push(casesList[i].deaths);
                countryList.push(casesList[i].country);
                caseList.push(casesList[i].cases);
                let date = new Date(casesList[i].time);
                const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
                const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
                const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

                timelist.push(da+"."+mo);
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
          type: "line",
          data: {
              //Bring in data
              labels: timelist,
              datasets: datasetBars
          },
          options: { 
              maintainAspectRatio: false,
              responsive: true
          }
          
      });
      this.myChart.canvas.parentNode.style.height = '90vh';

    }
    getAllCountries()
    {
        if(this.state.country != undefined)
        {
            window.location.href = '/';
        }
        else{
            alert(this.state.phrase.errorMsg);
        }
    }
      changeLanguage(lang) {
        this.setState({
          language:  lang
        })
        this.state.language = lang;
        this.getTimeline();
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
            <select className="infoChild" id="countrySelect" onChange={(e)=>this.renderTableData(e.target.value)}>
                  {this.state.opts}
            </select>

            <input type="button" className="infoChild" onClick={(e) => this.getTimeline(this.state.casesList, e.target.value)} value={this.state.language === 'en' ? 'Choose country' : 'Избери држава'} ></input>
            </div><div>{this.state.language === 'en' ? 'Order by' : 'Сортирај по'}
            <select className="infoChild" onChange={(e)=>this.getTimeline(e.target.value)}>
                <option value="asc">{this.state.language === 'en' ? 'Date аscending' : 'Датум растечки'}</option>
                <option value="desc">{this.state.language === 'en' ? 'Date descending' : 'Датум опаѓачки'}</option>
            </select>
            </div>        
            <input type="button" className="infoChild" onClick={(e) => this.getAllCountries()} value={this.state.language === 'en' ? 'All countries' : 'Сите држави'} ></input>

        </div>
        <h2>{this.state.country}</h2>
            <canvas 
                id="myChart"
                ref={this.chartRef}
            />
        </div>
    )
    }
  }
      
  export default TimeChart;