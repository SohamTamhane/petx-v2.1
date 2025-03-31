import ProductOrder from "../../../components/ProductOrder";
import SellerSidebar from "../../../components/SellerSidebar";

import P1 from "../../../assets/p1.png";
import BgPink from "../../../assets/bg-pink.png";
import ProductAdmin from "../../../components/ProductAdmin";
import { useContext, useEffect, useRef, useState } from "react";
import SpinnerBtn from "../../../components/SpinnerBtn";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Context } from "../../../config/Context";
import DashboardName from "../../../components/DashboardName";

export default function ManageProducts() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const btnDivRef1 = useRef();
    const btnTextRef1 = useRef();
    const spinnerRef1 = useRef();

    const titleRef = useRef();
    const descRef = useRef();
    const priceRef = useRef();
    const oldPriceRef = useRef();
    const stockRef = useRef();
    const categoryRef = useRef();
    const selectedFileRef = useRef();

    const [cookies, setCookie] = useCookies(['petx']);
    const {user, setUser, fetchUserDetails, token} = useContext(Context);

    const [editOption, setEditOption] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("Food");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files);
        // setImageURL(URL.createObjectURL(event.target.files[0]));
    }

    async function handleAddProduct() {

        if (title === "" || stock === "" || desc === "" || price === "" || oldPrice === "" || category === "" || !selectedFile) {
            toast.error("Fill all Details of Product")
        }
        else {
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            titleRef.current.disabled = true;
            descRef.current.disabled = true;
            priceRef.current.disabled = true;
            oldPriceRef.current.disabled = true;
            stockRef.current.disabled = true;
            categoryRef.current.disabled = true;
            selectedFileRef.current.disabled = true;

            const formData = new FormData();
            for (let i = 0; i < selectedFile.length; i++) {
                formData.append('img', selectedFile[i]);
            }

            formData.append('title', title);
            formData.append('desc', desc);
            formData.append('category', category);
            formData.append('price', oldPrice);
            formData.append('discountedPrice', price);
            formData.append('stock', stock);

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/seller/product/add`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cookies.petx}` } }).then((res) => {
                toast.success(res.data.message);
                // navigate("/dashboard");
            }).catch((error) => {
                toast.error(error.response.data.message);
            }).finally(() => {
                titleRef.current.disabled = false;
                descRef.current.disabled = false;
                priceRef.current.disabled = false;
                oldPriceRef.current.disabled = false;
                stockRef.current.disabled = false;
                categoryRef.current.disabled = false;
                selectedFileRef.current.disabled = false;

                btnDivRef.current.disabled = false;
                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";

                setTitle("");
                setDesc("");
                setOldPrice("");
                setPrice("");
                setStock("");
                setCategory("Food");
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
        setTitle("");
        setDesc("");
        setPrice("");
        setStock("");
        setOldPrice("");
        setCategory("Food");
    }

    async function handleEditFunction(){
        if (title === "" || stock === "" || desc === "" || price === "" || oldPrice === "" || category === "") {
            toast.error("Fill all Details of Product")
        }
        else{
            btnDivRef1.current.disabled = true;
            btnTextRef1.current.style.display = "none";
            spinnerRef1.current.style.display = "block";

            titleRef.current.disabled = true;
            descRef.current.disabled = true;
            priceRef.current.disabled = true;
            oldPriceRef.current.disabled = true;
            stockRef.current.disabled = true;
            categoryRef.current.disabled = true;
            selectedFileRef.current.disabled = true;
    
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/seller/product/update`, {slug: slug, title: title, desc: desc, price: oldPrice, discountedPrice: price, stock: stock, category: category}, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cookies.petx}` } }).then((res) => {
                toast.success(res.data.message);
                // fetchUserDetails(cookies.petx);
            }).catch((error) => {
                toast.error(error.response.data.message);
            }).finally(() => {
                titleRef.current.disabled = false;
                descRef.current.disabled = false;
                priceRef.current.disabled = false;
                oldPriceRef.current.disabled = false;
                stockRef.current.disabled = false;
                categoryRef.current.disabled = false;
                selectedFileRef.current.disabled = false;

                btnDivRef1.current.disabled = false;
                btnTextRef1.current.style.display = "block";
                spinnerRef1.current.style.display = "none";

                setTitle("");
                setDesc("");
                setOldPrice("");
                setPrice("");
                setStock("");
                setCategory("Food");
                setSelectedFile(null);
                setEditOption(false);
                
                setTimeout(()=>{
                    window.location.reload();
                }, 1000)
                
                fetchUserDetails(token);
            })
        }
    }

    return (
        <div className="container min-h-dvh pt-13">
            <div className=" ">

                <SellerSidebar current='product' />

                <div className="h-auto ml-[250px] px-10 py-7">
                    <DashboardName/>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl mb-3">
                            {
                                editOption ? 
                                    <span>Edit Product</span>
                                :
                                    <span>Add Product</span>
                            }
                        </div>
                        <div>
                            <div className="flex space-x-3">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Title<sup className="text-red-500">*</sup></p>
                                    <input ref={titleRef} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={title} onChange={(e) => setTitle(e.target.value)} required type="text" name='text' placeholder='Enter product title ...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Description<sup className="text-red-500">*</sup></p>
                                    <input ref={descRef} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={desc} onChange={(e) => setDesc(e.target.value)} required type="text" name='text' placeholder='Enter product description...' />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-1">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Price<sup className="text-red-500">*</sup></p>
                                    <input ref={oldPriceRef} className="remove-arrow text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} required type="number" name='email' placeholder='Enter product price ...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Discounted Price<sup className="text-red-500">*</sup></p>
                                    <input ref={priceRef} className="remove-arrow text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={price} onChange={(e) => setPrice(e.target.value)} required type="number" name='email' placeholder='Enter discounted price...' />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-1">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Stock<sup className="text-red-500">*</sup></p>
                                    <input ref={stockRef} className="remove-arrow text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-lg" value={stock} onChange={(e) => setStock(e.target.value)} required type="number" name='email' placeholder='Enter available stock...' />
                                </div>
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Category<sup className="text-red-500">*</sup></p>
                                    <select ref={categoryRef} value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white mt-1 w-full py-2 px-3 font-inter text-xs border-2 rounded-lg border-[#124C5F]" name="" id="">
                                        <option value="Food">Food</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-1">
                                <div className='text-sm w-[250px] mt-2'>
                                    <p>Product Images<sup className="text-red-500">*</sup></p>
                                    <input ref={selectedFileRef} onChange={handleFileChange} multiple className="remove-arrow bg-white mt-1 w-full py-2 px-3 font-inter text-xs border-2 rounded-lg border-[#124C5F]" type="file" name="" id="" />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-3">
                                {
                                    editOption ?
                                        <>
                                            <button ref={btnDivRef1} onClick={handleEditFunction} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
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
                                        <button ref={btnDivRef} onClick={handleAddProduct} className="flex items-center justify-center mt-3 select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">
                                            <div ref={btnTextRef}>
                                                Add Product
                                            </div>
                                            <div className="hidden" ref={spinnerRef}>
                                                <SpinnerBtn />
                                            </div>
                                        </button>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl mb-3">Manage Products</div>
                        <div className="space-y-4">

                            {
                                user?.profile.products.length === 0 ?
                                    <div className="text-base text-red-400 font-bold">
                                        No Product Exists
                                    </div>
                                :
                                    user?.profile.products.map((elm)=>(
                                        <ProductAdmin setTitle={setTitle} setSlug={setSlug} setDesc={setDesc} setPrice={setPrice} setOldPrice={setOldPrice} setStock={setStock} setCategory={setCategory} setEditOption={setEditOption} selectedFileRef={selectedFileRef} key={elm?.slug} stock={elm.stock} slug={elm.slug} category={elm.category} pImg={elm.img[0]} bgImg={BgPink} title={elm.title} desc={elm.desc} price={elm.discountedPrice} oldPrice={elm.price} />
                                    ))
                            }

                            {/* <ProductAdmin category='Food' pImg={P1} bgImg={BgPink} title="Drools | 3KG" desc="Adult chicken and egg Egg, Chicken 3 kg Dry Adult Dog Food" price={499} oldPrice={999} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
