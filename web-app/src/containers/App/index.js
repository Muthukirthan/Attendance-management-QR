import './App.css';
import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Route} from 'react-router-dom'
import Signup from '../../components/Signup'
import Registered from '../../components/Registered'
import Generate from '../../components/Generate'
import Attendance from '../../components/Attendance'
import logo from '../../assets/qr.jpg'
const app = () => {
  console.log('[App] rendered')
  return (
    <BrowserRouter>
      <div className="Header">
        <img src={logo} alt="qr logo" className="QrLogo"/><br/>
        <label className="AppName">QR Attendance Management</label>
      </div>
      <Route exact path='/' component={Signup} />
      <Route exact path={'/key/:roll_num(\\d+)?'} component={Registered} />
      <Route exact path='/generate' component={Generate} />
      <Route exact path='/attendance/:date/:key' component={Attendance} />
    </BrowserRouter>
  )
}

export default app