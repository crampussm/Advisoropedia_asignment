import React, { useEffect, useState } from 'react';
import Post from './Post';

function Posts() {
  const authToken = localStorage.getItem('advio_token');
  const [posts, setPosts] = useState([]);
  const [isPost, setIsPost] = useState(false);
  var key = 0;

  const getPosts = async()=>{
    const response = await fetch("http://localhost:8080/getallposts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          advio_token: authToken,
        },
    });
    let json = await response.json();

    if(json.success){
      setIsPost(true);
      setPosts(json.allPosts);
    }else{
        setIsPost(false);
        console.log("posts not done");
    }
  }

  useEffect(()=>{
    getPosts();
  }, [])
  return (
    <div className='overflow-y-scroll'>
      
      {
        !isPost &&
        <p className='font-font1'>no posts found</p>
      }
      {
        isPost &&
        posts.map((postdetails)=>{
          key += 1;
          return <Post key={key} postdetails={postdetails}/>
        })
      }
    </div>
  )
}

export default Posts