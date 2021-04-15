import React from 'react'
import './attendance.css'

const Table = (props) => {
    const row_data = props.data.map(
        (student,index) => {
            return (
                <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.roll_num}</td>
                </tr>
            )
        }
    )
    return (
        <table className="AttendanceTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                </tr>
            </thead>
            <tbody>
                {row_data}
            </tbody>
        </table>
    )
}

export default Table