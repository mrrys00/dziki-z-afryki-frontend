import React from 'react'
import logo from './logo.svg'
import './App.css'

import {
    Routes,
    Route
} from 'react-router-dom'

import { AuthenticationPage } from './Components/Authentication/Authentication'
import { RegisterPage } from './Components/Register/Register'
import { RequireNotAuth } from './Components/Auth/RequireNotAuth'
import Home from './Components/Home/Home'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080/'

const App: React.FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route element={<RequireNotAuth />}>
                    <Route path="/authentication" element={<AuthenticationPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                {/* TO DO Home */}
                <Route path="/home" element={<Home />} />

                {/* TO DO NotFound */}
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </div>
    )
}

export default App
