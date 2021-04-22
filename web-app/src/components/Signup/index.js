import React,{Component} from 'react'
import ButtonInput from '../ButtonInput'
import axios from 'axios'
import './signup.css';
import student_logo from '../../assets/student.png'
import invalidField from '../../assets/invalid_field.png'
import url from '../Api/get_url'

class Signup extends Component{
    class_inp_ele = React.createRef()
    state = {
        students: [],
        departments: {},
        classes: undefined,
        valid_name: null,
        valid_roll_num: null
    }
    student = {
        'roll_num': null,
        'name': null,
        'class_name': null
    }

    componentDidMount(){
        axios.get(`${url}/getSignUpData`).then(response => {
            this.setState({
                students: response['data']['roll_nums'],
                departments: response['data']['departments']
            })
        })
    }

    validateName = (event) => {
        const name = event.target.value
        const isValid = this.state.valid_name
        if(/[~`!@#$%^&*(),.?":{}|<>]/g.test(name) || /\d+/g.test(name) || name === "") {
            if(isValid === true){
                this.setState({valid_name: !isValid})
            }
            else if(isValid === null){
                this.setState({valid_name: false})
            }
        }
        else if(isValid === false || isValid === null){
            this.setState({valid_name: !isValid})
        }
        else if(isValid === null){
            this.setState({valid_name: true})
        }
        this.student['name'] = name
    }

    validateRollNum = (event) => {
        const roll_num = event.target.value
        const isValid = this.state.valid_roll_num
        if(roll_num.length > 10 || roll_num.length < 5) {
            if(isValid === true){
                this.setState({valid_roll_num: !isValid})
            }
            else if(isValid === null){
                this.setState({valid_roll_num: false})
            }
        }
        else if(isValid === false){
            this.setState({valid_roll_num: !isValid})
        }
        else if(isValid === null){
            this.setState({valid_roll_num: true})
        }
        this.student['roll_num'] = roll_num
    }

    departmentSelected = (event) => {
        if (event.target.value === null){
            this.setState({classes: undefined})
        }
        else{
            this.setState({classes: this.state.departments[event.target.value]})
        }
    }

    formSubmitted = () => {
        if(this.class_inp_ele.current.value === "null"){
            alert("Please select all values")
            return
        }
        let student_exists = false
        this.state.students.map(existing_student => {
            if(existing_student === this.student['roll_num'])
                student_exists = true
            return null
        })
        if(student_exists){
            alert("Student already signed in.")
        }
        else{
            this.student['class_name'] = this.class_inp_ele.current.value
            axios.post(`${url}/postStudent`,this.student).then(
                response => {window.location.href='/key/'+this.student['roll_num']}
            )
        }
    }

    render(){
        console.log('[Singup.js] rendered',null,!!null)
        const depts = Object.keys(this.state.departments)
        const classes = this.state.classes
        let class_options = null
        const dept_options = depts.map((dept,index) =>  <option key={index} value={dept}>{dept}</option>)
        if(classes !== undefined){
            class_options = classes.map((class_name,index) =>  <option key={index} value={class_name}>{class_name}</option>)
        }
        let invalidName = null
        if(this.state.valid_name !== null && !this.state.valid_name){
            invalidName = <img src={invalidField} alt="invalid" className="InvalidInput"/>
        }
        let invalidRollNum = null
        if(this.state.valid_roll_num !== null && !this.state.valid_roll_num){
            invalidRollNum = <img src={invalidField} alt="invalid" className="InvalidInput"/>
        }
        return (
            <div className="SignUp">
                <div className="SignCard">
                    <input type="text" onChange={this.validateName} placeholder="Name" className="Inp"/>
                    <img src={student_logo} alt="student" className="Student"/>
                    {invalidName}

                    <input type="number" onChange={this.validateRollNum} placeholder="Roll Number" className="Inp"/>
                    {invalidRollNum}
                    
                    <select onChange={this.departmentSelected}  className="InpDept">
                        <option value="null">- select department -</option>
                        {dept_options}
                    </select>

                    <select ref={this.class_inp_ele} className="InpClass">
                        <option value="null">- select class -</option>
                        {class_options}
                    </select>
                    <ButtonInput class_name="SignButton" value="SIGN" show={this.state.valid_name && this.state.valid_roll_num} clicked={this.formSubmitted}/>
                </div>
                <div style={{textAlign: "center", color:"cornflowerblue"}}>
                    <h4>Already signed in ?</h4>
                    <a href="https://www.the-qrcode-generator.com/scan" target="_blank" rel="noopener noreferrer" style={{color:"cornflowerblue",fontSize: "large"}}>
                        Get your attendance today
                    </a>
                </div>
            </div>
        )
    }
}

export default Signup