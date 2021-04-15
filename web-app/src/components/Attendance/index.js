import React,{Component} from 'react'
import axios from 'axios'
import ButtonInput from '../ButtonInput'
import Table from './my-table'
import './attendance.css'
import Hoc from '../../containers/hoc'
import url from '../Api/get_url'

class Attendance extends Component{
    state = {
        sheet: [],
        date: undefined,
        subj_name: undefined,
        class_name: undefined,
        empty_class: true
    }
    key_file = React.createRef()
    file_reader

    componentDidMount(){
        axios.get(`${url}/getAttendance${this.props.location.pathname.slice(11)}`).then(
            response => {
                this.setState({
                    sheet: response['data']['sheet'],
                    empty_class: false,
                    date: response['data']['date'],
                    subj_name: response['data']['subject'],
                    class_name: response['data']['class']
                })
            })
    }

    handleFileRead = (e) => {
        const content = this.file_reader.result
        const data = {
            "key":content,
            "date":this.state.date,
            "subject": this.state.subj_name,
            "class": this.state.class_name
        }
        axios.post(`${url}/postKey`,data).then(
            response => {
                let new_sheet = this.state.sheet
                new_sheet.push(response.data)
                this.setState({sheet: new_sheet})
            })
    }

    keySubmitted = () => {
        this.file_reader = new FileReader()
        this.file_reader.onloadend = this.handleFileRead
        this.file_reader.readAsText(this.key_file.current.files[0])
    }
    
    render(){
        let sheet = <h1 className="NoStudents">No Students Present</h1>
        if(this.state.sheet.length > 0){
            sheet = (
                <Table data={this.state.sheet} />
            )
        }
        return (
            <Hoc>
                <div className="GettingAttendane">
                    <input type="file" ref={this.key_file} className="InpFile"/>
                    <ButtonInput value="Get attendance" show={true} clicked={this.keySubmitted} class_name="Attendance"/>
                </div>
                <div className="ClassInfo">
                    <h3>Date: {this.state.date}</h3>
                    <h3>Subject: {this.state.subj_name}</h3>
                    <h3>Class: {this.state.class_name}</h3>
                </div>
                {sheet}
            </Hoc>
        )
    }
}

export default Attendance