import React from 'react'
import './button.css'

const buttonInput = (props) => {
    return <input className={props.class_name} type="button" value={props.value} disabled={!props.show} onClick={props.clicked}/>
}

export default buttonInput