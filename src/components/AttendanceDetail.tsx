import React, { Component } from 'react';

interface IProps {
  attendanceList: any[]
}

class ServiceDetail extends Component<IProps, {}> {
  render() { 
      const attendanceList = this.props.attendanceList;
      return ( 
        <div>
          <table>
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
            {attendanceList.map((attendanceDetail, key)=>{
              return (
                  <tr>
                    <td>{attendanceDetail.id}</td>
                    <td>{attendanceDetail.company}</td> 
                    <td>{attendanceDetail.department}</td>
                    <td>{attendanceDetail.lastName}</td>
                    <td>{attendanceDetail.firstName}</td>
                    <td>{attendanceDetail.phone}</td>
                    <td>{attendanceDetail.timeArrived}</td>
                    <td>{attendanceDetail.note}</td>
                    <button className="btn btn-primary btn-warning btn-delete" onClick={this.deleteAttendance.bind(this, attendanceDetail.id)}>Delete</button>
                  </tr>
                  )
                }
              )
            }
          </table>
        </div>
      );
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