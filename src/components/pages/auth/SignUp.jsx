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

export default function SignUp() {
    const history = useHistory()
    //global state
    const { appDispatch, authDispatch } = useContext(DispatchContext)
    //local state
    const initvalue = {
        name: "",
        email: "",
        phone: "",
        password: "",
        c_password: "",
        photo_url: Define.NOT_SET
    }
    const [ao, setao] = useState(initvalue)

    //lifecycle method 

    //local method
    const onSubmit = async (e) => {
        e.preventDefault()
        const app = new AppAction(appDispatch)
        //ck password & confirm pass is same or not
        if (ao.password.length <= 6) {
            app.SET_RESPONSE(Response(false, "Password length should be more than 6 character.", "", Define.BT_DANGER))
            return
        }
        if (ao.password !== ao.c_password) {
            app.SET_RESPONSE(Response(false, "Password and Confirm Password doesn't match.", "", Define.BT_DANGER))
            return
        }
        //start loding..
        app.START_LOADING()
        //signup user
        try {
            const response = await new AuthAction(authDispatch).signup(ao)
            console.log(response)
            app.STOP_LOADING()
            setao(initvalue)
            history.push(URL.HOME)
        } catch (e) {
            app.SET_RESPONSE(Response(false, "SignUP failed.", e.message, Define.BT_DANGER))
            app.STOP_LOADING()
        }
    }
    const onChange = (e) => {
        setao({ ...ao, [e.target.name]: e.target.value })
    }


    //check alrady logged in or not
    if (CUser?.isLoggedIn()) {
        return <Redirect to={URL.HOME}></Redirect>
    }

    //return 
    return (
        <div className="auth">
            <div className="inner">

                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-center mb-2">
                        <img src={logo} width={50} alt="" />
                    </div>
                    <div className="d-flex justify-content-center">
                        <h3>Register as a ao</h3>
                    </div>
                </div>

                <form onSubmit={onSubmit}>

                    <Input name="name" title="ao Name" value={ao.name} onChange={onChange} />

                    <Input name="email" type="email" title="ao Email" value={ao.email} onChange={onChange} />

                    <Input name="phone" type="tel" title="ao Phone" value={ao.phone} onChange={onChange} />

                    <Input name="password" type="password" title="ao Password" value={ao.password} onChange={onChange} />

                    <Input name="c_password" type="password" title="ao Confirm Password" value={ao.c_password} onChange={onChange} />


                    <AlertLoading loadColor={Define.BT_INFO} />

                    <Button variant="primary" type="submit" className="btn btn-dark btn-lg btn-block " >Register</Button>

                    <p className="forgot-password text-right">
                        Already registered <Link to={URL.SIGN_IN}><a>log in?</a></Link>
                    </p>
                </form>
            </div>
        </div >
    )
}
