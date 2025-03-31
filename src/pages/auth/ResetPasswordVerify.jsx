import { useRef, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import axios from "axios";
import toast from "react-hot-toast";
import SpinnerBtn from "../../components/SpinnerBtn";

export default function ResetPasswordVerify() {
    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const navigate = useNavigate();

    const params = useParams().id;
    const [queryParams, setQueryParams] = useSearchParams();
    const query = queryParams.get("q");
    
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword1, setShowPassword1] = useState(false)

   async function handleSubmit() {
        if(password==="" || confirmPass===""){
            toast.error("Please Fill All the Details");
        }
        else if(password!==confirmPass){
            toast.error("Password and Confirm Password must be Same");
        }
        else{
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/resetPassword`, {
                password: password,
                confirmPassword: confirmPass,
                id: params,
                query: query
            }).then((res)=>{
                // console.log(res.data.message);
                toast.success("Password Changed Successfully!!")
                navigate('/auth/login')
            }).catch((error)=>{
                toast.error(error.response.data.message);
            }).finally(()=>{
                btnDivRef.current.disabled = false;

                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";
            }) 
        }
    }

    return (
        <div className="container min-h-dvh pt-15 relative">
            <div className="container font-staatliches text-3xl text-center mt-10">Verify Email</div>
            <div className="font-inter container flex items-center justify-center mt-5">

                <div className="">
                    <div className='text-sm mt-3 w-[250px]'>
                        <p>New Password <sup className="text-red-500">*</sup></p>
                        <div className="relative w-full">
                            <input  autoFocus onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required type={showPassword ? "text" : "password"} name='email' placeholder='Enter your password...' />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-2">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                                ) : (
                                    <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className='text-sm mt-3 w-[250px]'>
                        <p> Confirm Password <sup className="text-red-500">*</sup></p>
                        <div className="relative w-full">
                            <input onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required type={showPassword1 ? "text" : "password"} name='email' placeholder='Confirm password...' />
                            <span
                                onClick={() => setShowPassword1((prev) => !prev)}
                                className="absolute right-2 top-2">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                                ) : (
                                    <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button ref={btnDivRef} onClick={handleSubmit} className="flex items-center justify-center space-x-2 cursor-pointer container bg-[#27221F] text-white text-center py-2 text-sm font-semibold rounded-lg mt-2">
                                <div ref={btnTextRef}>
                                    Update
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
