import React from 'react'
import './App.css'

import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

import { AuthenticationPage } from './Components/Authentication/Authentication'
import { RegisterPage } from './Components/Register/Register'
import { RequireNotAuth } from './Components/Auth/RequireNotAuth'
import Home from './Components/Home/Home'

import axios from 'axios'
import { ROUTE_AUTHENTICATION, ROUTE_HOME, ROUTE_REGISTER } from './Constants/Routes.d'
axios.defaults.baseURL = 'http://localhost:8080/'

const App: React.FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to={ROUTE_AUTHENTICATION} replace={true} />}>
                </Route>

                {/* TO DO Home */}
                <Route path={ROUTE_HOME} element={<Home />} />

                <Route element={<RequireNotAuth />}>
                    <Route path={ROUTE_AUTHENTICATION} element={<AuthenticationPage />} />
                    <Route path={ROUTE_REGISTER} element={<RegisterPage />} />
                </Route>

                {/* TO DO NotFound */}
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </div>
    )
}

export default App
