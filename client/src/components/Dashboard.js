import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Users, Hexagon, MessageCircle, Network, Bookmark } from 'lucide-react';
import Posts from './Posts';

function Dashboard() {
  const authToken = localStorage.getItem('advio_token');
  const navigate = useNavigate();

  const initiateCreatePost = ()=>{
    navigate('/createpost')
  }

  const checkProfileComplete = async()=>{
    const response = await fetch("http://localhost:8080/checkcompletion", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          advio_token: authToken,
        },
    });
    let json = await response.json();

    if(json.success){
        navigate('/dashboard');
    }else{
        navigate('/completeprofile');
    }
  }

  useEffect(()=>{
    if(!authToken){
      navigate('/');
    }else{
      checkProfileComplete();
    }
    
  }, []);
  return (
    <div>
      <Navbar/>
      <div className="dashmain flex justify-center my-10 fixed w-full">
        <div className="sidenav px-5 max-h-[300px]">
          <div className="item flex mt-10">
            <Hexagon/>
            <p className='font-font1 text-xl mx-2'>Advisors</p>
          </div>
          <div className="item flex mt-10">
            <Network/>
            <p className='font-font1 text-xl mx-2'>Community</p>
          </div>
          <div className="item flex mt-10">
            <MessageCircle/>
            <p className='font-font1 text-xl mx-2'>Message</p>
          </div>
          <div className="item flex mt-10">
            <Users/>
            <p className='font-font1 text-xl mx-2'>Groups</p>
          </div>
          <div className="item flex mt-10">
            <Bookmark/>
            <p className='font-font1 text-xl mx-2'>Saved</p>
          </div>
        </div>

        <div className="postsection w-[30%] max-h-[85vh] overflow-y-scroll px-5">
          <Posts/>
        </div>

        <div className="createpost flex flex-col px-5 ml-4 max-h-[200px] justify-center">
          <p className='bg-color1 font-font1 text-white px-10 py-2 rounded-3xl cursor-pointer' onClick={initiateCreatePost}>Create Post</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard