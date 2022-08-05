import React, { useState } from 'react';
import './LogSign.css';
import BaseUrl from '../BaseUrl';
import AlertMessage from '../Components/AlertMessage';

function LogSign() {
    const [login_Values, set_login_Values] = useState({
        username: '',
        password: ''
    })
    const [register_Values, set_register_Values] = useState({
        username: '',
        password: '',
        re_password: ''
    })
    const [switcher, set_switcher] = useState(false);
    const [alert_message, set_alert_message] = useState({
        type: '',
        message: ''
    })
    const [loading, set_loading] = useState(false);

    function change_login(e){ set_login_Values({...login_Values, [e.target.name]: e.target.value}) }
    function change_register(e){ set_register_Values({...register_Values, [e.target.name]: e.target.value}) }

    function POST_login(e){
        e.preventDefault()

        set_loading(true)
        fetch(`${BaseUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(login_Values)
        })
        .then(res => res.json())
        .then(res => {
            if(res.error)
            {
                set_alert_message({ type: 'error', message: res.error })
                setTimeout(() => set_alert_message({ type: '', message: '' }) , 5000)
                set_loading(false)
            }
            if(res.message)
            {
                set_alert_message({ type: 'success', message: res.message })
                setTimeout(() => set_alert_message({ type: '', message: '' }) , 5000)
                set_loading(false)
                localStorage.setItem('token', res.token)
                window.location.reload(false);
                set_login_Values({
                    username: '',
                    password: ''
                })
            }
        })
    }

    function POST_register(e){
        e.preventDefault()

        set_loading(true)
        fetch(`${BaseUrl}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(register_Values)
        })
        .then(res => res.json())
        .then(res => {
            if(res.error)
            {
                set_alert_message({ type: 'error', message: res.error })
                setTimeout(() => set_alert_message({ type: '', message: '' }) , 5000)
                set_loading(false)
            }
            if(res.message)
            {
                set_alert_message({ type: 'success', message: res.message })
                setTimeout(() => set_alert_message({ type: '', message: '' }) , 5000)
                set_loading(false)
                set_login_Values({
                    username: register_Values.username,
                    password: register_Values.password
                })
                set_register_Values({
                    username: '',
                    password: '',
                    re_password: ''
                })
                set_switcher(false)
            }
        })
    }

    return (
        <>
        <AlertMessage content={alert_message.message} type={alert_message.type} />
        <div className='logsign'>
            <div className="header">
                RealChat
            </div>

            <div className="logsign_container">
                <form onSubmit={(e) => POST_login(e)} className={`login ${switcher && 'hide_logsign'}`}>
                    <input onChange={(e) => change_login(e)} type="text" name='username' placeholder='username...' value={login_Values.username} />
                    <input onChange={(e) => change_login(e)} type="password" name='password' placeholder='password...' value={login_Values.password} />
                    <button className={loading ? 'btn btn_loading' : 'btn'} type='submit'>{ loading ? 'Loding...' : 'Login'}</button>
                </form>

                <form onSubmit={(e) => POST_register(e)} className={`register ${!switcher && 'hide_logsign'}`}>
                    <input onChange={(e) => change_register(e)} type="text" name='username' placeholder='username...' value={register_Values.username} />
                    <input onChange={(e) => change_register(e)} type="password" name='password' placeholder='password...' value={register_Values.password} />
                    <input onChange={(e) => change_register(e)} type="password" name='re_password' placeholder='Confirm password...' value={register_Values.re_password} />
                    <button className={loading ? 'btn btn_loading' : 'btn'} type='submit'>{loading ? 'Registering...' : 'Register'}</button>
                </form>
            </div>
            
            <div onClick={() => set_switcher(!switcher)} className="switcher">{switcher ? "Already " : "don't "}have account?</div>

        </div>
        </>
    )
}

export default LogSign
