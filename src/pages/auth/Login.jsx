import { useRef, useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom";
import GoogleLogo from "../../assets/google_logo.png";
import toast from "react-hot-toast";
import axios from "axios";
import { useCookies } from "react-cookie";
import SpinnerBtn from "../../components/SpinnerBtn";

export default function Login() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)

    const [cookies, setCookie] = useCookies(['petx']);
    const navigate = useNavigate();

    async function loginFunc(){
        if(email ==="" || password === ""){
            toast.error("Please Fill All the Details")
        }
        else{
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {email :email, password :password}).then((res)=>{
                const { token, verified } = res.data;
                setCookie('petx', token, { path: '/', maxAge: 30 * 30 * 24 * 7 });
                // console.log(verified, typeof(verified));

                if (verified===true) {
                    toast.success("Login Successfully!!");
                    if(res.data.type === "User"){
                        navigate('/user/dashboard');
                    }
                    else{
                        navigate('/seller/dashboard');
                    }
                }
                else {
                    
                    // toast.error("Please verify your email to continue");

                    btnDivRef.current.disabled = true;
                    btnTextRef.current.style.display = "none";
                    spinnerRef.current.style.display = "block";

                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/resendOTP`,
                        { headers: { Authorization: `Bearer ${token}` } })
                        .then((res) => {    
                            toast.success("OTP Send Successfully");
                            navigate('/auth/signup/verify');
                        }).catch((error) => {
                            console.log(error)
                    }).finally(()=>{
                        btnDivRef.current.disabled = false;
        
                        btnTextRef.current.style.display = "block";
                        spinnerRef.current.style.display = "none";
                    }) 
                }

            }).catch((error) => {
                console.log(error)
                toast.error(error.response.data.message);
                btnDivRef.current.disabled = false;

                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";
            })
        }
    }


    function continueLoginwithgoogle() {
        toast.error("Network Error, Please check Internet!!");
    }


    return (
        <div className="container min-h-dvh pt-15">
            <div className="container font-staatliches text-3xl text-center mt-10">Log in</div>
            <div className="font-inter container flex items-center justify-center mt-5">
                
                <div className="">
                    
                    <div className="bg-white py-2 text-sm font-semibold rounded-lg border-1 border-black">
                        <Link onClick={continueLoginwithgoogle} className="container flex items-center justify-center">
                            <img src={GoogleLogo} className="h-4 w-4" alt="" /> <span className="ml-2">Continue with Google</span>
                        </Link>
                    </div>

                    <div className="mt-3 font-staatliche font-bold text-xs text-center">
                        OR
                    </div>

                    <div className='text-sm w-[250px] mt-2'>
                        <p>Email Address<sup className="text-red-500">*</sup></p>
                        <input autoFocus onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                loginFunc();
                            }
                        }} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required type="text" name='email' placeholder='Enter your email address...' />
                    </div>
                    <div className='text-sm mt-3 w-[250px]'>
                        <p> Password <sup className="text-red-500">*</sup></p>
                        <div className="relative w-full">
                            <input onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                loginFunc();
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
                    <div className="text-[#27221F] text-center text-xs mt-3 font-semibold">
                        <Link to='/auth/resetpass'>Forgot Password</Link>
                    </div>
                    <div>
                        <button ref={btnDivRef} onClick={loginFunc} className="flex items-center justify-center space-x-2 cursor-pointer container bg-[#27221F] text-white text-center py-2 text-sm font-semibold rounded-lg mt-2">
                            <div ref={btnTextRef}>
                                Sign In
                            </div>
                            <div className="hidden" ref={spinnerRef}>
                                <SpinnerBtn />
                            </div>
                        </button>
                        {/* <div onClick={loginFunc} className="cursor-pointer container bg-[#27221F] text-white text-center py-1 text-sm font-semibold rounded-lg mt-2">Sign In</div> */}
                    </div>
                    <div className="font-semibold text-center mt-3 text-xs">
                        Don't have an Account? <span className="text-[#FB7E46] ml-1 font-bold"><Link to='/auth/signup'>Sign Up</Link></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
