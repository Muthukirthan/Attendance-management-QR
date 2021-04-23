import './App.css';
import React from 'react'
import {BrowserRouter, Switch} from 'react-router-dom'
import {Route} from 'react-router-dom'
import Signup from '../../components/Signup'
import Registered from '../../components/Registered'
import FacultyDashboard from '../../components/FacultyDashboard'
import Attendance from '../../components/Attendance'
import NoMatch from '../../components/NoMatch'
import logo from '../../assets/qr.jpg'

const app = () => {
  console.log('[App] rendered')
  return (
    <BrowserRouter>
      <div className="Header">
        <img src={logo} alt="qr logo" className="QrLogo"/><br/>
        <label className="AppName">QR Attendance Management</label>
      </div>
      <Switch>
        <Route exact path='/' component={Signup} />
        <Route exact path={'/key/:roll_num(\\d+)?'} component={Registered} />
        <Route exact path='/facultyDashboard' component={FacultyDashboard} />
        <Route exact path='/attendance/:date/:key' component={Attendance} />
        <Route component={NoMatch} />
      </Switch>
    </BrowserRouter>
  )
}

export default app