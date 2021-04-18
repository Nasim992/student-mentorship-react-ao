import React, { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, Redirect, useHistory } from 'react-router-dom'
import '../../../assets/css/auth.css'
import logo from '../../../assets/img/logo.webp'
import URL from '../../../utils/helpers/URL'
import Input from '../../layouts/form/Input'
import AppAction from './../../../utils/context/actions/AppAction'
import AuthAction from './../../../utils/context/actions/AuthAction'
import { DispatchContext } from './../../../utils/context/MainContext'
import CUser from './../../../utils/helpers/CUser'
import Define from './../../../utils/helpers/Define'
import Response from './../../../utils/helpers/Response'
import AlertLoading from './../../layouts/AlertLoading'

export default function SignIn() {
    const history = useHistory()
    //global state
    const { appDispatch, authDispatch } = useContext(DispatchContext)
    //local state
    const initvalue = {
        email: "",
        password: ""
    }
    const [ao, setAo] = useState(initvalue)

    //local method
    const onSubmit = async (e) => {
        e.preventDefault()
        const app = new AppAction(appDispatch)
        //ck password & confirm pass is same or not
        if (ao.password.length <= 6) {
            app.SET_RESPONSE(Response(false, "Password length should be more than 6 character.", "", Define.BT_DANGER))
            return
        }
        //start loding..
        app.START_LOADING()
        //signup user
        try {
            const response = await new AuthAction(authDispatch).login(ao.email, ao.password)
            console.log(response)
            app.STOP_LOADING()
            //setAo(initvalue)
            history.push(URL.HOME)
        } catch (e) {
            app.SET_RESPONSE(Response(false, "Sign In failed.", e.message, Define.BT_DANGER))
            app.STOP_LOADING()
        }
    }
    const onChange = (e) => {
        setAo({ ...ao, [e.target.name]: e.target.value })
    }

    // check alrady logged in or not
    // console.log(CUser.isLoggedIn())
    if (CUser.isLoggedIn()) {
        return <Redirect to={URL.HOME}></Redirect>
    }

    return (
        <>
            <div className="auth">
                <div className="inner">
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-center mb-2">
                            <img src={logo} width={50} alt="" />
                        </div>
                        <div className="d-flex justify-content-center">
                            <h3>Sign In as a AO</h3>
                        </div>
                    </div>

                    <form onSubmit={onSubmit}>

                        <Input name="email" type="email" title="AO Email" value={ao.email} onChange={onChange} />

                        <Input name="password" type="password" title="AO Password" value={ao.password} onChange={onChange} />

                        <AlertLoading loadColor={Define.BT_INFO} />

                        <Button variant="primary" type="submit" className="btn btn-dark btn-lg btn-block " >Sign In</Button>

                        <p className="forgot-password text-right">
                            Not Yet registered, <Link to={URL.SIGN_UP}>Register Now</Link>
                        </p>
                    </form>
                </div>
            </div >
        </>
    )
}
