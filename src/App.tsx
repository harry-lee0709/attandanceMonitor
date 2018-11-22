import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import AttendanceDetail from "./components/AttendanceDetail";
import Webcam from "react-webcam";
import exportFromJSON from 'export-from-json'
import './App.css'
import Logo from './logo.svg';

interface IState {
	attendanceList: any[],
  open: boolean,
  authenticationOpen: boolean,
  authenticated: boolean,
  refCamera: any,
  predictionResult: any,
  latitude: any,
  longitude: any,
  savedLatitude: any,
  savedLongitude: any,
	isShowingAddAttendance: boolean,
}

class App extends Component<{}, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      authenticationOpen: false,
      attendanceList: [],
      authenticated: false,
      refCamera: React.createRef(),
      predictionResult: "",
      latitude: "",
      longitude: "",
      savedLatitude: "",
      savedLongitude: "",
			isShowingAddAttendance: false,
    }

		this.fetchAttendance("")
    this.fetchAttendance = this.fetchAttendance.bind(this)
    this.authenticate = this.authenticate.bind(this)
    this.exportToExcel = this.exportToExcel.bind(this)
    this.getCurrentLocation = this.getCurrentLocation.bind(this)
    this.setCurrentLocation = this.setCurrentLocation.bind(this)
  }

  render() {
    const { open } = this.state;
    const { authenticationOpen, isShowingAddAttendance } = this.state;
    return (
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-7">
                <img id="logo" src={Logo} height="80"/><h2>Attendance Monitor - <b>MSA 2018</b></h2>
              </div>
              <div className="col-sm-5">
								{isShowingAddAttendance &&
                <div className="btn btn-primary btn-action btn-add" id="addAttendanceButton" onClick={this.onOpenModal}><span>Add Attendance</span></div> }
                <div className="btn btn-primary btn-action btn-add" onClick={this.onAuthenticationModal}><span>Authenticate</span></div>
                <div className="btn btn-primary" onClick={this.exportToExcel}><span>Export to Excel</span></div>
                <div className="btn btn-primary bottom-button" onClick={this.setCurrentLocation}>setCurrentLocation</div>
                <div className="btn btn-primary bottom-button" onClick={this.getCurrentLocation}>getCurrentLocation</div>
              </div>
            </div>
          </div>
          <AttendanceDetail attendanceList={this.state.attendanceList} authenticated={this.state.authenticated}/>
        </div>
        <Modal open={open} onClose={this.onCloseModal}>
          <form>
            <div className="form-group">
              <label>ID</label>
              <input type="text" className="form-control" id="id-input" placeholder="Enter ID" />
              <small className="form-text text-muted">*required*</small>
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" className="form-control" id="company-input" placeholder="Enter Company" />
              <small className="form-text text-muted">*required*</small>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" className="form-control" id="department-input" placeholder="Enter Department" />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="form-control" id="firstname-input" placeholder="Enter First Name" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" className="form-control" id="lastname-input" placeholder="Enter Last Name" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" className="form-control" id="phone-input" placeholder="Enter Phone" />
            </div>
            <div className="form-group">
              <label>Note</label>
              <input type="text" className="form-control" id="note-input" placeholder="Enter Note" />
              <small className="form-text text-muted">Please enter any additional info.</small>
            </div>

            <button type="button" className="btn" onClick={this.uploadAttendance}>Submit</button>
          </form>
			  </Modal>
        <Modal open={authenticationOpen} onClose={this.onAuthenticationCloseModal} center={true}>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={this.state.refCamera}
          />
          <div className="row nav-row">
            <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
          </div>
        </Modal>
      </div>
    );
  }

    // Authenticate
  private authenticate() {
    const screenshot = this.state.refCamera.current.getScreenshot();
    this.getFaceRecognitionResult(screenshot);
    this.onAuthenticationCloseModal;
  }

    // Call custom vision model
  private getFaceRecognitionResult(image: string) {
    const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/3f844f94-31c7-418d-8923-0b8845581c80/image?iterationId=8f70f8e3-e02e-4f0d-80fe-120820ee755f"
    if (image === null) {
      return;
    }
    const base64 = require('base64-js');
    const base64content = image.split(";")[1].split(",")[1]
    const byteArray = base64.toByteArray(base64content);
    fetch(url, {
      body: byteArray,
      headers: {
        'cache-control': 'no-cache', 'Prediction-Key': '0307db03b617462b86719d04e1e9439d', 'Content-Type': 'application/octet-stream'
      },
      method: 'POST'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error State
          alert(response.statusText)
        } else {
          response.json().then((json: any) => {
            console.log(json.predictions[0])
            this.setState({predictionResult: json.predictions[0] })
            if (this.state.predictionResult.probability > 0.7) {
              this.setState({authenticated: true})
            } else {
              this.setState({authenticated: false})
            }
          })
        }
      })
  }
  private async setCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        savedLatitude: position.coords.latitude,
        savedLongitude: position.coords.longitude
      })
    })
    if (this.state.savedLatitude != "" && this.state.savedLongitude != "")
      alert(`Location has set to ${this.state.savedLatitude} ${this.state.savedLongitude}.`)
    else alert("Unable to set the current location.")
  }

  private getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    })
    if (this.state.savedLatitude+1 >= this.state.latitude && this.state.latitude <= this.state.savedLatitude-1 &&
      this.state.savedLongitude+1 >= this.state.longitude && this.state.longitude <= this.state.savedLongitude-1) {
        //set button with id="addAttendanceButton" visible which is hidden by default.
				this.setState({isShowingAddAttendance: true});
      }
    console.log(`saved lat ${this.state.savedLatitude}, saved long ${this.state.savedLongitude}, current lat ${this.state.latitude}, current long ${this.state.longitude}`)
  }

    //exports table data as csv file
  private exportToExcel() {
    const data = this.state.attendanceList
    var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    const fileName = "attendanceMonitor" + date;
    const exportType = 'csv'
    exportFromJSON({ data, fileName, exportType })
    alert("Table data exported successfully.")
  }

  private fetchAttendance(id: any) {
		let url = "https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance"
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

  private uploadAttendance() {
		const idInput = document.getElementById("id-input") as HTMLInputElement
		const companyInput = document.getElementById("company-input") as HTMLInputElement
		const departmentInput = document.getElementById("department-input") as HTMLInputElement
		const firstnameInput = document.getElementById("firstname-input") as HTMLInputElement
		const lastnameInput = document.getElementById("lastname-input") as HTMLInputElement
		const phoneInput = document.getElementById("phone-input") as HTMLInputElement
		const noteInput = document.getElementById("note-input") as HTMLInputElement

		if (idInput === null || companyInput === null) {
			return;
		}

    const id = idInput.value
    const company = companyInput.value
    const department = departmentInput.value
    const firstName = firstnameInput.value
    const lastName = lastnameInput.value
    const phone = phoneInput.value
    const timeArrived = Date().toString()
    const note = noteInput.value
		const url = "https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance"

		fetch(url, {
			body: JSON.stringify({
        id,
        company,
        department,
        firstName,
        lastName,
        phone,
        timeArrived,
        note
      }),
			headers: {'Content-Type': 'application/json'},
			method: 'POST'
		})
      .then((response : any) => {
			  if (!response.ok) {
				  // Error State
				  alert(response.statusText)
			  } else {
				  location.reload()
        }
    })
  }

  private onAuthenticationModal = () => {
    this.setState({ authenticationOpen: true});
  }

  private onAuthenticationCloseModal = () => {
    this.setState({ authenticationOpen: false});
  }

    // Modal open
  private onOpenModal = () => {
    this.setState({ open: true });
    };

  // Modal close
  private onCloseModal = () => {
    this.setState({ open: false });
  };
}

export default App;
