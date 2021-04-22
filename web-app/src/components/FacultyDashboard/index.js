import React, {Component} from 'react'
import ButtonInput from '../ButtonInput'
import axios from 'axios'
import url from '../Api/get_url'
import Generate from '../Generate'
import DownloadSheet from '../DownloadSheet'
import AddFieldtoDB from '../AddFieldtoDB'
import './dashboard.css'

class Dashboard extends Component{
    state = {
        option: {
            isGenerate: false,
            isDownload: false,
            isAddField: false
        },
        mapSubjClass: {},
        allData: {}
    }

    componentDidMount(){
        axios.get(`${url}/dashboardData`).then(
            response => {
                this.setState(
                    {
                        mapSubjClass: response.data.mapSubjClass,
                        allData: response.data.allData,
                        option: {
                            isGenerate: true,
                            isDownload: false,
                            isAddField: false
                        }
                    })
            })
    }

    optionClicked = (event) => {
        if(event.target.value === "Generate QR code"){
            this.setState({option: {isGenerate: true, isDownload: false, isAddField: false}})
        }
        else if(event.target.value === "Download attendance"){
            this.setState({option: {isGenerate: false, isDownload: true, isAddField: false}})
        }
        else{
            this.setState({option: {isGenerate: false, isDownload: false, isAddField: true}})
        }
    }

    render(){
        let dashboardTab = null
        if(this.state.option.isGenerate){
            dashboardTab = <Generate data={this.state.mapSubjClass} />
        }
        else if(this.state.option.isDownload){
            dashboardTab = <DownloadSheet data={this.state.mapSubjClass} />
        } 
        else if(this.state.option.isAddField){
            dashboardTab = <AddFieldtoDB data={this.state.allData} />
        }
        return(
            <div>
                <div className="OptionButtons">
                    <ButtonInput class_name={this.state.option.isGenerate ? "GenerateContainerSelected":"GenerateContainer"} value="Generate QR code" show={true} clicked={this.optionClicked}/>
                    <ButtonInput class_name={this.state.option.isDownload ? "DownloadContainerSelected":"DownloadContainer"} value="Download attendance" show={true} clicked={this.optionClicked}/>
                    <ButtonInput class_name={this.state.option.isAddField ? "AddFieldContainerSelected":"AddFieldContainer"} value="Add Sub/Class/Dept" show={true} clicked={this.optionClicked}/>
                </div>
                {dashboardTab}
            </div>
        )
    }
}

export default Dashboard