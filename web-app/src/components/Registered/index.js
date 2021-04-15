import React from 'react'
import ButtonInput from '../../components/ButtonInput'
import axios from 'axios'
import SuccessGif from '../../assets/success.gif'
import './register.css'
import url from '../Api/get_url'

const download = (roll_num) => {
    axios.get(`${url}/getKey/${roll_num}`).then(
        response => {
            const data = response['data']
            if(!data['error']){
                const content = response['data']['key']
                const contentType = "text/plain"
                const fileName = "secret_key"
                const a = document.createElement("a")
                const file = new Blob([content], { type: contentType })
                a.href = URL.createObjectURL(file)
                a.download = fileName
                a.click()
            }
            else{
                alert(data['result'])
            }
        })
}

const registered = (props) => {
    let roll_num = props.location.pathname.slice(5)
    console.log('[Register.js] rendered')
    return(
        <div className="RegisterMsg">
            <h1>Registered Successfully !</h1>
            <img src={SuccessGif} alt="success" className="SuccessGif"/>
            <h1>Get your one time key here</h1>
            <ButtonInput class_name="KeyButton" value="Download Key" clicked={() => download(roll_num)} show={true} />
        </div>
    )
}

export default registered