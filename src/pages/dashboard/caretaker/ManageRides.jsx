import { useContext, useEffect, useState } from "react";
import CaretakerSiderbar from "../../../components/CaretakerSidebar";
import DashboardName from "../../../components/DashboardName";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../config/Context";
import axios from "axios";
import toast from "react-hot-toast";



export default function ManageRides() {

    const [data, setData] = useState();

    const { user, setUser } = useContext(Context);
    const [cookies] = useCookies(['petx']);
    const [token, setToken] = useState();

    const navigate = useNavigate();

    async function handleAcceptRide(){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/room/${user?.room}/join`,
            { },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then((res) => {
            setUser({...user, roomDetails: res.data.data});
            toast.success("Ride Accepted Successfully...");
            navigate("/tracking/map");

        }).catch((error) => {
            console.log(error.response);
        })
    }

    async function fetchRoomDetails(token, roomId) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/room/fetch`,
            { roomId: roomId },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then((res) => {
            console.log(res.data);
            setData(res.data.data);
            // console.log(res.data.data);
        }).catch((error) => {
            console.log(error.response);
        })
    }

    useEffect(() => {
        if (token && user && user.room) {
            fetchRoomDetails(token, user.room);
        }
    }, [token])

    useEffect(() => {
        setToken(cookies?.petx);
    }, [cookies])

    return (
        <div className="container min-h-dvh pt-13">

            <div className="">
                <CaretakerSiderbar current='rides' />

                <div className="h-auto ml-[250px] px-10 py-7">
                    <DashboardName />

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-2xl">Manage Rides</div>
                        {
                            data ? 
                                <div className="w-full px-5 mt-3 border-2 py-2 rounded-lg">
                                    <div className="font-staatliches text-base">{data?.user.name}</div>
                                    <div className="font-inter text-xs">Cost: ₹{data?.room.cost}/hr</div>
                                    <div className="font-inter text-xs">Duration: {data?.room.duration}hr</div>
                                    <div className="font-inter text-xs font-bold">Total Cost: ₹{data?.room.cost * data?.room.duration}</div>
                                    <div className="flex space-x-2 mt-2">
                                        <div onClick={handleAcceptRide} className="cursor-pointer w-25 bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Accept Ride</div>
                                        <div className="cursor-pointer w-20 bg-[#e85451] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Cancel</div>
                                    </div>
                                </div>
                                : <div className="text-base mt-5 text-red-400 font-bold">
                                        No Rides Exists
                                    </div>
                            }   
                    </div>

                </div>

            </div>
        </div>
    )
}