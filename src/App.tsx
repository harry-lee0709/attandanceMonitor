import React, { Component } from "react";
import Modal from "react-responsive-modal";
import { Glyphicon } from "react-bootstrap";
import AttendanceDetail from "./components/AttendanceDetail";
import Webcam from "react-webcam";
import exportFromJSON from "export-from-json";
import "./App.css";
import Logo from "./logo.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";

interface IState {
  attendanceList: any[];
  open: boolean;
  authenticationOpen: boolean;
  authenticated: boolean;
  refCamera: any;
  predictionResult: any;
  latitude: any;
  longitude: any;
  savedLatitude: any;
  savedLongitude: any;
  isShowingAddAttendance: boolean;
  currentLocationReturned: boolean;
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
      currentLocationReturned: false
    };

    this.fetchAttendance("");
    this.fetchAttendance = this.fetchAttendance.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.exportToExcel = this.exportToExcel.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
  }

  render() {
    const { open } = this.state;
    const { authenticationOpen, isShowingAddAttendance } = this.state;
    return (
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-5">
                <img id="logo" src={Logo} height="80" />
                <h2>
                  Attendance Monitor - <b>MSA 2018</b>
                </h2>
              </div>
              <div className="col-sm-7">
                {isShowingAddAttendance && (
                  <div
                    className="btn btn-primary btn-action btn-add"
                    id="addAttendanceButton"
                    onClick={this.onOpenModal}
                  >
                <span className="glyphicon glyphicon-time"/>
                    <span>Add Attendance</span>
                  </div>
                )}
                <div
                  className="btn btn-primary btn-action btn-add"
                  onClick={this.onAuthenticationModal}
                >
                <span className="glyphicon glyphicon-camera"/>
                  <span>Authenticate</span>
                </div>
                <div className="btn btn-primary" onClick={this.exportToExcel}>
                <span className="glyphicon glyphicon-save-file"/>
                  <span>Export to Excel</span>
                </div>
                {(this.state.authenticated) && 
                <div
                  className="btn btn-primary bottom-button"
                  onClick={this.setCurrentLocation}
                >
                <span className="glyphicon glyphicon-map-marker"/>
                  Set Location
                </div> }
                <div
                  className="btn btn-primary bottom-button"
                  onClick={this.getCurrentLocation}
                >
                <span className="glyphicon glyphicon-map-marker"/>
                  Let Me Log It
                </div>
              </div>
            </div>
          </div>
          <AttendanceDetail
            attendanceList={this.state.attendanceList}
            authenticated={this.state.authenticated}
          />
        </div>
        <Modal open={open} onClose={this.onCloseModal}>
          <form>
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                className="form-control"
                id="id-input"
                placeholder="Enter ID"
              />
              <small className="form-text text-muted">*required*</small>
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                className="form-control"
                id="company-input"
                placeholder="Enter Company"
              />
              <small className="form-text text-muted">*required*</small>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                id="department-input"
                placeholder="Enter Department"
              />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstname-input"
                placeholder="Enter First Name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastname-input"
                placeholder="Enter Last Name"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                className="form-control"
                id="phone-input"
                placeholder="Enter Phone"
              />
            </div>
            <div className="form-group">
              <label>Note</label>
              <input
                type="text"
                className="form-control"
                id="note-input"
                placeholder="Enter Note"
              />
              <small className="form-text text-muted">
                Please enter any additional info.
              </small>
            </div>

            <button
              type="button"
              className="btn"
              onClick={this.uploadAttendance}
            >
              Submit
            </button>
          </form>
        </Modal>
        <Modal
          open={authenticationOpen}
          onClose={this.onAuthenticationCloseModal}
          center={true}
        >
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={this.state.refCamera}
          />
          <div className="row nav-row">
            <div
              className="btn btn-primary bottom-button"
              onClick={this.authenticate}
            >
              Login
            </div>
          </div>
        </Modal>
        <ToastContainer />
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
    const url =
      "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/3f844f94-31c7-418d-8923-0b8845581c80/image?iterationId=8f70f8e3-e02e-4f0d-80fe-120820ee755f";
    if (image === null) {
      return;
    }
    const base64 = require("base64-js");
    const base64content = image.split(";")[1].split(",")[1];
    const byteArray = base64.toByteArray(base64content);
    fetch(url, {
      body: byteArray,
      headers: {
        "cache-control": "no-cache",
        "Prediction-Key": "0307db03b617462b86719d04e1e9439d",
        "Content-Type": "application/octet-stream"
      },
      method: "POST"
    }).then((response: any) => {
      if (!response.ok) {
        // Error State
        toast.error(response.statusText, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        response.json().then((json: any) => {
          console.log(json.predictions[0]);
          this.setState({ predictionResult: json.predictions[0] });
          if (this.state.predictionResult.probability > 0.7) {
            this.setState({ authenticated: true, authenticationOpen: false });
            toast.dismiss();
            toast.success("Authentication Successful!", {
              position: toast.POSITION.BOTTOM_LEFT
            });
          } else {
            this.setState({ authenticated: false });
            toast.error("HAHA YOU HAVE WRONG FACE!", {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          }
        });
      }
    });
  }

  private setCurrentLocation() {
    const one = new Promise<boolean>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          savedLatitude: position.coords.latitude,
          savedLongitude: position.coords.longitude
        });
        resolve(true);
      });
    });

    one.then(value => {
      if (value) {
        toast.dismiss()
        toast.success(
          `Location has set to ${this.state.savedLatitude} ${
            this.state.savedLongitude
          }.`,
          {
            position: toast.POSITION.BOTTOM_LEFT
          }
        );
      } 
      else
        toast.error(
        "Unable to set current location.",
        {
          position: toast.POSITION.BOTTOM_RIGHT
        }
      );
    });
  }

  private getCurrentLocation() {
    const two = new Promise<boolean>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        resolve(true);
      });
    });
    two.then(value => {
      if (value) {
        if (this.arePointsNear()) {
          //set button with id="addAttendanceButton" visible which is hidden by default.
          this.setState({ isShowingAddAttendance: true });
          toast.dismiss()
          toast.success(
            "You are at the right place! I will give you the right to add attendance!",
            {
              position: toast.POSITION.BOTTOM_LEFT
            })
        }
        else
        toast.error(
        "You are NOT at the right place! You CAN'T post attendance!",
        {
          position: toast.POSITION.BOTTOM_RIGHT
        }
      );
      }
    });
    
  }

  private arePointsNear() {
    let ky = 40000 / 360;
    let kx = Math.cos((Math.PI * this.state.savedLatitude) / 180.0) * ky;
    let dx = Math.abs(this.state.savedLongitude - this.state.longitude) * kx;
    let dy = Math.abs(this.state.savedLatitude - this.state.latitude) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= 5;
  }

  //exports table data as csv file
  private exportToExcel() {
    const data = this.state.attendanceList;
    let date = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    const fileName = "attendanceMonitor" + date;
    const exportType = "csv";
    exportFromJSON({ data, fileName, exportType });
    toast.dismiss()
    toast.success("Table data exported successfully.", {
      position: toast.POSITION.BOTTOM_LEFT
    });
  }

  private fetchAttendance(id: any) {
    let url =
      "https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance";
    if (id !== "") {
      url += "/id?=" + id;
    }
    fetch(url, { method: "GET" })
      .then(res => res.json())
      .then(json => {
        this.setState({
          attendanceList: json
        });
      });
  }

  private uploadAttendance() {
    const idInput = document.getElementById("id-input") as HTMLInputElement;
    const companyInput = document.getElementById(
      "company-input"
    ) as HTMLInputElement;
    const departmentInput = document.getElementById(
      "department-input"
    ) as HTMLInputElement;
    const firstnameInput = document.getElementById(
      "firstname-input"
    ) as HTMLInputElement;
    const lastnameInput = document.getElementById(
      "lastname-input"
    ) as HTMLInputElement;
    const phoneInput = document.getElementById(
      "phone-input"
    ) as HTMLInputElement;
    const noteInput = document.getElementById("note-input") as HTMLInputElement;

    if (idInput === null || companyInput === null) {
      return;
    }

    const id = idInput.value;
    const company = companyInput.value;
    const department = departmentInput.value;
    const firstName = firstnameInput.value;
    const lastName = lastnameInput.value;
    const phone = phoneInput.value;
    const timeArrived = Date().toString();
    const note = noteInput.value;
    const url =
      "https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance";

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
      headers: { "Content-Type": "application/json" },
      method: "POST"
    }).then((response: any) => {
      if (!response.ok) {
        // Error State
        toast.error(response.statusText, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        location.reload();
      }
    });
  }

  private onAuthenticationModal = () => {
    this.setState({ authenticationOpen: true });
  };

  private onAuthenticationCloseModal = () => {
    this.setState({ authenticationOpen: false });
  };

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
