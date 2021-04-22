import React,{Component} from 'react'
import axios from 'axios'
import ButtonInput from '../ButtonInput'
import './Dtab.css'
import url from '../Api/get_url'

class DownloadSheet extends Component{
    state = {
        data: {},
        classes: undefined,
        date: null
    }
    class_inp_ele = React.createRef()
    subject_inp_ele = React.createRef()

    componentDidMount(){
        this.setState({data: this.props.data})
    }

    subjectSelected = (event) => {
        const new_classes = this.state.data[event.target.value]
        this.setState({classes: new_classes})
    }

    dateChanged = (event) => {
        this.setState({date: event.target.value})
    }

    formSubmitted = () => {
        const class_name = this.class_inp_ele.current.value
        const subj_name = this.subject_inp_ele.current.value
        const date = this.state.date
        
        if(subj_name === "null" || class_name === "null" || date === null){
            alert("Please select all values")
        } else {
            const req_download = async () => {
                const headers = {
                    Accept : "text/csv; charset=utf-8",
                    "Content-Type": "text/csv; charset=utf-8"
                }
                console.log(`${url}/getSheet/${date}/${class_name.replace(/ /g, '-')}/${subj_name.replace(/ /g, '-')}`)
                let promise = new Promise((resolve, reject) => {
                  axios.get(`${url}/getSheet/${date}/${class_name.replace(/ /g, '-')}/${subj_name.replace(/ /g, '-')}`, headers).then(response => {
                      if(typeof(response.data) === 'object'){
                        reject(response.data.Result)
                      } else{
                        resolve(response.data)
                      }
                  })
                })
    
                try{
                    let content = await promise
                    let contentType = 'text/csv'
                    let fileName = `${subj_name}_${date}.csv`
                    let file = new Blob([content], {type: contentType})
                    let a = document.createElement('a')
                    a.href = URL.createObjectURL(file)
                    a.download = fileName
                    a.value = "click me"
                    a.click()
                    a.remove()
                }
                catch(message){
                    alert(message)
                }
              }
            req_download();
        }
    }

    render(){
        const subjects = Object.keys(this.state.data)
        const subject_options = subjects.map((subject,index) =>  <option key={index} value={subject}>{subject}</option>)
        const classes = this.state.classes
        let class_options = null
        if(classes !== undefined){
            class_options = classes.map((class_name,index) =>  <option key={index} value={class_name}>{class_name}</option>)
        }
        return (
            <div className="DtabSheet">
                <h1 className="DtabMsg">Download attendance sheet</h1>
                <table className="DtabTable">
                    <tbody>
                        <tr>
                            <td><h3>Date:</h3></td>
                            <td><input className="DtabDate" onChange={this.dateChanged} type="date" /></td>
                        </tr>
                        <tr>
                            <td><h3>Subject:</h3></td>
                            <td>
                                <select onChange={this.subjectSelected} ref={this.subject_inp_ele} className="DtabInpSelect">
                                    <option value="null">-- select subject --</option>
                                    {subject_options}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><h3>Class:</h3></td>
                            <td>
                                <select ref={this.class_inp_ele} className="DtabInpSelect">
                                    <option value="null">-- select class --</option>
                                    {class_options}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ButtonInput class_name="DownloadAttendance" value="Download sheet" show={true} clicked={this.formSubmitted}/>
            </div>
        )
    }
}

export default DownloadSheet