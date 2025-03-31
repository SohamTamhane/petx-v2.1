import { useNavigate } from "react-router-dom";
import UserSidebar from "../../../components/UserSidebar";
import axios from "axios";
import { useCookies } from "react-cookie";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardName from "../../../components/DashboardName";

export default function Setting() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['petx']);
    const [token, setToken] = useState(cookies?.petx);

    async function handleBecomeSeller() {
        btnDivRef.current.disabled = true;
        btnTextRef.current.style.display = "none";
        spinnerRef.current.style.display = "block";

        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/becomeSeller`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then((res) => {
            // console.log(res.data.token);
            document.cookie = "petx=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setCookie('petx', res.data.token, { path: '/', maxAge: 30 * 30 * 24 * 7 });
            toast.success("You are now a Seller !!");
            navigate('/seller/dashboard');
            window.location.reload();
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally(() => {
            btnDivRef.current.disabled = false;
            btnTextRef.current.style.display = "block";
            spinnerRef.current.style.display = "none";
        })
    }

    async function handleBecomeCaretaker() {
        btnDivRef.current.disabled = true;
        btnTextRef.current.style.display = "none";
        spinnerRef.current.style.display = "block";

        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/becomeCaretaker`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then((res) => {
            // console.log(res.data.token);
            document.cookie = "petx=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setCookie('petx', res.data.token, { path: '/', maxAge: 30 * 30 * 24 * 7 });
            toast.success("You are now a Caretaker !!");
            navigate('/caretaker/dashboard');
            window.location.reload();
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally(() => {
            btnDivRef.current.disabled = false;
            btnTextRef.current.style.display = "block";
            spinnerRef.current.style.display = "none";
        })
    }

    return (
        <div className="container min-h-dvh pt-13">
            <div className="">

                <UserSidebar current='settings' />

                <div className="h-auto ml-[250px] px-10 py-7">
                    
                    <DashboardName/>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl mb-3">Settings</div>
                        <div>
                            <div className="font-inter font-semibold">If you want to setup online store and view analytics, switch to <span className="text-[#FB7E46]">Seller Account</span></div>
                            {/* <div onClick={() => navigate('/seller/dashboard')} className="mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">Switch to Seller Account</div> */}
                            <button ref={btnDivRef} onClick={handleBecomeSeller} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
                                <div ref={btnTextRef}>
                                    Switch to Seller Account
                                </div>
                                <div className="hidden" ref={spinnerRef}>
                                    <SpinnerBtn />
                                </div>
                            </button>

                            <div className="mt-8 font-inter font-semibold">If you want to become caretaker and view analytics, switch to <span className="text-[#FB7E46]">Caretaker Account</span></div>
                            <button ref={btnDivRef} onClick={handleBecomeCaretaker} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
                                <div ref={btnTextRef}>
                                    Switch to Caretaker Account
                                </div>
                                <div className="hidden" ref={spinnerRef}>
                                    <SpinnerBtn />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
