import React, {useState} from 'react';
import { Menu, X, ChevronUp, Bell } from 'lucide-react';
import { useNavigate, } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isMenu, setIsMenu] = useState(false);
    const [isprofile, setIsProfile] = useState(false);
    const handleShowMenu = ()=>{
        if(isMenu){
            setIsMenu(false);
        }else{
            setIsMenu(true);
        }
    }

    const handleisProfile = () =>{
        let arrow = document.getElementById('chevronarrow');
        if(!isMenu){
            if(isprofile){
                setIsProfile(false);
                arrow.style.transform = 'rotate(180deg)'
            }else{
                setIsProfile(true);
                arrow.style.transform = 'rotate(0deg)';
            }
        }
        
    }

    const logout = ()=>{
        localStorage.removeItem("advio_token");
        navigate('/');
    }

  return (
    <div className='landing-navbar'>
        <nav>
            <div className='px-2 md:px-10 py-4 w-full flex md:justify-between justify-stretch'>
                <div className="hambeerger flex items-center md:hidden">
                    <Menu onClick={handleShowMenu}/>
                </div>
                <div className="logo w-[5%] items-center flex md:w-[20%] md:mx-0 mx-2">
                    <img className=' md:w-[10%] hover:cursor-pointer' src="../images/advisorpedia_logo.png" alt="" />
                    <p className='font-semibold md:text-xl text-lg'>DVIOO</p>
                </div>
                <div className="navitems hidden md:flex flex-row w-1/2 md:justify-end justify-around items-center">
                    <ul className='flex flex-row justify-evenly w-1/2'>
                        <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1'>Home</li>
                        <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1'>Explore</li>
                        <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1'>Write</li>
                    </ul>
                    <span className='flex justify-center cursor-pointer'>
                        <Bell/>
                    </span>
                    <span className='profile w-[15%] flex justify-center items-center'>
                        <div className="profilepic border-gray-500 hover:border-2 hover:cursor-pointer w-[30%] rounded-full" onClick={handleisProfile}>
                            <img className='w-fit rounded-full' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                        </div>
                        < ChevronUp id='chevronarrow' className='size-4 mx-2 hover:cursor-pointer rotate-180' onClick={handleisProfile}/>
                    </span>
                </div>
            </div>
        </nav>
        {
            isprofile &&
            <div className="profileedit bg-white flex flex-col absolute right-7 top-14 border-2 border-gray-400 rounded-lg p-3">
                <ul>
                    <li className='font-font1 hover:cursor-pointer'>See Profile</li>
                    <li className='font-font1 hover:cursor-pointer' onClick={logout}>Log Out</li>
                </ul>
            </div>
        }
        <hr />
        {
            isMenu &&
            <div id='hamberger-menu' className='hamberger-menu flex justify-center flex-col fixed items-center text-2xl bg-white w-[75%] h-[100vh] top-0' style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px"}}>
                <div className="cross my-2 flex justify-between w-full py-3 px-4">
                    <img className='w-[10%]' src="../images/advisorpedia_logo.png" alt="" />
                    <X className='scale-125' onClick={handleShowMenu}/>
                </div>
                <div className="profilepic ml-10 my-4 flex flex-col justify-center md:border-gray-500 md:hover:border-2 hover:cursor-pointer w-full rounded-full" >
                    <img className='w-[10%] rounded-full' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                    <ul className='my-2'>
                        <li className='font-font1 my-1'>See Profile</li>
                        <li className='font-font1' onClick={logout}>Log Out</li>
                    </ul>
                    <hr />
                </div>
                <ul className='flex flex-col my-24 justify-end'>
                    <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1 my-6'>Feature</li>
                    <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1 my-6'>Pricing</li>
                    <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1 my-6'>Docs</li>
                </ul>
            </div>
        }
    </div>
  )
}

export default Navbar