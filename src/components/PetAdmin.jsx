import axios from "axios"
import { useContext } from "react";
import { Context } from "../config/Context";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

export default function PetAdmin({id, pImg, bgImg, name, age, gender, category, price, sale, setEditOption, selectedFileRef, setName, setAge, setGender, setCategory, setPrice, setSale}){
    
    const [cookies, setCookie] = useCookies(['petx']);
    const {user, setUser, fetchUserDetails} = useContext(Context);

    // async function handleEditPet(){
    //     window.scrollTo(0, 100);
    //     selectedFileRef.current.disabled = true;
    //     selectedFileRef.current.style.backgroundColor = "#e5e7eb";
    //     setEditOption(true);
    //     setName(name);
    //     setAge(age);
    //     setGender(gender);
    //     setCategory(category);
    //     setPrice(price);
    //     setSale(sale);
    // }

    async function handleDeletePet() {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/managepets/deletepet`, {petId: id},  {headers: { Authorization: `Bearer ${cookies.petx}` } }).then((res) => {
            toast.success(res.data.message);
            fetchUserDetails(cookies.petx);
        }).catch((error) => {
            toast.error(error.response.data.message);
        })
    }

    return (
        <div className="flex border-2 py-2 rounded-lg w-100">
            <div className="relative h-27 flex justify-center w-30">
                <img className="w-auto h-full absolute top-0 z-10" src={pImg} alt="" />
                <img className="w-25 absolute bottom-0 z-0" src={bgImg} alt="" />
            </div>  
            <div>
                <div className="font-staatliches text-base"> Name: {name}</div>
                <div className="font-inter text-xs text-wrap text-[#979697]"> Age: {age}(month)</div>
                <div className="font-inter text-xs text-wrap text-[#979697]">Gender: {gender}</div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-staatliches text-base">₹{price}/-</span>
                        {/* <span className="ml-2 font-inter text-xs text-[#979697]"><del>₹{oldPrice}/-</del></span> */}
                    </div>
                </div>
                <div className="font-inter text-xs text-wrap font-semibold">{category}</div>

                <div className="flex space-x-2">
                    <div onClick={handleDeletePet} className="cursor-pointer w-20 bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Delete</div>
                    {/* <div onClick={handleEditPet} className="cursor-pointer w-20 bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Edit</div> */}
                </div>
            </div>
        </div>
    )
}