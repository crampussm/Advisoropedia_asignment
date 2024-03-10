import React, { useState, useEffect } from 'react';
import Landingnavbar from './Landingnavbar';
import { redirect, useNavigate } from 'react-router-dom';

function Completeprofile() {
    const authToken = localStorage.getItem('advio_token');
    const navigate = useNavigate();
    const [usernameErrorMsg, setUsernameErrorMsg] = useState();
    const [credentials, setCredentials] = useState({ username: "", profilepic: ""});
    const [profilepicURl, setProfilepicURL] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");

    const handleCompleteProfile = async(e)=>{
        e.preventDefault();

        if (credentials.username.split(" ").length > 1) {
            console.log('usernameerr');
            return setUsernameErrorMsg('username should not contain space');
        }

        const response = await fetch("http://localhost:8080/adddetails", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                advio_token: authToken,
            },
            body: JSON.stringify({ username: credentials.username, profilepicture: credentials.profilepic }),
        });
        let json = await response.json();
        
        console.log(json);
        if(json.success){
            navigate('/dashboard');
            console.log("success");
        }else{
            const errMsg = json.error[0].msg;
            console.log(errMsg);
            if(errMsg === "Username not available"){
                setUsernameErrorMsg(errMsg.toLowerCase());
            }else{
                navigate('/error');
            }
        }
    }
    const onChange = (e)=>{
        setCredentials({ ...credentials, username: e.target.value })
    }

    const onChangePicture = (e)=>{
        // let inputFile = document.getElementById("profilepic");
        let url = URL.createObjectURL(e.target.files[0]);
        let file = e.target.files[0];
        console.log(file);
        
        var reader = new FileReader();
        reader.onloadend = function() {
            console.log('RESULT', reader.result);
            setCredentials({ ...credentials, profilepic: reader.result });
        }
        reader.readAsDataURL(file);

        setProfilepicURL(url);
        
    }
    useEffect(()=>{
        if(authToken){
            navigate('/dashboard');
        }
    }, [])
    
  return (
    <div>
        <div className='landing-navbar'>
            <nav>
                <div className='px-2 md:px-10 py-4 w-full flex md:justify-between justify-around'>
                    <div className="logo w-[5%] items-center flex md:w-[20%] md:mx-0 mx-2">
                        <img className=' md:w-[10%] hover:cursor-pointer' src="../images/advisorpedia_logo.png" alt="" />
                        <p className='font-semibold md:text-xl text-lg'>DVIOO</p>
                    </div>
                </div>
            </nav>
            <hr />
        </div>
        <div className='flex justify-center h-[85vh] items-center'>
          <div className="login-box flex flex-col font-font1 items-center w-[80%] rounded-md md:w-1/3" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px" }}>
            <h1 className='font-font1 font-bold my-3 text-2xl'>Complete Profile</h1>
            <form action="" onSubmit={handleCompleteProfile} className='flex flex-col w-full p-6'>
                <div className='flex flex-col items-center'>
                    <img src={profilepicURl} alt=""  className='w-1/4 rounded-full'/>
                    <label htmlFor="profilepic" className='my-5 font-font1 bg-color1 text-white py-2 px-5 rounded-md cursor-pointer'>Choose a profile picture</label>
                    <input type="file" name="profilepic" id="profilepic" accept='image/jpg, image/jpeg, image/png' className='hidden' onChange={onChangePicture} required/>
                </div> 
                <div>
                    <label htmlFor="email" className='my-5 font-font1'>Username</label>
                    <input type="text" id='email' className='border-2 w-full h-[40px] mt-2 py-2 px-2' name='email' value={credentials.email} onChange={onChange} required/>
                    <span id='invemail' className='text-red-600 font-font1 text-sm'>{usernameErrorMsg}</span>
                </div>
                <button className='text-white bg-color1 font-font1 py-2 rounded-md my-4' type='submit'>Complete Signup</button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Completeprofile