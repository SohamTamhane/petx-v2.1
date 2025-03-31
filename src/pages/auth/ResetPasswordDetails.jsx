import { useContext } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../config/Context";

export default function ResetPasswordDetails() {

    const navigate = useNavigate();

    const {userInfo} = useContext(Context);

    function handleSubmit() {
        navigate('/auth/login')
    }

    return (
        <div className="container min-h-dvh pt-15 relative">
            <div onClick={() => navigate('/auth/resetpass')} className="cursor-pointer absolute flex items-center font-inter font-semibold text-sm left-3">
                <IoIosArrowBack /> <span>Back</span>
            </div>
            <div className="container font-staatliches text-3xl text-center mt-10">Check Email</div>
            <div className="font-inter flex justify-center text-center mt-2 text-sm">
                <div className="w-[40%] text-[#595959]">
                All done! We have sent an email to <span className="font-bold">{userInfo?.email}</span> to confirm
                </div>
            </div>
            <div className="font-inter container flex items-center justify-center mt-4">

                <div className="">
                    <div className="mt-3">
                        <div onClick={handleSubmit} className="cursor-pointer container bg-[#27221F] text-white text-center py-2 text-sm font-semibold rounded-lg mt-2">Return to Login</div>
                    </div>
                    <div className="font-semibold text-center mt-3 text-xs">
                        Already have an Account? <span className="text-[#FB7E46] ml-1 font-bold"><Link to='/auth/login'>Login</Link></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
