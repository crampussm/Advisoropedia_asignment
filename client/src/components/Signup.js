import React, { useState, useEffect, useCallback } from 'react';
import Landingnavbar from './Landingnavbar';
import { useNavigate } from 'react-router-dom';
import { GetContext } from '../context/AdviooProvider';
import emailjs from '@emailjs/browser';

function Signup() {
    const authToken = localStorage.getItem('advio_token');
    const {getStartedEmail} = GetContext();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ firstname: "", lastname: "", email: getStartedEmail, password: "", cnfpassword: "", otp: "" });
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    const [buttonState, setButtonState] = useState(false);
    const [otp, setOtp] = useState("1000");
    const [isFirstStepDone, setisFirstStepDoneDone] = useState(false);
    const [otpErrorMsg, setOtpErrorMsg] = useState("");
    const [wrongCnfPass, setWrongCnfPass] = useState("");
    const [passVisibility, setPassVisibility] = useState(false);

    const handleEmailVerification = (e)=>{
        e.preventDefault();
        let code = Math.floor(Math.random() * (9999 - 1000) + 1000).toString()
        setOtp(code)
        setisFirstStepDoneDone(true);

        console.log(otp);
        const serviceId = 'service_i5t7pxi';
        const templateId =  'template_t4iytnj';
        const publicKey = 'uIduUARMdykbRj14u';

        const templateParams = {
            from_name: "Advioo",
            to_name: credentials.firstname,
            to_email: credentials.email,
            otp: code,
        }

        emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
            console.log('SUCCESS!', response);
            },
            (error) => {
                console.log(error);
                console.log('FAILED...', error.text);
            },
        );
    }
    const handleSignup = async(e) => {
        e.preventDefault();
        
        console.log(otp);
        if(credentials.otp !== otp){
            console.log("Wrong OTP");
            return setOtpErrorMsg('Wrong OTP');
        }

        if (credentials.password.length <= 8) {
            console.log('passerr');
            return setPasswordErrorMsg('length of password should be more than 8');
        }

        const response = await fetch(`http://localhost:8080/signup`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, firstname: credentials.firstname, lastname: credentials.lastname, password: credentials.password })
        });
        let json = await response.json();
        if(json.success){
            localStorage.setItem("advio_token", json.authToken);
            navigate('/completeprofile');
            console.log("success");
        }else {
            const errMsg = json.errors[0].msg;
            console.log(errMsg);
            if (errMsg === "Email already exists") {
              setEmailErrorMsg(errMsg.toLowerCase());
            }else if(errMsg === "Enter a valid email"){
                setEmailErrorMsg(errMsg.toLowerCase());
            }else{
              navigate('/error');
            }
          }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const matchPass = useCallback(() => {
        const signupButton = document.getElementById('signupbutton');
        if (credentials.password !== credentials.cnfpassword) {
            setWrongCnfPass("password and confirm password must be same");
            if (credentials.password === "") {
                signupButton.disabled = true;
                setButtonState(false);
            }
        } else {
            setWrongCnfPass("");
            if (credentials.password !== "") {
                signupButton.disabled = false;
                setButtonState(true);
            }
        }
    }, [credentials, onChange])


    const showPassword = ()=>{
        if(passVisibility){
            setPassVisibility(false);
        }else{
            setPassVisibility(true);
        }
    }

    useEffect(()=>{
        if(authToken){
            navigate('/dashboard');
        }
    }, [])

    useEffect(() => {
        if(!isFirstStepDone){
            matchPass();
        }
    },[matchPass])
  return (
    <div>
        <Landingnavbar/>
        {
            !isFirstStepDone &&
            <div className='flex justify-center mt-10'>
                <div className="login-box flex flex-col font-font1 items-center w-[80%] rounded-md md:w-1/3" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px" }}>
                    <h1 className='font-font1 font-bold my-3 text-2xl'>Sign up</h1>
                    <form action="" onSubmit={handleEmailVerification} className='flex flex-col w-full p-6'>
                        <div className='my-3 font-font1'>
                            <label htmlFor="firstname" className='my-5 font-font1'>First name</label>
                            <input type="text" id='firstname' className='border-2 bg-cshoffwhite w-full h-[40px] mt-2 py-2 px-2' name='firstname' value={credentials.firstname} onChange={onChange} required />
                        </div>
                        <div className='my-3 font-font1'>
                            <label htmlFor="lastname" className='my-5 font-font1'>Last name</label>
                            <input type="text" id='lastname' className='border-2 bg-cshoffwhite w-full h-[40px] mt-2 py-2 px-2' name='lastname' value={credentials.lastname} onChange={onChange} required />
                        </div>
                        <div className='my-3 font-font1'>
                            <label htmlFor="email" className='my-5 font-font1'>Email</label>
                            <input type="email" id='email' className='border-2 bg-cshoffwhite w-full h-[40px] mt-2 py-2 px-2' name='email' value={credentials.email} onChange={onChange} required />
                            <span id='invemailorusername' className='text-red-600 font-font1 text-sm'>{emailErrorMsg}</span>
                        </div>
                        <div className='my-3 font-font1'>
                            <label htmlFor="password">Password</label>
                            <input type={passVisibility?"text":"password"} id='password' className='border-2 bg-cshoffwhite w-full h-[40px] mt-2 py-2 px-2' name='password' value={credentials.password} onChange={onChange} required />
                            <span id='wrngpass' className='text-red-600 font-font1 text-sm'>{passwordErrorMsg}</span>
                        </div>
                        <div className='my-3 font-font1'>
                            <div className='flex items-center'>
                                <input type="checkbox" className='size-4' id='checkboxpass' name='checkboxpass' onChange={showPassword}/>
                                <label htmlFor="checkboxpass" className='mx-2 text-sm'>Show Password</label>
                            </div>
                        </div>
                        <div className='my-3 font-font1'>
                            <label htmlFor="cnfpassword">Confirm password</label>
                            <input type={passVisibility?"text":"password"} id='cnfpassword' className='border-2 bg-cshoffwhite w-full h-[40px] mt-2 py-2 px-2' name='cnfpassword' value={credentials.cnfpassword} onChange={onChange} required />
                            <span id='wrngcnfpass' className='text-red-600 font-font1 text-sm'>{wrongCnfPass}</span>
                        </div>
                        <div className='my-3 font-font1'>
                            <div className='flex items-center'>
                                <input type="checkbox" className='size-5' id='checkbox' name='checkbox' required />
                                <label htmlFor="checkbox" className='mx-2'>agree to our <a className='underline text-color1' href="https://docs.google.com/document/d/1LKKMv498zhxKF61r4BGFPRhfL1AWNjYNyUrMD8Pf1OQ/edit?usp=sharing" rel="noreferrer" target='_blank'>Terms&Conditions</a></label>
                            </div>
                        </div>
                        <button id='signupbutton' className={`mt-5 ${buttonState === false ? "bg-color3 cursor-wait" : "bg-color1 cursor-pointer"} text-white py-2`} type='submit' disabled>Sign up</button>
                        <div className='flex justify-center my-2'>
                            <p className='my-1 text-gray-800 text-sm'>Already have an account MedBridge?</p>
                        </div>
                        <button className='bg-cshoffwhite text-black font-font1 border-2 border-black py-2' onClick={() => navigate('/login')}>Login to an existing account</button>
                    </form>
                </div>
            </div>
        }
        {
            isFirstStepDone &&
            <div className='flex justify-center h-[85vh] items-center'>
                <div className="login-box flex flex-col font-font1 items-center w-[80%] rounded-md md:w-1/3" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px" }}>
                    <h1 className='font-font1 font-bold my-3 text-2xl'>Complete Profile</h1>
                    <form action="" onSubmit={handleSignup} className='flex flex-col w-full p-6'>
                        <div>
                            <label htmlFor="otp" className='my-5 font-font1'>Enter the OTP sent to your email</label>
                            <input type="text" id='otp' className='border-2 w-full h-[40px] mt-2 py-2 px-2' name='otp' value={credentials.otp} onChange={onChange} required/>
                            <span id='invemail' className='text-red-600 font-font1 text-sm'>{otpErrorMsg}</span>
                        </div>
                        <button className='text-white bg-color1 font-font1 py-2 rounded-md my-4' type='submit'>Verify</button>
                        <div className='flex justify-center'>
                            <a href="/#" className='text-color1 font-font1 underline' onClick={handleEmailVerification}>resend otp</a>
                        </div>
                    </form>
                </div>
            </div>
        }
    </div>
  )
}

export default Signup