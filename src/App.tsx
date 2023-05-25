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
import { ROUTE_AUTHENTICATION, ROUTE_COURSES, ROUTE_HOME, ROUTE_REGISTER }
    from './Constants/Routes.d'
import Courses from './Components/Course/Courses'
import CoursePage from './Components/Course/CoursePage/CoursePage'
import RequireAuthAny from './Components/Auth/RequireAuthAny'
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

                <Route element={<RequireAuthAny />}>
                    <Route path={ROUTE_COURSES} element={<Courses />} />
                </Route>

                <Route element={<RequireAuthAny />}>
                    <Route path={ROUTE_COURSES + '/:courseId'} element={<CoursePage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default App
