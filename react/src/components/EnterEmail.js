import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './EnterEmail.css'
import './Button.css'
import config from './config'

export default function EnterEmail(props) {
    const [email, setEmail] = useState(null)
    const [showOTPBox, setShowOTPBox] = useState(false)
    const [showPWDBox, setShowPWDBox] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [otp, setOtp] = useState(undefined)
    const [PWD, setPWD] = useState(undefined)
    const [PWDConfirm, setPWDConfirm] = useState(undefined)
    const emailInputRef = useRef()
    const otpInputRef = useRef()
    const PWDRef = useRef()
    const PWDConfirmRef = useRef()

    const requestMailAddress = (config.production ? config.server : config.local) + '/requestMail'
    const verifyOTPAddress = (config.production ? config.server : config.local) + '/verifyOTP'
    const loginAddress = (config.production ? config.server : config.local) + '/login'

    const handleRequest = (e) => {
        //e.preventDefault()
        // console.log(e.key)
        if(e.key === "Enter" || e.keyCode === 13) {
            handlServerRequest(e)
        }
    }

    const handlServerRequest = (e) => {
        //e.preventDefault(e)
        setDisabled(true)

        let data = {}
        data.to = email
        if (!showOTPBox && !showPWDBox) {
            axios.post(requestMailAddress, data, { withCredentials: true }).then(result => {
                setDisabled(false)
                if(result.data.registered) {
                    setShowPWDBox(true)
                    props.setRegistered(true)
                }
                else if (result.data.OTPsent) {
                    setShowOTPBox(true)
                } else {
                    //alert("message not sent try again")
                    //emailInputRef.current.focus()
                }
            })
        } else if(showOTPBox && !showPWDBox){
            data.email = email
            data.otp = otp
            axios.post(verifyOTPAddress, data, { withCredentials: true }).then(result => {
                setDisabled(false)
                if (result.data.verified) {
                    setShowPWDBox(true)
                } else {
                    //alert(result.data.msg)
                    //otpInputRef.current.focus()
                }
            })
        } else {
            if(props.registered) {
                data.email = email
                data.PWD = PWD
                axios.post(loginAddress, data, { withCredentials: true})
                    .then(result => {
                        if(result.data.logedIn)
                        {
                            props.setAccessJWTTokken(result.data.signedJWT)
                            props.setEmail(email)
                            props.setPWD('userPassword')
                        } else {
                            //alert("Either password or email is wrong")
                            setDisabled(false)
                            //PWDRef.current.focus()
                        }
                    }).catch(err => {
                        console.log(err)
                        //alert("something went wrong")
                        setDisabled(false)
                        //PWDRef.current.focus()
                    })
            }
            else if(PWD === PWDConfirm) {
                props.setEmail(email)
                props.setPWD(PWD)
            } else {
                setDisabled(false)
                //alert("password doesnot match")
                //PWDConfirmRef.current.focus()
            }
        }
    }

    useEffect(() => {
        if(showOTPBox) {
            otpInputRef.current.select()
            otpInputRef.current.focus()
        }
        else if(showPWDBox) {
            PWDRef.current.select()
            PWDRef.current.focus()
        }
        else {
            emailInputRef.current.select()
            emailInputRef.current.focus()
        }
    }, [disabled,showOTPBox, showPWDBox,])
     
    return (
        <div className="EnterEmail">
            <h2>Enter Your E-mail</h2>
            <p>WhatsApp will send an E-mail to verify your email. <span>What's my email?</span></p>
            <input 
                ref={emailInputRef} 
                type="email" 
                placeholder="email" 
                onChange={e => setEmail(e.target.value)} 
                disabled={showOTPBox || disabled || showPWDBox} 
                onKeyDown={handleRequest}
            />
            {showOTPBox ? 
                <input 
                    ref={otpInputRef} 
                    type="number" 
                    placeholder="enter OTP" 
                    onChange={e => setOtp(e.target.value)}  
                    disabled={disabled || showPWDBox}
                    onKeyDown={handleRequest}
                /> : null}

            {showPWDBox ? 
                <div className={"PWDContainer"}>
                    <br />
                    <p>Enter password</p>

                     <input 
                        ref={PWDRef} 
                        type="password" 
                        min="6" 
                        placeholder="password" 
                        onChange={e => setPWD(e.target.value)}  
                        disabled={disabled}
                        onKeyDown={handleRequest}
                    />

                     {props.registered ? null 
                        : <input 
                            ref={PWDConfirmRef} 
                            type="password" 
                            placeholder="confirm password" 
                            onChange={e => setPWDConfirm(e.target.value)}  
                            disabled={disabled}
                            onKeyDown={handleRequest}
                        />}
                </div> : null}
            <button onClick={handlServerRequest} disabled={disabled}>Next</button>
        </div>
    )
}
