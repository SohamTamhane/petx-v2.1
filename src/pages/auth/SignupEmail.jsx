import { useContext, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import GoogleLogo from "../../assets/google_logo.png";
import { Context } from "../../config/Context";
import toast from "react-hot-toast";
import axios from "axios";
import SpinnerBtn from "../../components/SpinnerBtn";
import { useCookies } from "react-cookie";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { auth } from "../../config/firebase";

export default function SignupEmail() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['petx']);
    const { userInfo, setUserInfo } = useContext(Context);

    const [email, setEmail] = useState("");

    function validEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    async function handleSubmit() {
        if (email === "" || !validEmail(email)) {
            toast.error("Invalid Email Address");
        }
        else {
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";
            
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/userExist`, { email: email }).then((res) => {

                if (res.data.flag) {
                    toast.success("Verify Email");
                    setCookie('petx', res?.data?.token, { path: '/', maxAge: 30 * 30 * 24 * 7 });
                    navigate('/auth/signup/verify')
                }
                else {
                    setUserInfo({ ...userInfo, email: email })
                    navigate('/auth/signup/details')
                }
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
            }).finally(()=>{
                btnDivRef.current.disabled = false;

                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";
            })
        }
    }


    const handleGoogleRegister = async () => {
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
        //   await axios.post(`${import.meta.env.VITE_API_BASE_URL}auth/registerGoogle`, {name: user.displayName, email: user.email, uid: user.uid, type: "User", profileImg: user.photoURL}).then((res)=>{
        //     setCookie('petx', res.data.token, { path: '/' , maxAge: 30*30*24*7});
        //     toast.success("OTP Send Successfully to Resigter Email")
        //     navigate('/verify');
        //   }).catch((error)=>{
        //     toast.error(error.response.data.message);
        //   })
            toast.error("Network Error, Please check Internet!!");
        } catch (error) {
            console.log(error);
            toast.error("Error During Login");
        }
    };

    return (
        <div className="container min-h-dvh pt-15">
            <div className="container font-staatliches text-3xl text-center mt-10">Sign Up</div>
            <div className="font-inter container flex items-center justify-center mt-5">

                <div className="">

                    <div className="bg-white py-2 text-sm font-semibold rounded-lg border-1 border-black">
                        <button onClick={handleGoogleRegister} className="container flex items-center justify-center cursor-pointer">
                            <img src={GoogleLogo} className="h-4 w-4" alt="" /> <span className="ml-2">Continue with Google</span>
                        </button>
                    </div>

                    <div className="mt-3 font-staatliche font-bold text-xs text-center">
                        OR
                    </div>

                    <div className='text-sm w-[250px] mt-2'>
                        <p>Email Address<sup className="text-red-500">*</sup></p>
                        <input autoFocus onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required type="text" name='email' placeholder='Enter your email address...' />
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
