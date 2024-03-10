import React, {useState} from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Landingnavbar() {
    const navigate = useNavigate();
    const [isMenu, setIsMenu] = useState(false);
    const handleShowMenu = ()=>{
        if(isMenu){
            setIsMenu(false);
        }else{
            setIsMenu(true);
        }
    }
  return (
    <div className='landing-navbar'>
        <nav>
            <div className='px-2 md:px-10 py-4 w-full flex md:justify-between justify-around'>
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
                    <div className='flex flex-row justify-evenly md:justify-evenly md:w-1/4 w-full'>
                        <button className='w-[5rem] h-[2.5rem] text-black bg-color2 rounded-md font-semibold' onClick={()=>{navigate('/signup')}}>Sign up</button>
                        <button className='w-[5rem] h-[2.5rem] text-white rounded-md bg-color1 font-semibold' onClick={()=>navigate('/login')}>Log in</button>
                    </div>
                </div>
                <div className="sign-log flex md:hidden w-full justify-end">
                    <button className='font-font1 bg-color1 px-3 py-2 rounded-md text-white'>Log in</button>
                    <button className='font-font1 bg-color2 px-3 py-2 rounded-md ml-2'>Sign up</button>
                </div>
            </div>
        </nav>
        <hr />
        {
            isMenu &&
            <div id='hamberger-menu' className='hamberger-menu flex justify-center flex-col fixed items-center text-2xl bg-white w-[75%] h-[100vh] top-0' style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px"}}>
                <div className="cross my-5 flex justify-between w-full py-3 px-4">
                    <img className='w-[10%]' src="../images/advisorpedia_logo.png" alt="" />
                    <X className='scale-125' onClick={handleShowMenu}/>
                </div>
                <ul className='flex flex-col my-40 justify-end'>
                    <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1 my-6'>Feature</li>
                    <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1 my-6'>Pricing</li>
                    <li className='list-none hover:cursor-pointer hover:text-cshgreen font-font1 my-6'>Docs</li>
                </ul>
            </div>
        }
    </div>
  )
}

export default Landingnavbar