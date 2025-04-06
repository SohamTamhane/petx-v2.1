import { FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShieldDog } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function UserSidebar({ current }) {

    const navigate = useNavigate();
    
    function logOutFunc() {
        // Remove Cookie by setting the past date as expiry
        document.cookie = "petx=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/auth/login");
        window.location.reload();
    }

    return (
        <div className="bg-[#27221F] text-white w-[250px] h-[100%] fixed px-2 py-3 select-none">
            <div className="font-staatliches text-xl text-center my-5">User Dashboard</div>
            {
                current == 'profile' ?
                    <div className="bg-[#545353] rounded-2xl my-1 px-4 py-2 font-inter flex items-center space-x-2 text-sm cursor-pointer">
                        <FaUser />
                        <div>View Profile</div>
                    </div>
                    :
                    <div onClick={()=>navigate('/user/dashboard')} className="rounded-2xl my-1 px-4 py-2 font-inter flex items-center space-x-2 text-sm cursor-pointer">
                        <FaUser />
                        <div>View Profile</div>
                    </div>
            }
            {
                current == 'orders' ?
                    <div className="bg-[#545353] font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                        <FaBoxOpen />
                        <div>Your Orders</div>
                    </div>
                    :
                    <div onClick={()=>navigate('/user/dashboard/order')} className="font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                        <FaBoxOpen />
                        <div>Your Orders</div>
                    </div>
            }
            <div onClick={() => navigate('/cart')} className="font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                <FaShoppingCart />
                <div>View Cart</div>
            </div>
            {
                current == 'manage_pet' ?
                    <div className="bg-[#545353] font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                        <FaShieldDog />
                        <div>Manage Pets</div>
                    </div>
                    :
                    <div onClick={()=>navigate('/user/dashboard/managepets')} className="font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                        <FaShieldDog />
                        <div>Manage Pets</div>
                    </div>
            }
            <hr className="my-3" />
            {
                current == 'settings' ?
                    <div className="bg-[#545353] font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                        <IoMdSettings />
                        <div>Settings</div>
                    </div>
                    :
                    <div onClick={()=>navigate('/user/dashboard/settings')} className="font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                        <IoMdSettings />
                        <div>Settings</div>
                    </div>
            }
            <div onClick={logOutFunc} className="font-inter my-1 rounded-2xl px-4 py-2 flex items-center space-x-2 text-sm cursor-pointer">
                <BiLogOut />
                <div>Logout</div>
            </div>
        </div>
    )
}
