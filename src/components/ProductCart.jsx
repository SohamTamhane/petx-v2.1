import { useContext } from "react"
import { Context } from "../config/Context"
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductCart({pImg, bgImg, title, desc, price, oldPrice, slug}) {

    const {token, fetchUserDetails} = useContext(Context);

    async function handleRemove(){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/market/cart/remove`,{slug: slug},
            {headers: { Authorization: `Bearer ${token}` }}
        ).then((res) => {
            toast.success(res.data.message);
            fetchUserDetails(token);

        }).catch((error) => {
            toast.error(error.response.data.message);
        })
    }

    return (
        <div className="flex border-2 py-2 rounded-lg">
            <div className="relative h-27 flex justify-center w-30">
                <img className="w-15 h-auto absolute top-0 z-10" src={pImg} alt="" />
                <img className="w-25 absolute bottom-0 z-0" src={bgImg} alt="" />
            </div>  
            <div>
                <div className="font-staatliches text-base">{title}</div>
                <div className="font-inter text-xs text-wrap text-[#979697]">{desc}</div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-staatliches text-base">₹{price}/-</span>
                        <span className="ml-2 font-inter text-xs text-[#979697]"><del>₹{oldPrice}/-</del></span>
                    </div>
                </div>
                <div onClick={handleRemove} className="cursor-pointer w-20 bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Remove</div>
            </div>
        </div>
    )
}
