import React, { useEffect, useState } from 'react'
import Landingnavbar from './Landingnavbar';
import Footer from './Footer';
import { GetContext } from '../context/AdviooProvider';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const authToken = localStorage.getItem('advio_token');
    const navigate = useNavigate();
    const {setGetStartedEmail} = GetContext();
    const [email, setEmail] = useState("");
    const getStarted = (e)=>{
        e.preventDefault();
        setGetStartedEmail(email);
        navigate("/signup");
    }
    const onChange = (e)=>{
        setEmail(e.target.value);
    }

    useEffect(()=>{
        if(authToken){
            navigate('/dashboard');
        }
    }, [])
  return (
    <div className='landingpage flex flex-col justify-center items-center'>
        <Landingnavbar/>
        <div className="container w-[90%] flex flex-col items-center justify-center">
            <div className="welcome-box w-[80%] flex justify-center items-center mt-10 ">
                <div className='w-[70%]'>
                    <h1 className='text-gray-800 text-6xl font-bold font-font1 my-4'>Welcome to Advioo</h1>
                    <p className='text-gray-800 text-lg font-bold font-font1'>The first social platform designed for professional advisors. Join the network of top advisors, share your insights, and connect with professionals around the world</p>
                    <div className="searchbar flex justify-start items-center mt-5">
                        <input placeholder='Enter your email' type="text" className=' rounded-md w-[65%] h-[45px] font-font1 pl-2 pr-28 border-2' value={email}  onChange={onChange}/>    
                        <button className='relative right-[6.8rem] px-3 h-[35px] bg-color1 text-white font-font1 rounded-md w-fit' onClick={getStarted}>Get Started</button>
                    </div>
                </div>
                <div className='w-[80%]'>
                    <img src="../images/vectorimg_1.png" alt="" />
                </div>
            </div>
            <div className="second flex mt-20 items-center justify-center">
                <img src="../images/vectorimg_2.png" alt="" />
                <div className="info font-font1 text-gray-800 text-lg w-1/3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere dolores fuga distinctio ad excepturi. Veritatis unde autem reiciendis optio magni dignissimos sapiente dolore praesentium molestias fuga, sunt eaque maxime eveniet ipsum debitis, animi, voluptas iusto consequatur quibusdam reprehenderit accusantium quasi nobis expedita vitae! Esse, repudiandae.
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Landing