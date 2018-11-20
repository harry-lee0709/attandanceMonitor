import React, { Component } from 'react';

class ServiceDetail extends Component {
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
                  </tr>
              )
            })}
          </table>
        </div>
      );
  }
}

export default ServiceDetail;