import ProductOrder from "../../../components/ProductOrder";
import UserSidebar from "../../../components/UserSidebar";

import BgPink from "../../../assets/bg-pink.png";
import DashboardName from "../../../components/DashboardName";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../config/Context";

export default function UserOrders() {

    const {user} = useContext(Context);

    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        if(user){
            setOrders(user.profile.orders);
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
            <div className=" ">

                <UserSidebar current='orders' />

                <div className="h-auto ml-[250px] px-10 py-7">
                    <DashboardName/>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl mb-3">Your Orders</div>
                        <div className="space-y-4">

                            {
                                orders.map((elm, index)=>(
                                    <div key={index} className="border-2 px-4 py-3 rounded-xl"> 
                                        <div className="font-staatliches text-lg my-2">Order id: {elm.orderId}</div>
                                        {
                                            elm.order.map((product, index_key)=>(
                                                <ProductOrder key={index_key} pImg={product.img[0]} bgImg={BgPink} status={product.status} title={product.title} desc={product.desc} price={product.discountedPrice} oldPrice={product.price} />
                                            ))
                                        }
                                        <div className="font-inter text-sm mt-1 text-wrap"><span className="font-bold">Address:</span> {elm.address.name}, {elm.address.address} - {elm.address.pincode}, {elm.address.mobile}</div>
                                        {/* <div className="mt-2">
                                            <div className="select-none w-fit px-10 cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm">Track Order</div>
                                        </div> */}
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
