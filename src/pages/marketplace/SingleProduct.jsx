import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

import BgPink from "../../assets/bg-pink.png";
import BgYellow from "../../assets/bg-yellow.png";
import BgBlue from "../../assets/bg-blue.png";
import ProductCard from "../../components/ProductCard";
import { useContext, useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../config/Context";

export default function SingleProduct() {

    const ref = useRef();
    const {slug} = useParams();
    const {token, fetchUserDetails, buyNow, setBuyNow} = useContext(Context);
    const navigate = useNavigate();

    const [currentImg, setCurrentImg] = useState(0);
    const [product, setProduct] = useState(undefined);
    const [imgArr, setImgArr] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState(undefined);

    async function handleBuyNow(){
        setBuyNow([product]);
        navigate('/cart')
    }

    async function handleAddToCart(){
        if(!token){
            toast.error("Please Login to add product to cart");
            navigate('/auth/login')
        }
        else{
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/market/cart/add`,{slug: slug},
                {headers: { Authorization: `Bearer ${token}` }}
            ).then((res) => {
                toast.success(res.data.message);
                fetchUserDetails(token);

            }).catch((error) => {
                toast.error(error.response.data.message);
            })
        }
    }

    async function fetchProductDetails(){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/market/product`,{slug: slug}
        ).then((res) => {
            setProduct(res.data.products);
        }).catch((error) => {
            console.log(error.response);
        })
    }

    async function fetchRelatedProducts(category){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/market/category`,{category: category}
        ).then((res) => {
            setRelatedProducts(res.data.products);
        }).catch((error) => {
            console.log(error.response);
        })
    }

    useEffect(()=>{
        fetchProductDetails();
    }, [slug])

    useEffect(()=>{
        if(product){
            setImgArr(product?.img);
            fetchRelatedProducts(product?.category);
        }
    }, [product])

    return (
        <>
            <div className="container min-h-dvh pt-15">
                <div className="flex justify-center gap-x-10 mt-5">
                    <div className="flex gap-x-3">
                        <div className="no-scrollbar scroll-smooth flex flex-col gap-2 h-100 overflow-y-scroll">
                            {
                                product?.img.map((elm, index)=>(
                                    <div key={index} onClick={()=>setCurrentImg(index)} className="cursor-pointer bg-gray-300 w-14 h-20">
                                        <img className="w-full h-full" src={elm} alt="" />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="w-70 h-100 bg-gray-100 flex items-center justify-center">
                            <img className="w-full h-full" src={imgArr[currentImg]} alt="" />
                        </div>
                    </div>

                    <div className="w-[35%]">
                        <div className="font-staatliches text-2xl">{product?.title}</div>
                        <div className="font-inter font-semibold text-sm">{product?.category}</div>
                        <div className="flex items-center my-2">
                            <span className="font-staatliches text-2xl">₹{product?.discountedPrice}/-</span>
                            <span className="ml-2 font-inter text-sm text-[#979697]"><del>₹{product?.price}/-</del></span>
                        </div>

                        <div>
                            <div onClick={handleAddToCart} className="w-60 cursor-pointer border-2 border-[#124C5F] text-[#124C5F] bg-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Add to Cart</div>
                            <div onClick={handleBuyNow} className="w-60 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Buy Now</div>
                        </div>

                        <div className="mt-5">
                            <div className="font-inter text-sm font-bold">Description: </div>
                            <div className="font-inter text-sm">{product?.desc}</div>
                        </div>

                        <div className="mt-4 font-inter text-sm font-bold">Stock: 
                            {
                                (product?.stock)>0 ?
                                    <span className="text-green-700"> In Stock</span>
                                :
                                <span className="text-red-700"> Out of Stock</span>
                            }
                        </div>
                        {/* <div className="mt-2 font-inter text-sm"><span className="font-bold">Seller Name:</span> Soham Tamhane</div> */}
                        <div className="mt-2 font-inter text-sm"><span className="font-bold">Country of Origin:</span> India</div>
                    </div>
                </div>


                <div className="mt-20">
                    <div className="font-staatliches text-center text-3xl">Related Products</div>
                    <div className="flex items-center justify-center">
                        <div ref={ref} className="no-scrollbar scroll-smooth flex w-[80%] overflow-x-scroll items-center mt-6 gap-x-7">
                            {
                                relatedProducts?.map((elm, index)=>(
                                    
                                    <ProductCard key={elm.slug} slug={elm.slug} pImg={elm.img[0]} bgImg={BgPink} title={elm.title} desc={elm.desc} price={elm.discountedPrice} oldPrice={elm.price} category={elm.category} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="flex items-center space-x-2 mt-2">
                            <div onClick={() => ref.current.scrollLeft -= 100} className="cursor-pointer bg-white p-2 rounded-2xl">
                                <FaArrowLeftLong fontSize={20} />
                            </div>
                            <div onClick={() => ref.current.scrollLeft += 100} className="cursor-pointer bg-white p-2 rounded-2xl">
                                <FaArrowRightLong fontSize={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}
