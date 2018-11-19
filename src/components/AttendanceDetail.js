import React, { Component } from 'react';

class ServiceDetail extends Component {
    render() { 
        const { name, price } = this.props;
        return ( 
            <div className="serviceDetail">
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
                <tr>
                  <td>id</td>
                  <td>company</td> 
                  <td>department</td>
                  <td>lastName</td>
                  <td>firstName</td>
                  <td>phone</td>
                  <td>timeArrived</td>
                  <td>note</td>
                </tr>
              </table>
            </div>
        );
    }
}
 
export default ServiceDetail;