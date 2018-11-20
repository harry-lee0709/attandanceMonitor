import React, { Component } from 'react';
import Title from "./components/Title";
import AttendanceDetail from "./components/AttendanceDetail";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
			currentAttendance: {"id":0, "company":"","department":"","firstName":"","lastName":"","phone":"0","timeArrived":"","note":""},
			attendanceList: [],
      open: false,
      random: "hello"
		}     
		
		this.fetchAttendance("")
		//this.selectNewAttendance = this.selectNewAttendance.bind(this)
		this.fetchAttendance = this.fetchAttendance.bind(this)
		//this.uploadAttendance = this.uploadAttendance.bind(this)
  }

  render() {
    return (
      <div>
        <Title/>
        <AttendanceDetail attendanceList={this.state.attendanceList}/>
      </div>
    );
  }

  fetchAttendance(id) {
		let url = "https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance/"
		if (id !== "") {
			url += "/id?=" + id
		}
    fetch(url, {method: 'GET'})
    .then(res => res.json())
    .then(json => {
      this.setState({
      attendanceList: json
      })
    });
	}
}

export default App;
