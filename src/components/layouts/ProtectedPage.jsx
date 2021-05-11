import React, { useState, useEffect } from 'react'
import CUser from './../../utils/helpers/CUser';
import axios from 'axios'
import { Redirect } from 'react-router-dom';
import URL from './../../utils/helpers/URL';

export default function ProtectedPage({ children }) {
    const [authv, setAuthV] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        let unmount = false
        const ckLog = async () => {
            if (!unmount) {
                try {
                    const ck = await axios.get('ao/is-loggedin')
                    //give true or false
                    if (!ck.data) {
                        //so clear the localStorage
                        console.log("protected, 1,", "ck.data" + ck.data);
                        CUser.logOut()
                        setAuthV(false)
                    } else {
                        if (CUser.getCurrentuser() && CUser.getCurrentuser() !== undefined) {
                            setAuthV(true)
                        } else {
                            CUser.logOut()
                            console.log("protected, 2,", ck.data);
                            setAuthV(false)
                        }
                    }
                    setLoading(false)

                } catch (e) {
                    //so clear the localStorage
                    CUser.logOut()
                    console.log("protected, 3,", e.message);
                    setAuthV(false)
                    setLoading(false)
                }
            }
        }
        ckLog()
        return () => {
            unmount = true
        }
    }, [loading])


    if (!loading && loading === false) {
        if (authv === true) {
            return (
                <>
                    {children}
                </>
            )
        } else {
            { console.log("protected so redirect to login") }
            return <Redirect to={URL.SIGN_IN}></Redirect>
        }
    } else {
        return (<div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="loader"></div>
        </div>)
    }
}
