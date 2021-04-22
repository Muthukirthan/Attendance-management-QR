import React, {Component} from 'react'
import ButtonInput from '../ButtonInput'
import axios from 'axios'
import url from '../Api/get_url'
import './addField.css'

class NewSubj extends Component{
    state = {
        classes: [],
        class: null,
        subject: ""
    }

    componentDidMount(){
        this.setState({classes: this.props.classes})
    }

    classChanged = (event) => {
        this.setState({class: event.target.value})
    }

    subjChanged = (event) => {
        this.setState({subject: event.target.value})
    }

    NewSubjClicked = () => {
        if(this.state.class === null || this.state.subject === ""){
            alert("Please select all values")
        } else {
            const data = {
                'dept_name': "",
                'class_name': this.state.class,
                'subj_name': this.state.subject
            }
            axios.post(`${url}/dashboardData`, data).then(
                response => {
                    alert(response.data.Result)
                })
        }
    }

    render(){
        const class_options = this.state.classes.map((class_name,index) =>  <option key={index} value={class_name}>{class_name}</option>)
        return(
            <div className="NewSubj">
                <select onChange={this.classChanged} className="InpSelect">
                    <option value="null">-- select class --</option>
                    {class_options}
                </select><br/>
                <input type="text" onChange={this.subjChanged} placeholder="Subject" className="Inp"/><br/>
                <ButtonInput class_name="NewSubjButton" value="Add subject" show={true} clicked={this.NewSubjClicked}/>
            </div>
        )
    }
}

export default NewSubj