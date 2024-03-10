import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share, MapPin } from 'lucide-react';

function Post(props) {
  const authToken = localStorage.getItem('advio_token');
  const [ownerDetails, setOwnerDetails] = useState({username: "", profilepicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAXS5rVzSxZ7G1NgCAJPQ7v1iBR1SfRJ_4zluxVO_DHA&s"});
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(props.postdetails.likedBy.length);

  const likePost = async()=>{

    if(isLiked){
      setIsLiked(false);
      let newLikecount = likeCount-1;
      setLikeCount(newLikecount);
    }else{
      setIsLiked(true);
      let newLikecount = likeCount+1;
      setLikeCount(newLikecount);
    }

    const postId = props.postdetails._id;
    console.log(postId)
    const response = await fetch("http://localhost:8080/likedislike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          advio_token: authToken,
        },
        body: JSON.stringify({postId: postId}),
    });
    let json = await response.json();
    if(json.success){
      setIsLiked(true);
      ifLiked();
    }else{
      setIsLiked(false);
      console.log("Post Not Found");
      ifLiked();
    }
  }

  const ifLiked = async()=>{
    const postId = props.postdetails._id;
    console.log(postId)
    const response = await fetch("http://localhost:8080/checkifliked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          advio_token: authToken,
        },
        body: JSON.stringify({postId: postId}),
    });
    let json = await response.json();
    if(json.success){
      setIsLiked(true);
      console.log("liked")
    }else{
      setIsLiked(false);
      console.log("Post Not liked");
    }
  }
  const getOwnerDetails = async()=>{
    console.log(props.postdetails.owner);
    const response = await fetch("http://localhost:8080/getuserdetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          advio_token: authToken,
          userid: props.postdetails.owner,
        },
    });
    let json = await response.json();
    if(json.success){
      setOwnerDetails({username: json.username, profilepicture: json.profilepicture});
    }else{
      console.log("Owner not found");
    }
  }
  useEffect(()=>{
    getOwnerDetails();
    ifLiked();
  }, [])

  return (
    <div className='px-4 py-4 flex flex-col border-gray-300 border-2 rounded-md my-4]'>
        <div className="userdetails flex justify-start items-center my-1">
          <img className='rounded-full mx-2 w-[10%]' src={ownerDetails.profilepicture} alt="" />
          <p className='font-font1'>{ownerDetails.username}</p>
        </div>
        <div className='w-full'>
          <img className='my-2' src={props.postdetails.postimage} alt="" />
        </div>
        <p className='font-font1 my-2'>{props.postdetails.caption}</p>
        <div className='flex justify-start items-center'>
          <MapPin className='size-4'/>
          <span className='font-font1 my-1 text-sm mx-2'>{props.postdetails.location}</span>
        </div>
        <div className="like-cmnt-share w-[60%] flex justify-between my-2">
            <span className='flex flex-col items-center'>
              <Heart className={`size-5 cursor-pointer ${isLiked?'text-red-600':'text-black'}`} onClick={likePost}/>
              <p className='font-font1 text-[13px] mt-1'>{likeCount}</p>
            </span>
            <MessageCircle className='size-5 cursor-pointer'/>
            <Bookmark className='size-5 cursor-pointer'/>
            <Share className='size-5 cursor-pointer'/>
        </div>
    </div>
  )
}

export default Post