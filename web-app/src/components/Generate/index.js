import React,{Component} from 'react'
import axios from 'axios'
import ButtonInput from '../ButtonInput'
import './generate.css'
import url from '../Api/get_url'

class Generate extends Component{
    state = {
        data: {},
        classes: undefined,
        qr_url: undefined
    }
    dateObj = new Date()
    date = `${this.dateObj.getFullYear()}-${this.dateObj.getMonth()}-${this.dateObj.getDate()}`
    class_inp_ele = React.createRef()
    subject_inp_ele = React.createRef()

    componentDidMount(){
        axios.get(`${url}/getGenerateData`).then(
            response => {
                this.setState({data: response['data']})
            })
    }

    subjectSelected = (event) => {
        const new_classes = this.state.data[event.target.value]
        this.setState({classes: new_classes})
    }

    formSubmitted = () => {
        const class_name = this.class_inp_ele.current.value
        const subj_name = this.subject_inp_ele.current.value
        if(subj_name !== "null" && class_name !== "null"){
            const call_url = `${url}/getQRimg/${this.date}/${class_name.replace(/ /g, '-')}/${subj_name.replace(/ /g, '-')}`
            axios.post(call_url).then(()=>{
                console.log(call_url)
                this.setState({qr_url: call_url})
            })
        }
        else{
            alert("Please select all values")
            return
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
        let qr_img = null
        if(this.state.qr_url !== undefined){
            qr_img = <img src={this.state.qr_url} alt="Your Qr code" />
        }
        return (
            <div className="Generate">
                <h1 className="GenerateMsg">Generate your QR code for today's attendance</h1>
                <table className="GenerateTable">
                    <tbody>
                        <tr>
                            <td><h3>Date:</h3></td>
                            <td><h3>{this.date}</h3></td>
                        </tr>
                        <tr>
                            <td><h3>Subject:</h3></td>
                            <td>
                                <select onChange={this.subjectSelected} ref={this.subject_inp_ele} className="InpSelect">
                                    <option value="null">-- select subject --</option>
                                    {subject_options}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><h3>Class:</h3></td>
                            <td>
                                <select ref={this.class_inp_ele} className="InpSelect">
                                    <option value="null">-- select class --</option>
                                    {class_options}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ButtonInput class_name="GenerateButton" value="GENERATE" show={true} clicked={this.formSubmitted}/>
                {qr_img}
            </div>
        )
    }
}

export default Generate