import React, { Component } from 'react';
import Title from "./components/Title";
import AttendanceDetail from "./components/AttendanceDetail";

const services = [
  {
    name: 'cleaning',
    price: 60
  },
  {
    name: 'cooking',
    price: 20
  }
]

localStorage.setItem('services', JSON.stringify(services));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: []
    };
  }

  componentWillMount() {
    const services = JSON.parse(localStorage.getItem('services'));
    this.setState({ services });
  }

  render() {
    return (
      <div>
        <Title/>
        <hr/>
        {this.state.services.map(services => {
          return (
            <AttendanceDetail
              key={services.name}
              {...services}
            />)
        })}
      </div>
    );
  }
}

export default App;
