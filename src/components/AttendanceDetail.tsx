import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

interface IProps {
  attendanceList: any[],
  authenticated: boolean
}

interface IState {
  open: boolean
}

class ServiceDetail extends Component<IProps, IState, {}> {

  constructor(props: any) {
    super(props)   
    this.state = {
        open: false
    }
  }

  render() { 
      const attendanceList = this.props.attendanceList;
      const authenticated = this.props.authenticated;
      const { open } = this.state;
      return ( 
        <div>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="tableHeading">
                <th>ID</th>
                <th>Company</th> 
                <th>Department</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Phone</th>
                <th>Time Arrived</th>
                <th>Note</th>
              </tr>
            </thead>
            {attendanceList.map((attendanceDetail)=>{
              return (
                  <tbody>
                    <tr>
                      <td className="attendanceData" id="id-field">{attendanceDetail.id}</td>
                      <td className="attendanceData" id="company-field">{attendanceDetail.company}</td> 
                      <td className="attendanceData" id="department-field">{attendanceDetail.department}</td>
                      <td className="attendanceData" id="lastName-field">{attendanceDetail.lastName}</td>
                      <td className="attendanceData" id="firstName-field">{attendanceDetail.firstName}</td>
                      <td className="attendanceData" id="phone-field">{attendanceDetail.phone}</td>
                      <td className="attendanceData" id="timeArrived-field">{attendanceDetail.timeArrived}</td>
                      <td className="attendanceData" id="note-field">{attendanceDetail.note}</td>
                      {(authenticated) &&
                        <div>
                        <button className="btn btn-primary btn-warning btn-edit" onClick={this.onOpenModal}>Edit</button>
                        <button className="btn btn-primary btn-danger btn-delete" onClick={this.deleteAttendance.bind(this, attendanceDetail.id)}>Delete</button>
                        </div>
                       }
                    </tr>
                  </tbody>
                )
              }
            ) 
            }
          </table>
          <div>
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
                  <input type="text" className="form-control" id="firstName-input" placeholder="Enter First Name" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" id="lastName-input" placeholder="Enter Last Name" />
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
                <button type="button" className="btn" onClick={this.editAttendance}>Save</button>
              </form>
            </Modal>
          </div>
        </div>
      );
    }

    private onOpenModal = () => {
      this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		  this.setState({ open: false });
	  };

    // PUT Attendance
    private editAttendance(){
      const idInput = document.getElementById("id-input") as HTMLInputElement
      const companyInput = document.getElementById("company-input") as HTMLInputElement
      const departmentInput = document.getElementById("department-input") as HTMLInputElement
      const lastNameInput = document.getElementById("lastName-input") as HTMLInputElement
      const firstNameInput = document.getElementById("firstName-input") as HTMLInputElement
      const phoneInput = document.getElementById("phone-input") as HTMLInputElement
      const noteInput = document.getElementById("note-input") as HTMLInputElement

      if (idInput === null || companyInput === null) {
        return;
      }
      const updatedId = idInput.value
      const updatedCompany = companyInput.value
      const updatedDepartment = departmentInput.value
      const updatedLastName = lastNameInput.value
      const updatedFirstName = firstNameInput.value
      const updatedPhone = phoneInput.value
      const updatedTimeArrived = Date().toString()
      const updatedNote = noteInput.value

      const url = `https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance/${updatedId}`
  fetch(url, {
    body: JSON.stringify({
              "id": updatedId,
              "company": updatedCompany,
              "department": updatedDepartment,
              "lastName": updatedLastName,
              "firstName": updatedFirstName,
              "phone": updatedPhone,
              "timeArrived": updatedTimeArrived,
              "note": updatedNote
          }),
    headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
    method: 'PUT'
  })
      .then((response : any) => {
    if (!response.ok) {
      // Error State
      alert(response.statusText + " " + url)
    } else {
      location.reload()
    }
    })
  }

    // DELETE Attendance
  private deleteAttendance(id: any) {
    const url = "https://msaphase22018attendanceapi.azurewebsites.net/api/Attendance/" + id

  fetch(url, {method: 'DELETE'})
    .then((response : any) => {
      if (!response.ok) {
        // Error Response
        alert(response.statusText)
      }
      else {
            location.reload()
      }
    })
  }
}

export default ServiceDetail;