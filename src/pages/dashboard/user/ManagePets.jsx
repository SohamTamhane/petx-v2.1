import { useContext, useEffect, useRef, useState } from "react";
import DashboardName from "../../../components/DashboardName";
import UserSidebar from "../../../components/UserSidebar";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { useCookies } from "react-cookie";
import { Context } from "../../../config/Context";
import toast from "react-hot-toast";
import axios from "axios";

export default function ManagerPets(){

    const nameRef = useRef();
    const ageRef = useRef();
    const genderRef = useRef();
    const categoryRef = useRef();
    const priceRef = useRef();
    const saleRef = useRef();
    const selectedFileRef = useRef();

    
    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const btnDivRef1 = useRef();
    const btnTextRef1 = useRef();
    const spinnerRef1 = useRef();

    const[name, setName] = useState("");
    const[age, setAge] = useState("");
    const[gender, setGender] = useState("Male");
    const[category, setCategory] = useState("Dog");
    const[price, setPrice] = useState("");
    const[sale, setSale] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const[editOption, setEditOption] = useState(false);

    
    const [cookies, setCookie] = useCookies(['petx']);
    const {user, setUser, fetchUserDetails, token} = useContext(Context);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files);
    }

    async function handlerPetAdd() {
        console.log(name);
        console.log(age);
        console.log(gender);
        console.log(category);
        console.log(price);
        console.log(sale);
        console.log(selectedFile)
        if (name === "" || age === "" || gender === "" || category === "" || price === "" || sale === "" || selectedFile === "") {
            toast.error("Fill all Details of Product");
        }
        else{
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            nameRef.current.disabled = true;
            ageRef.current.disabled = true;
            genderRef.current.disabled = true;
            categoryRef.current.disabled = true;
            priceRef.current.disabled = true;
            saleRef.current.disabled = true;
            categoryRef.current.disabled = true;

            const formData = new FormData();
            for (let i = 0; i < selectedFile.length; i++) { 
                formData.append('img', selectedFile[i]);
            }

            formData.append('name', name);
            formData.append('age', age);
            formData.append('gender', gender);
            formData.append('category', category);
            formData.append('price', price);
            formData.append('sale', sale);

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/managepets/addpet`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cookies.petx}` } }).then((res) => {
                toast.success(res.data.message);
                // navigate("/dashboard");
            }).catch((error) => {
                toast.error(error.response.data.message);
            }).finally(() => {
                nameRef.current.disabled = false;
                ageRef.current.disabled = false;
                genderRef.current.disabled = false;
                categoryRef.current.disabled = false;
                priceRef.current.disabled = false;
                saleRef.current.disabled = false;
                categoryRef.current.disabled = false;

                btnDivRef.current.disabled = false;
                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";

                setName("");
                setAge("");
                setGender("Male");
                setCategory("Dog");
                setPrice("");
                setSale("Yes");
                setSelectedFile(null);

                setTimeout(()=>{
                    window.location.reload();
                }, 1000)

                fetchUserDetails(token);
            })
        }
    }

    async function handleCancelEdit(){
        selectedFileRef.current.disabled = false;
        selectedFileRef.current.style.backgroundColor = "white";
        setEditOption(false);
        setName("");
        setAge("");
        setGender("Male");
        setCategory("Dog");
        setPrice("");
        setSale("Yes");
        setSelectedFile(null);
    }

    useEffect(()=>{
        console.log(user)
    }, [])

    return(
        <div className="container min-h-dvh pt-13">

            <div className="">
                <UserSidebar current='profile'/>

                <div className="h-auto ml-[250px] px-10 py-7">
                    <DashboardName/>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl">
                            {
                                editOption ? 
                                    <span>Edit Pet Details</span>
                                :
                                    <span>Add Pet Details</span>
                            }
                        </div>

                        <div className="mt-4">
                            <div className="flex space-x-3">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Pet Name<sup className="text-red-500">*</sup></p>
                                    <input ref={nameRef} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required type="text" name='text' placeholder='Enter pet name...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Age of Pet<sup className="text-red-500">*</sup></p>
                                    <input ref={ageRef} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={age} onChange={(e) => setAge(e.target.value)} required type="number" name='text' placeholder='Enter age of pet...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Gender<sup className="text-red-500">*</sup></p>
                                    <select ref={genderRef} value={gender} onChange={(e) => setGender(e.target.value)} className="bg-white mt-1 w-full py-2 px-3 font-inter text-xs border-2 rounded-lg border-[#124C5F]" name="" id="">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Category<sup className="text-red-500">*</sup></p>
                                    <select ref={categoryRef} value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white mt-1 w-full py-2 px-3 font-inter text-xs border-2 rounded-lg border-[#124C5F]" name="" id="">
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Price<sup className="text-red-500">*</sup></p>
                                    <input ref={priceRef} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={price} onChange={(e) => setPrice(e.target.value)} required type="number" name='text' placeholder='Enter price...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Want to Sale<sup className="text-red-500">*</sup></p>
                                    <select ref={saleRef} value={sale} onChange={(e) => setSale(e.target.value)} className="bg-white mt-1 w-full py-2 px-3 font-inter text-xs border-2 rounded-lg border-[#124C5F]" name="" id="">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-1">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Pets Images<sup className="text-red-500">*</sup></p>
                                    <input ref={selectedFileRef} onChange={handleFileChange} multiple className="remove-arrow bg-white mt-1 w-full py-2 px-3 font-inter text-xs border-2 rounded-lg border-[#124C5F]" type="file" name="" id="" />
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-3">
                                    {
                                        editOption ?
                                            <>
                                                <button ref={btnDivRef1} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
                                                    <div ref={btnTextRef1}>
                                                        Edit Product
                                                    </div>
                                                    <div className="hidden" ref={spinnerRef1}>
                                                        <SpinnerBtn />
                                                    </div>
                                                </button>
                                                <button onClick={handleCancelEdit} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#e85451] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
                                                    <div>
                                                        Cancel
                                                    </div>
                                                </button>
                                            </>
                                        :
                                        <button ref={btnDivRef} onClick={handlerPetAdd} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
                                            <div ref={btnTextRef}>
                                                Add Pet
                                            </div>
                                            <div className="hidden" ref={spinnerRef}>
                                                <SpinnerBtn />
                                            </div>
                                        </button>
                                    }
                             </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}