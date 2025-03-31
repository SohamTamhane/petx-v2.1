import { useRef, useState } from "react"
import { useCookies } from "react-cookie";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import SpinnerBtn from "../../components/SpinnerBtn";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupVerify() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [cookies, setCookie] = useCookies(['petx']);
    const token = cookies["petx"];

    async function handleSubmit() {
        if(otp==="" || otp.length<6){
            toast.error("Please Enter a Valid OTP");
        }
        else if(!token){
            navigate("/auth/signup");
        }
        else{
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, {
                otp: otp
            }, {headers: { Authorization: `Bearer ${token}` }}).then((res)=>{
                toast.success(res.data.message)
                navigate("/auth/login");
            }).catch((error)=>{
                toast.error(error.response.data.message);
            }).finally(()=>{
                btnDivRef.current.disabled = false;

                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";
            })
        }
    }

    async function resendFun(){
        if(token){
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/resendOTP`,{
                headers: { Authorization: `Bearer ${token}` }
            }).then((res)=>{
                toast.success("OTP Resend Successfully!!")
            })
            .catch((error)=>{
                toast.error(error.response.data.message)
            })
        }
    }

    return (
        <div className="container min-h-dvh pt-15 relative">
            <div onClick={() => navigate('/auth/signup')} className="cursor-pointer absolute flex items-center font-inter font-semibold text-sm left-3">
                <IoIosArrowBack /> <span>Back</span>
            </div>
            <div className="container font-staatliches text-3xl text-center mt-10">Verify Email</div>
            <div className="font-inter container flex items-center justify-center mt-5">

                <div className="">
                    <div className='text-sm w-[250px] mt-2'>
                        <p>Email OTP<sup className="text-red-500">*</sup></p>
                        <input autoFocus onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={otp} onChange={(e) => setOtp(e.target.value)} required type="text" name='email' placeholder='Enter your OTP...' />
                        <div onClick={resendFun} className="text-xs pt-1 ml-45 underline cursor-pointer">Resend OTP</div>
                    </div>
                    <div className="mt-3">
                        <button ref={btnDivRef} onClick={handleSubmit} className="flex items-center justify-center space-x-2 cursor-pointer container bg-[#27221F] text-white text-center py-2 text-sm font-semibold rounded-lg mt-2">
                            <div ref={btnTextRef}>
                                Verify
                            </div>
                            <div className="hidden" ref={spinnerRef}>
                                <SpinnerBtn />
                            </div>
                        </button>
                    </div>
                    <div className="font-semibold text-center mt-3 text-xs">
                        Already have an Account? <span className="text-[#FB7E46] ml-1 font-bold"><Link to='/auth/login'>Login</Link></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
