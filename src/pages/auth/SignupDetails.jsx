import { useContext, useRef, useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Context } from "../../config/Context";
import toast from "react-hot-toast";
import axios from "axios";
import SpinnerBtn from "../../components/SpinnerBtn";
import { useCookies } from 'react-cookie';

export default function SignupDetails() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();
    const nameRef = useRef();
    const usernameRef = useRef();
    const passRef = useRef();
    const confirmPassRef = useRef();
    
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['petx']);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword1, setShowPassword1] = useState(false)

    const { userInfo, setUserInfo } = useContext(Context);

    async function handleSubmit() {


        if (userInfo?.email == undefined) {
            navigate('/auth/signup');
        }
        else {
            if (name === "" || username === "" || password === "" || confirmPass === "") {
                toast.error("Fill All the Details")
            }
            else if (password !== confirmPass) {
                toast.error("Password must be same")
            }
            else {
                nameRef.current.disabled = true;
                usernameRef.current.disabled = true;
                passRef.current.disabled = true;
                confirmPassRef.current.disabled = true;
                btnDivRef.current.disabled = true;

                btnTextRef.current.style.display = "none";
                spinnerRef.current.style.display = "block";



                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
                    name: name,
                    email: userInfo.email,
                    username: username,
                    password: password,
                    confirmPassword: confirmPass,
                    type: 'User',
                    profileImg: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
                }).then((res) => {
                    toast.success("OTP sent Successfully");
                    setCookie('petx', res?.data?.token, { path: '/', maxAge: 30 * 30 * 24 * 7 });
                    navigate('/auth/signup/verify');
                }).catch((error) => {
                    // console.log(error);
                    toast.error(error?.response?.data?.message);
                }).finally(() => {
                    nameRef.current.disabled = false;
                    usernameRef.current.disabled = false;
                    passRef.current.disabled = false;
                    confirmPassRef.current.disabled = false;
                    btnDivRef.current.disabled = false;

                    btnTextRef.current.style.display = "block";
                    spinnerRef.current.style.display = "none";
                })

            }



        }
    }

    return (
        <div className="container min-h-dvh pt-15 relative">
            <div onClick={() => navigate('/auth/signup')} className="cursor-pointer absolute flex items-center font-inter font-semibold text-sm left-3">
                <IoIosArrowBack /> <span>Back</span>
            </div>
            <div className="container font-staatliches text-3xl text-center mt-10">Sign Up</div>
            <div className="font-inter container flex items-center justify-center mt-5">

                <div className="">

                    <div className='text-sm w-[250px] mt-2'>
                        <p>Name<sup className="text-red-500">*</sup></p>
                        <input ref={nameRef} autoFocus onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required type="text" name='email' placeholder='Enter your name...' />
                    </div>
                    <div className='text-sm w-[250px] mt-2'>
                        <p>Username<sup className="text-red-500">*</sup></p>
                        <input ref={usernameRef} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} required type="text" name='username' placeholder='Enter your username...' />
                    </div>
                    <div className='text-sm mt-3 w-[250px]'>
                        <p> Password <sup className="text-red-500">*</sup></p>
                        <div className="relative w-full">
                            <input ref={passRef} onKeyDown={(e) => {
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
                            <input ref={confirmPassRef} onKeyDown={(e) => {
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
                                Sign Up
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
