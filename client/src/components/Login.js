import React, {useEffect, useState} from 'react'
import Landingnavbar from './Landingnavbar'
import { useNavigate } from 'react-router-dom';

function Login() {
  const authToken = localStorage.getItem('advio_token');
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ emailorusername: "", password: "" });
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [usernameOrEmailErrorMsg, setUsernameOrEmailErrorMsg] = useState('');
  const [passVisibility, setPassVisibility] = useState(false);

  const handleLogin = async(e) => {
    e.preventDefault();

    if (credentials.password.length < 8) {
      return setPasswordErrorMsg('length of password should be more than 8');
    }

    if (credentials.emailorusername.split(" ").length > 1) {
      return setUsernameOrEmailErrorMsg('username or email should not contain space');
    }

    const response = await fetch(`http://localhost:8080/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail: credentials.emailorusername, password: credentials.password })
      });
      let json = await response.json();
      if(json.success){
        localStorage.setItem("advio_token", json.authToken);
        navigate('/dashboard');
        console.log("success");
    }else {
        const errMsg = json.error[0].msg;
        console.log(errMsg);
        if (errMsg === "Wrong email or username") {
          setUsernameOrEmailErrorMsg(errMsg.toLowerCase());
        }else if(errMsg === "Wrong password"){
            setPasswordErrorMsg(errMsg.toLowerCase());
        }else{
          navigate('/error');
        }
      }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

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
  return (
    <div>
        <Landingnavbar/>
        <div className='flex justify-center h-[85vh] items-center'>
          <div className="login-box flex flex-col font-font1 items-center w-[80%] rounded-md md:w-1/3" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px" }}>
            <h1 className='font-font1 font-bold my-3 text-2xl'>Log in</h1>
            <form action="" onSubmit={handleLogin} className='flex flex-col w-full p-6'>
              <div>
                <label htmlFor="email" className='my-5 font-font1'>Email or Username</label>
                <input type="text" id='email' className='border-2 w-full h-[40px] mt-2 py-2 px-2' name='emailorusername' value={credentials.emailorusername} onChange={onChange} required/>
                <span id='invemail' className='text-red-600 font-font1 text-sm'>{usernameOrEmailErrorMsg}</span>
              </div>
              <div className='my-5 font-font1'>
                <label htmlFor="password">Password</label>
                <input type={passVisibility?"text":"password"} id='password' className='border-2 w-full h-[40px] mt-2 py-2 px-2' name='password' value={credentials.password} onChange={onChange} required/>
                <span id='wrngpass' className='text-red-600 font-font1 text-sm'>{passwordErrorMsg}</span>
                <p className='my-1 text-gray-800 text-sm underline hover:cursor-pointer'>Forgot password?</p>
              </div>
              <div className='my-3 font-font1'>
                  <div className='flex items-center'>
                      <input type="checkbox" className='size-4' id='checkboxpass' name='checkboxpass' onChange={showPassword}/>
                      <label htmlFor="checkboxpass" className='mx-2 text-sm'>Show Password</label>
                  </div>
              </div>
              <button className='text-white bg-color1 font-font1 py-2 rounded-md' type='submit'>Log in</button>
              <div className='flex justify-center my-2'>
                <p className='my-1 text-gray-800 text-sm'>New to MedBridge?</p>
              </div>
              <button className=' flex justify-center border-2 rounded-md border-gray-500 text-gray-800 font-font1 py-2' onClick={() => navigate('/signup')}>Create a new account</button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Login