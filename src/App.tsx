import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

import NavbarComponent from './Components/Navbar/Navbar'
import Home from './Components/Pages/Home/Home'

import AuthenticationPage from './Components/Pages/Authentication/Authentication'
import RegisterPage from './Components/Pages/Register/Register'
import RequireNotAuth from './Components/Auth/RequireNotAuth'
import NotFound from './Components/Pages/NotFound/NotFound'

import axios from 'axios'
import { ROUTE_AUTHENTICATION, ROUTE_HOME, ROUTE_REGISTER } from './Constants/Routes.d'
axios.defaults.baseURL = 'http://localhost:8080/'

const App: React.FC = () => {
    return (
        <div className="App">
            <NavbarComponent />
            <Routes>
                <Route path="/" element={<Navigate to={ROUTE_HOME} replace={true} />}>
                </Route>

                <Route path={ROUTE_HOME} element={<Home />} />

                <Route element={<RequireNotAuth />}>
                    <Route path={ROUTE_AUTHENTICATION} element={<AuthenticationPage />} />
                    <Route path={ROUTE_REGISTER} element={<RegisterPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default App
