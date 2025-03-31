import ProductCard from "../../components/ProductCard";
import P1 from "../../assets/p1.png";
import P2 from "../../assets/p2.png";

import BgPink from "../../assets/bg-pink.png";
import BgYellow from "../../assets/bg-yellow.png";
import BgBlue from "../../assets/bg-blue.png";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import "../../style.css";
import Footer from "../../components/Footer";
import axios from "axios";

export default function Marketplace() {

    const ref1 = useRef();
    const ref2 = useRef();

    const [foodProducts, setFoodProducts] = useState(undefined);
    const [accessoriesProducts, setAccessoriesProducts] = useState(undefined);

    async function fetchFoodProducts(){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/market/category`,{category: "Food"}
        ).then((res) => {
            setFoodProducts(res.data.products);
        }).catch((error) => {
            console.log(error.response);
        })
    }

    async function fetchAccessoriesProducts(){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/market/category`,{category: "Accessories"}
        ).then((res) => {
            setAccessoriesProducts(res.data.products);
        }).catch((error) => {
            console.log(error.response);
        })
    }

    useEffect(()=>{
        fetchFoodProducts();
        fetchAccessoriesProducts();
    }, [])

    // For Debugging
    // useEffect(()=>{
    //     if(accessoriesProducts){
    //         console.log(accessoriesProducts);
    //     }
    // }, [accessoriesProducts])

    return (
        <>
            <div className="container min-h-dvh pt-15">
                <div>
                    <div className="container font-staatliches text-6xl text-center mt-6">Our Products</div>
                    <div className="container font-inter text-center flex items-center justify-center mt-2">
                        <div className="w-[50%]">
                            we know your pets are cherished members of your family. That's why we provide loving, personalized pet care services tailored to their needs.
                        </div>
                    </div>
                    <div className="flex justify-center mt-3">
                        <span className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches">Explore More</span>
                    </div>

                    <div className="mt-20">
                        <div className="font-staatliches text-center text-4xl">Food Products</div>
                        <div className="flex items-center justify-center">
                            <div ref={ref1} className="no-scrollbar scroll-smooth flex w-[80%] overflow-x-scroll items-center mt-6 gap-x-7">
                                {
                                    foodProducts?.map((elm, index)=>(
                                        
                                        <ProductCard key={elm.slug} slug={elm.slug} pImg={elm.img[0]} bgImg={BgPink} title={elm.title} desc={elm.desc} price={elm.discountedPrice} oldPrice={elm.price} category={elm.category} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <div className="flex items-center space-x-2 mt-2">
                                <div onClick={()=>ref1.current.scrollLeft-=100} className="cursor-pointer bg-white p-2 rounded-2xl">
                                    <FaArrowLeftLong fontSize={20} />
                                </div>
                                <div onClick={()=>ref1.current.scrollLeft+=100} className="cursor-pointer bg-white p-2 rounded-2xl">
                                    <FaArrowRightLong fontSize={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20">
                        <div className="font-staatliches text-center text-4xl">Popular Accessories</div>
                        <div className="flex items-center justify-center">
                            <div ref={ref2} className="no-scrollbar scroll-smooth flex w-[80%] overflow-x-scroll items-center mt-6 gap-x-7">
                                {
                                    accessoriesProducts?.map((elm, index)=>(
                                        
                                        <ProductCard key={elm.slug} slug={elm.slug} pImg={elm.img[0]} bgImg={BgPink} title={elm.title} desc={elm.desc} price={elm.discountedPrice} oldPrice={elm.price} category={elm.category} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <div className="flex items-center space-x-2 mt-2">
                                <div onClick={()=>ref2.current.scrollLeft-=100} className="cursor-pointer bg-white p-2 rounded-2xl">
                                    <FaArrowLeftLong fontSize={20} />
                                </div>
                                <div onClick={()=>ref2.current.scrollLeft+=100} className="cursor-pointer bg-white p-2 rounded-2xl">
                                    <FaArrowRightLong fontSize={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}
