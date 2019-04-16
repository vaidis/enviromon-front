import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import './App.css';

const urls = [
  "http://192.168.1.101:8001",
  "http://192.168.1.102:8002",
  "http://192.168.1.104:8004",
  "http://192.168.1.105:8005",
]

class Sensor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      color: 'white',
    }
  }
  blink(color) {
    this.setState({'color': color})
    setTimeout(function() {
      this.setState({'color': 'white'});
    }.bind(this), 700);
  }
  fetchHost(url) {
	  fetch(url)
		  .then((response) => {
        this.blink('green');
				return response.json()
		  })
		  .then(resData => {
		    this.setState({'id' : resData.id });
		    this.setState({'temp' : resData.temp });
        this.setState({'humi' : resData.humi });
        this.setState({'title' : resData.title });
        this.setState({'desc' : resData.desc });
        this.setState({'location' : resData.location });
        this.blink('green');
		  })
	    .catch((error) => {
        console.log("FETCH ERROR: " , error);
        this.setState({'id' : 0 });
        this.setState({'title' : "Fetch Error" });
        this.setState({'desc' : url });
        this.setState({'temp' : 0 });
        this.setState({'humi' : 0 });
        this.blink('red');
		  });
	}
  componentDidMount() {
    this.fetchHost(this.state.url)
    this.timer = setInterval(() => this.fetchHost(this.state.url), 4000);
  }
  render() {
    return (
      <div className={"sensor color_" + this.state.color}>
        <div className="tablet">
          <div className="box icon">
            <img src={this.state.id + ".png"} alt={this.state.id}/>
            <p className="location">{this.state.location}</p>
          </div>      
          <div className="box title">
            <h2 className="title">{this.state.title}</h2>
            <p className="description">{this.state.desc}</p>
          </div>
        </div>
        <div className="tablet">
          <div className="box meter">
            <ReactSpeedometer 
              value={parseFloat(this.state.temp)}
              minValue={0}
              maxValue={100}
              ringWidth={25}
              width={160}
              height={110}
              segments={5}
              startColor="#0000EE"
              endColor="#EE0000"
              needleColor="black"
              needleTransitionDuration={3000}
              needleTransition="easeElastic"
              currentValueText={"Temperature: " + this.state.temp + "°C"}
            />
          </div>
          <div className="box meter">
            <ReactSpeedometer 
            value={parseFloat(this.state.humi)}
            minValue={0}
            maxValue={100}
            ringWidth={25}
            width={160}
            height={110}
            segments={5}
            startColor="#888888"
            endColor="#00eeff"
            needleColor="#000000`"
            needleTransitionDuration={3000}
            needleTransition="easeElastic"
            currentValueText={"Humidity: " + this.state.humi + "%"}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div className="header">
        <img src="logo.png" alt=""/>
        <h1>MyCompany Server Rooms Enviroment</h1>
      </div>
    );
  }
}
class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <p>An email alarm will be send at temperature 32 ℃ to admin@mycompany.com, support@mycompany.com</p>
      </div>
    );
  }
}

class Meters extends Component {
  render() {
    return (
      <div className="meters">  
        { 
          this.props.urls.map((url, key) => {
            return <Sensor key={key} url={url}/>
          })
        }
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Meters urls={urls} />
        <Footer />
      </div>
    );
  }
}

export default App;
