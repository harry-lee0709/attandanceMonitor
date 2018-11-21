import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import Title from "./components/Title";
import AttendanceDetail from "./components/AttendanceDetail";
import Webcam from "react-webcam";
import './App.css'

interface IState {
	attendanceList: any[],
  open: boolean,
  authenticationOpen: boolean,
  authenticated: boolean,
  refCamera: any
}

class App extends Component<{}, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      authenticationOpen: false,
      attendanceList: [],
      authenticated: false,
      refCamera: React.createRef()
    }

		this.fetchAttendance("")
    this.fetchAttendance = this.fetchAttendance.bind(this)
    this.authenticate = this.authenticate.bind(this)
  }

  render() {
    const { open } = this.state;
    const { authenticationOpen } = this.state;
    return (
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-10">
                <Title/>
              </div>
              <div className="col-sm-2">
                <div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Attendance</div>
                <div className="btn btn-primary btn-action btn-add" onClick={this.onAuthenticationModal}>Authenticate</div>
              </div>
            </div>
          </div>
          <AttendanceDetail attendanceList={this.state.attendanceList}/>
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
        <Modal open={authenticationOpen} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={this.state.refCamera}
          />
          <div className="row nav-row">
            <div className="btn btn-primary bottom-button" onClick={this.onAuthenticationCloseModal}>Cancel</div>
            <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
          </div>
        </Modal>
      </div>
    );
  }

  // Authenticate
  private authenticate() { 
    const screenshot = this.state.refCamera.current.getScreenshot();
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
