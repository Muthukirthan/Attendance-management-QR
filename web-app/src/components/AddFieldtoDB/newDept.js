import React, {Component} from 'react'
import ButtonInput from '../ButtonInput'
import axios from 'axios'
import url from '../Api/get_url'
import './addField.css'

class NewDept extends Component{
    state = {
        department: "",
        class: ""
    }

    deptChanged = (event) => {
        this.setState({department: event.target.value})
    }

    classChanged = (event) => {
        this.setState({class: event.target.value})
    }

    NewDeptClicked = () => {
        if(this.state.department === "" || this.state.class === ""){
            alert("Please select all values")
        } else {
            const data = {
                'dept_name': this.state.department,
                'class_name': this.state.class,
                'subj_name': ""
            }
            axios.post(`${url}/dashboardData`, data).then(
                response => {
                    alert(response.data.Result)
                })
        }
    }

    render(){
        return(
            <div className="NewDept">
                <input type="text" onChange={this.deptChanged} placeholder="Department" className="Inp"/>
                <input type="text" onChange={this.classChanged} placeholder="Class" className="Inp"/><br/>
                <ButtonInput class_name="NewDeptButton" value="Add department" show={true} clicked={this.NewDeptClicked}/>
            </div>
        )
    }
}

export default NewDept