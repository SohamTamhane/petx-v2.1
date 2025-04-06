import { useContext, useEffect, useState } from "react";
import CaretakerSiderbar from "../../../components/CaretakerSidebar";
import DashboardName from "../../../components/DashboardName";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../config/Context";
import axios from "axios";
import toast from "react-hot-toast";



export default function CaretakerDashborad(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("12345678910");
    const [cost, setCost] = useState("");

    const { user, setUser } = useContext(Context);
    const [cookies] = useCookies(['petx']);
    const [token, setToken] = useState();

    const navigate = useNavigate();

    async function fetchUserDetails(token) {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/details`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then((res) => {
            setUser(res.data.user);
            setEmail(res.data.user?.email);
            setUsername(res.data.user?.username);
            setName(res.data.user?.name);
        }).catch((error) => {
            console.log(error.response);
        })
    }

    useEffect(() => {
        if (token) {
            fetchUserDetails(token);
        }
    }, [token])

    useEffect(() => {
        setToken(cookies?.petx);
    }, [cookies])


    async function updateDetails() {
        if(cost===""){
            toast.error("Please Enter the Cost");
        }
        else{
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/updateDetails`, 
                {
                    cost: cost
                },
                {
                    headers: { Authorization: `Bearer ${token}`},
                }, 
            ).then((res) => {
                toast.success("User Details Updated Successfully!!");
            }).catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            })
        }
    }

    return(
        <div className="container min-h-dvh pt-13">

            <div className="">
                <CaretakerSiderbar current='profile'/>

                <div className="h-auto ml-[250px] px-10 py-7">
                    <DashboardName/>

                    
                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl">Profile</div>
                        <div>
                            <div className="flex space-x-3">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Name<sup className="text-red-500">*</sup></p>
                                    <input disabled className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={name} required type="text" name='email' placeholder='Enter your name ...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Email Address<sup className="text-red-500">*</sup></p>
                                    <input disabled className="bg-gray-200 text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={email} required type="text" name='email' placeholder='Enter your email address...' />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-1">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Username<sup className="text-red-500">*</sup></p>
                                    <input disabled className="bg-gray-200 text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={username} required type="text" name='email' placeholder='Enter your name ...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Password<sup className="text-red-500">*</sup></p>
                                    <input disabled className="bg-gray-200 text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={password} required type="password" name='email' placeholder='Enter your email address...' />
                                </div>

                            </div>

                            <div className="flex space-x-3">
                                <div className='text-sm w-[250px] mt-3'>
                                    <p>Cost of Ride (in per hours) <sup className="text-red-500">*</sup> </p>
                                    <input value={cost} onChange={(e)=>setCost(e.target.value)} type="number" className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" placeholder="Enter cost of rides..."/>
                                </div>
                            </div>



                            <div className="flex space-x-5 mt-4">
                                <div onClick={() => navigate('/auth/resetpass')} className="select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">Change Password</div>
                                <div onClick={updateDetails}  className="select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">Update Profile</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}