import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../config/Context";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Tracking() {

    const [cost, setCost] = useState("");
    const [duration, setDuration] = useState("");

    const { user } = useContext(Context);
    const [cookies, setCookie] = useCookies(['petx']);
    const navigate = useNavigate();

    async function handleSubmit() {
        if (!user) {
            toast.error("Please Login to Hire Caretaker")
            navigate('/auth/login');
        }
        else if (cost === "" || duration === "") {
            toast.error("Please Fill All the Fields");
        }
        else {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/room/create`,
                { cost: cost, duration: duration },
                {
                    headers: { Authorization: `Bearer ${cookies.petx}` }
                }).then((res) => {
                    toast.success("Loading Google Map...");
                    navigate("/tracking/map");
                }).catch((error) => {
                    toast.error(error.response.data.message);
                })
        }
    }

    return (
        <div className="container min-h-dvh pt-20">
            <div>
                <div className="container font-staatliches text-6xl text-center mt-6">Hire a Caretaker</div>
                <div className="container font-inter text-center flex items-center justify-center mt-2">
                    <div className="w-[50%]">
                        we know your pets are cherished members of your family. That's why we provide loving, personalized pet care services tailored to their needs.
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <div>
                        <div className="flex space-x-3">
                            <div className='text-sm w-[250px] mt-2'>
                                <p>Maximum Cost (per hr)<sup className="text-red-500">*</sup></p>
                                <input value={cost} onChange={(e) => setCost(e.target.value)} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" required type="text" placeholder='Maximum Cost (per hr)...' />
                            </div>
                            <div className='text-sm w-[250px] mt-2'>
                                <p>Duration to Hire (hr)<sup className="text-red-500">*</sup></p>
                                <input value={duration} onChange={(e) => setDuration(e.target.value)} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" required type="text" placeholder='Duration to Hire (hr)...' />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <span onClick={handleSubmit} className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches cursor-pointer">Find Caretaker</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tracking;