import ProductOrder from "../../../components/ProductOrder";
import SellerSidebar from "../../../components/SellerSidebar";

import P1 from "../../../assets/p1.png";
import BgPink from "../../../assets/bg-pink.png";
import DashboardName from "../../../components/DashboardName";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../config/Context";

export default function ManageOrder() {

    const {user} = useContext(Context);
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        if(user){
            setOrders(user.profile.productorders);
        }
    }, [user])

    // For Debugging
    useEffect(()=>{
        if(orders){
            console.log(orders);
        }
    }, [orders])

    return (
        <div className="container min-h-dvh pt-13">
            <div className="">

                <SellerSidebar current='orders' />

                <div className="h-auto ml-[250px] px-10 py-7">
                    
                    <DashboardName/>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl mb-3">Manage Orders</div>
                        <div className="space-y-4">
                            {
                                orders.map((elm, index)=>(        
                                    <div key={index} className="border-2 px-4 py-3 rounded-xl"> 
                                        <div className="font-staatliches text-lg my-2">Order id: {elm.orderId}</div>
                                        <ProductOrder pImg={elm.img[0]} bgImg={BgPink} title={elm.title} desc={elm.desc} price={elm.
discountedPrice} oldPrice={elm.price} status={elm.status} />
                                        <div className="flex space-x-2 mt-2">
                                            <select className="bg-white py-1 px-2 font-inter text-sm border-2 rounded-lg border-[#124C5F]" name="" id="">
                                                <option value="packed">Package Packed</option>
                                                <option value="dispatched">Dispatched</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <div className="select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">Update Status</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
