import React, {Component} from 'react'
import ButtonInput from '../ButtonInput'
import NewDept from './newDept'
import NewClass from './newClass'
import NewSubj from './newSubj'
import './addField.css'

class AddFieldtoDB extends Component{
    state = {
        data: {
            departments: [],
            classes: []
        },
        option: {
            isDept: true,
            isClass: false,
            isSubj: false
        }
    }

    componentDidMount(){
        this.setState({data: this.props.data})
    }

    optionClicked = (event) => {
        if(event.target.value === "New department"){
            this.setState({option: {isDept: true, isClass: false, isSubj: false}})
        }
        else if(event.target.value === "New class"){
            this.setState({option: {isDept: false, isClass: true, isSubj: false}})
        }
        else{
            this.setState({option: {isDept: false, isClass: false, isSubj: true}})
        }
    }

    render(){
        let newField = null
        if(this.state.option.isDept){
            newField = <NewDept/>
        }
        else if(this.state.option.isClass){
            newField = <NewClass departments={this.state.data.departments}/>
        } 
        else if(this.state.option.isSubj){
            newField = <NewSubj classes={this.state.data.classes}/>
        }
        return(
            <div className="AddFieldOptions">
                <h1>Add new department, class or subject to your Institute</h1>
                <ButtonInput class_name={this.state.option.isDept ? "NewDeptContainerSelected":"NewDeptContainer"} value="New department" show={true} clicked={this.optionClicked}/>
                <ButtonInput class_name={this.state.option.isClass ? "NewClassContainerSelected":"NewClassContainer"} value="New class" show={true} clicked={this.optionClicked}/>
                <ButtonInput class_name={this.state.option.isSubj ? "NewSubjContainerSelected":"NewSubjContainer"} value="New subject" show={true} clicked={this.optionClicked}/>
                {newField}
            </div>
        )
    }
}

export default AddFieldtoDB