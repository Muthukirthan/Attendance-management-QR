import React, {Component} from 'react'
import ButtonInput from '../ButtonInput'
import axios from 'axios'
import url from '../Api/get_url'
import Generate from '../Generate'
import DownloadSheet from '../DownloadSheet'
import './dashboard.css'

class Dashboard extends Component{
    state = {
        isGenerate: true,
        data: {}
    }

    componentDidMount(){
        axios.get(`${url}/getDashboardData`).then(
            response => {
                this.setState({data: response['data']})
            })
    }

    optionClicked = (event) => {
        // event.target.style.backgroundColor = "red"
        if(event.target.value === "Generate QR code"){
            this.setState({isGenerate: true})
        } else{
            this.setState({isGenerate: false})
        }
    }

    render(){
        let generate = null
        let download = null
        if(this.state.isGenerate){
            generate = <Generate data={this.state.data} />
        } else {
            download = <DownloadSheet data={this.state.data} />
        }
        return(
            <div>
                <div className="OptionButtons">
                    <ButtonInput class_name={this.state.isGenerate ? "GenerateContainerSelected":"GenerateContainer"} value="Generate QR code" show={true} clicked={this.optionClicked}/>
                    <ButtonInput class_name={this.state.isGenerate ? "DownloadContainer":"DownloadContainerSelected"} value="Download attendance" show={true} clicked={this.optionClicked}/>
                </div>
                {generate}
                {download}
            </div>
        )
    }
}

export default Dashboard