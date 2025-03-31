import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useContext, useEffect, useState } from "react";
import { FaShieldDog } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Context } from "../config/Context";

export default function Navbar() {

    const [menu, setMenu] = useState("hidden");
    const {user, setUser, token, setToken, cart} = useContext(Context);

    const handleToggle = () => {
        if(menu=="hidden"){
            setMenu("grid");
        }
        else{
            setMenu("hidden");
        }
    }

    return (
        <div className="select-none z-100 fixed container min-w-full px-4 py-3 font-inter text-sm bg-white">
            <div className="flex justify-between items-center">
                <div><Link to="/" className="flex items-center gap-1 font-staatliches text-xl font-semibold"><FaShieldDog /> Petx</Link></div>
                <div className="hidden sm:block">
                    <ul className="flex items-center space-x-5">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/marketplace'>Marketplace</Link></li>
                        <li><Link to='/healthcare'>Healthcare</Link></li>
                        <li><Link to='/tracking'>Tracking</Link></li>
                        <li><Link to='/adoption'>Adoption</Link></li>
                        {
                            user ? 
                                <div className="flex items-center justify-center space-x-5">
                                    {/* <li><Link to='/user/dashboard' className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches">Dashboard</Link></li> */}
                                    {
                                        user.type === "User" ?
                                            <li><Link to='/user/dashboard' className="flex items-center justify-center" ><img className="w-8 h-8 rounded-full" src={user.profileImg} alt="" /></Link></li>
                                        :
                                        <li><Link to='/seller/dashboard' className="flex items-center justify-center" ><img className="w-8 h-8 rounded-full" src={user.profileImg} alt="" /></Link></li>
                                    }
                                    <li><Link to='/cart' className="relative">
                                        <FaShoppingCart fontSize={20}/>
                                        <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white px-1.5 text-xs rounded-full">{cart?.length}</span>
                                    </Link></li>
                                </div>
                            :
                            <li><Link to='/auth/login' className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches">Login</Link></li>
                        }
                    </ul>
                </div>
                <div className="block sm:hidden">
                    <RxHamburgerMenu fontSize={25} onClick={handleToggle}/>
                </div>
            </div>

            <div>
                <ul className={`${menu} grid sm:hidden grid-cols-1 w-full text-center gap-5`}>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/marketplace'>Marketplace</Link></li>
                    <li><Link to='/healthcare'>Healthcare</Link></li>
                    <li><Link to='/tracking'>Tracking</Link></li>
                    <li><Link to='/adoption'>Adoption</Link></li>
                    <li><Link to='/login' className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches">Login</Link></li>
                </ul>
            </div>

        </div>
    )
}
