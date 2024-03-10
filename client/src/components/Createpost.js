import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {X} from 'lucide-react';

function Createpost() {
    const authToken = localStorage.getItem('advio_token');
    const navigate = useNavigate();
    const [postPicURL, setPostPicURL] = useState("https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg");
    const [post, setPost] = useState({caption: "", location: "", postimage: ""});
    const [addPostError, setAddPostError] = useState("");
    const [isErr, setIsErr] = useState(false);

    const dismissErr = ()=>{
        if(isErr){
            setIsErr(false);
        }else{
            setIsErr(true);
        }
    }
    const onChangePicture = (e)=>{
        try {
            let url = URL.createObjectURL(e.target.files[0]);
            let file = e.target.files[0];
            console.log(file);

            var reader = new FileReader();
            reader.onloadend = function() {
                console.log('RESULT', reader.result);
                setPost({ ...post, postimage: reader.result });
            }
            reader.readAsDataURL(file);

            setPostPicURL(url);
        } catch (error) {
            console.log("upload an image");
        }
        
    
    }
    const Post = async()=>{
        if(post.caption === "" && post.postimage === ""){
            setIsErr(true);
            return setAddPostError("Please write post or upload image");
        }
        const response = await fetch("http://localhost:8080/createpost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                advio_token: authToken,
            },
            body: JSON.stringify({ caption: post.caption, location: post.location, postimage: post.postimage })
        });

        let json = await response.json();
        if(json.success){
            navigate('/dashboard');
            console.log("success");
        }else{
            navigate('/error');
        }
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
            navigate('/createpost');
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
    <div className='flex flex-col items-center w-full my-4'>
        {
            isErr &&
            <span className='text-red-600 font-font1 flex justify-between' id='errmsg' >
                <p>{addPostError}</p>
                <X onClick={dismissErr} className='cursor-pointer'/>
            </span>
        }
        <div className="whatsinyourmind w-[40%] rounded-md border-2">
            <textarea type="text" placeholder="What's in your mind?" className='w-full h-[200px] p-4 text-3xl font-font1' value={post.caption} onChange={e => setPost({...post, caption: e.target.value})}/>
        </div>
        <div className="w-[40%] rounded-md border-2 my-2">
            <input type="text" placeholder='location ?' className='w-full font-font1 h-[35px] p-2' value={post.location} onChange={e => setPost({...post, location: e.target.value})}/>
        </div>
        <div className='flex justify-center my-4'>
            <img src={postPicURL} alt=""  className='w-[60%]'/>
            <div className='mx-4 flex items-center'>
                <label htmlFor="profilepic" className=' font-font1 bg-color1 text-white py-2 px-5 rounded-md cursor-pointer'>Upload  Image</label>
                <input type="file" name="profilepic" id="profilepic" accept='image/jpg, image/jpeg, image/png' className='hidden' onChange={onChangePicture} required/>
            </div>
        </div> 
        <div>
            <button className='bg-color1 font-font1 text-lg px-10 py-2 rounded-3xl text-white' onClick={Post}>Post</button>
        </div>
    </div>
  )
}

export default Createpost