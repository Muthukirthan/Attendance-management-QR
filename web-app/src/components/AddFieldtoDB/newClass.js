import React, {Component} from 'react'
import ButtonInput from '../ButtonInput'
import axios from 'axios'
import url from '../Api/get_url'
import './addField.css'

class NewClass extends Component{
    state = {
        departments: [],
        department: null,
        class: ""
    }

    componentDidMount(){
        this.setState({departments: this.props.departments})
    }

    deptChanged = (event) => {
        this.setState({department: event.target.value})
    }

    classChanged = (event) => {
        this.setState({class: event.target.value})
    }

    NewClassClicked = () => {
        if(this.state.department === null || this.state.class === ""){
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
        const dept_options = this.state.departments.map((dept_name,index) =>  <option key={index} value={dept_name}>{dept_name}</option>)
        return(
            <div className="NewClass">
                <select onChange={this.deptChanged} className="InpSelect">
                    <option value="null">-- select department --</option>
                    {dept_options}
                </select><br/>
                <input type="text" onChange={this.classChanged} placeholder="Class" className="Inp"/><br/>
                <ButtonInput class_name="NewClassButton" value="Add class" show={true} clicked={this.NewClassClicked}/>
            </div>
        )
    }
}

export default NewClass