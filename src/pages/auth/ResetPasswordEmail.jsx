import { useContext, useRef, useState } from "react"
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../config/Context";
import SpinnerBtn from "../../components/SpinnerBtn";

export default function ResetPasswordEmail() {
    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const {userInfo, setUserInfo} = useContext(Context);

    async function handleSubmit() {
        if(email === ""){
            toast.error("Please Enter Valid Email Id");
        }
        else{
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/resetPasswordEmail`, {email: email}).then((res)=>{
                toast.success("Mail Sent Successfully")
                setUserInfo({email: email});
                navigate('/auth/resetpass/details')
            }).catch((error)=>{
                toast.error(error.response.data.message)
            }).finally(()=>{
                btnDivRef.current.disabled = false;

                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";
            }) 
        }
    }

    return (
        <div className="container min-h-dvh pt-15 relative">
            <div onClick={() => navigate('/auth/login')} className="cursor-pointer absolute flex items-center font-inter font-semibold text-sm left-3">
                <IoIosArrowBack /> <span>Back</span>
            </div>
            <div className="container font-staatliches text-3xl text-center mt-10">Reset Password</div>
            <div className="font-inter flex justify-center text-center mt-2 text-sm">
                <div className="w-[40%] text-[#595959]">
                    Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery
                </div>
            </div>
            <div className="font-inter container flex items-center justify-center mt-5">

                <div className="">
                    <div className='text-sm w-[250px] mt-2'>
                        <p>Enter Registered Email<sup className="text-red-500">*</sup></p>
                        <input  autoFocus onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required type="text" name='email' placeholder='Enter your registered email...' />
                    </div>
                    <div className="mt-4">
                        <button ref={btnDivRef} onClick={handleSubmit} className="flex items-center justify-center space-x-2 cursor-pointer container bg-[#27221F] text-white text-center py-2 text-sm font-semibold rounded-lg mt-2">
                                <div ref={btnTextRef}>
                                    Continue
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
