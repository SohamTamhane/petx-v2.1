import ProductCart from "../../components/ProductCart";
import P1 from "../../assets/p1.png";
import BgPink from "../../assets/bg-pink.png";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Footer from "../../components/Footer";
import { Context } from "../../config/Context";
import toast from "react-hot-toast";
import axios from "axios";
import SpinnerBtn from "../../components/SpinnerBtn";

export default function Cart() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();

    const btnDivRef1 = useRef();
    const btnTextRef1 = useRef();
    const spinnerRef1 = useRef();

    const navigate = useNavigate();

    const { user, setUser, cart, setCart, buyNow, token, fetchUserDetails } = useContext(Context);
    const [currCart, setCurrCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const [selectedVal, setSelectedVal] = useState(1);
    const [addressForm, setAddressForm] = useState("hidden");
    const [addressOption, setAddressOption] = useState("block");

    const [name, setName] = useState(user?.profile?.address?.name);
    const [address, setAddress] = useState(user?.profile?.address?.address);
    const [pincode, setPincode] = useState(user?.profile?.address?.pincode);
    const [mobile, setMobile] = useState(user?.profile?.address?.mobile);

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function verifyPayment(bodyData) {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/verifyPayment`,
                {cart: currCart, orderId: bodyData.orderId, paymentId: bodyData.paymentId, razorpay_signature: bodyData.razorpay_signature,
                    address: {
                        name: name,
                        address: address,
                        pincode: pincode,
                        mobile: mobile
                    }
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).then((res)=>{
                toast.success("Payment Successfull!!");
                fetchUserDetails(token);
                navigate(`/payment/success/${bodyData.orderId}`);
            }).catch((error)=>{
                console.log(error);
            })
        }
        catch (error) {
            console.log("PAYMENT VERIFY ERROR....", error);
            toast.error("Could not verify Payment");
        }
    }

    const handleSubmit = async () => {
        if (name === "" || address === "" || pincode === "" || mobile === "") {
            toast.error("Please Fill Delivery Details");
        }
        else if (currCart.length === 0) {
            toast.error("Please add products in cart to checkout");
        }
        else {
            btnDivRef1.current.disabled = true;
            btnTextRef1.current.style.display = "none";
            spinnerRef1.current.style.display = "block";

            const orderResponse = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!orderResponse) {
                toast.error("RazorPay SDK failed to load");
                return;
            }

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/capturePayment`,
                { total_amount: totalAmount },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).then((res) => {

                const options = {
                    key: import.meta.env.VITE_API_RAZORPAY_KEY,
                    amount: res.data.data.amount,
                    currency: res.data.data.currency,
                    name: "PetX",
                    description: "Thank you for shopping with us!",
                    order_id: res.data.data.id,
                    prefill: {
                        name: `${user.name}`,
                        email: user.email
                    },
                    handler: function (response) {
    
                        const paymentDetails = {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            // productId,
                        };
                        
                        // console.log(paymentDetails);

                        verifyPayment(paymentDetails);
                    }
                };


                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                paymentObject.on("payment.failed", function (response) {
                    toast.error("oops, payment failed");
                    console.log(response.error);

                })
            }).catch((error) => {
                console.log(error);
                toast.error("Failed to initiate payment");
            }).finally(() => {

                btnDivRef1.current.disabled = false;
                btnTextRef1.current.style.display = "block";
                spinnerRef1.current.style.display = "none";

            })



            // navigate("/payment/success");
        }
    }

    const handleEdit = () => {
        setAddressForm("block");
        setAddressOption("hidden");
    }

    const handleCloseEdit = async () => {
        if (name === "" || address === "" || pincode === "" || mobile === "") {
            toast.error("Please Fill All the Fields");
        }
        else {
            btnDivRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/address/update`,
                { name: name, address: address, pincode: pincode, mobile: mobile },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).then((res) => {

                toast.success(res.data.message);
                setAddressForm("hidden");
                setAddressOption("block");

                fetchUserDetails(token);

                btnDivRef.current.disabled = false;
                btnTextRef.current.style.display = "block";
                spinnerRef.current.style.display = "none";

            }).catch((error) => {
                console.log(error.response);
            })
        }
    }

    useEffect(() => {
        if (buyNow.length !== 0) {
            setCurrCart(buyNow);
        }
        else {
            setCurrCart(cart);
        }
    }, [cart, buyNow])

    useEffect(() => {
        if (!user?.profile.address) {
            setName("");
            setAddress("");
            setPincode("");
            setMobile("");
            setAddressForm("block");
            setAddressOption("hidden");
        }
        else {
            setName(user?.profile?.address?.name);
            setAddress(user?.profile?.address?.address);
            setPincode(user?.profile?.address?.pincode);
            setMobile(user?.profile?.address?.mobile);
            setAddressForm("hidden");
            setAddressOption("block");
        }
    }, [user])

    useEffect(() => {
        if (currCart.length !== 0) {
            let total = totalAmount;
            currCart.map((elm) => {
                total += elm.discountedPrice;
            })
            setTotalAmount(total);
        }
    }, [currCart])

    return (
        <>
            <div className="container min-h-dvh pt-15">
                <div>
                    <div className="container font-staatliches text-4xl text-center mt-6">Your Cart</div>
                    <div className="container flex justify-center">
                        <div className="w-[60%] flex flex-col space-y-4 mt-8">
                            {
                                currCart?.length === 0 ?
                                    <div className="text-base text-red-400 font-bold">
                                        Your Cart is Empty
                                    </div>
                                    :
                                    currCart?.map((elm, index) => (
                                        <ProductCart key={index} slug={elm.slug} pImg={elm.img[0]} bgImg={BgPink} title={elm.title} desc={elm.desc} price={elm.discountedPrice} oldPrice={elm.price} />
                                    ))
                            }
                        </div>
                        <div>
                            <div className="bg-white w-100 h-fit py-6 px-5 ml-10 mt-8 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="font-staatliches text-xl">Delivery Address</div>
                                    <div><FaEdit onClick={handleEdit} className="cursor-pointer text-xl" /></div>
                                </div>
                                <div className={`${addressOption} mt-3`}>
                                    <div className="font-inter text-sm flex items-center space-x-3 my-3">
                                        <div>
                                            <input type="radio" checked={selectedVal == 1} name="address" id="address" value={1} onClick={() => setSelectedVal(1)} />
                                        </div>
                                        <div>
                                            <div>
                                                <span className="font-semibold">Name:</span> {name}
                                            </div>
                                            <div>
                                                {address} - {pincode}
                                            </div>
                                            <div>
                                                <span className="font-semibold">{mobile}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="font-inter font-semibold text-center mt-3 text-xs">
                                    Add New Address
                                </div> */}

                                <div className={`${addressForm}`}>
                                    <div className='text-sm mt-2'>
                                        <p>Name<sup className="text-red-500">*</sup></p>
                                        <input value={name} onChange={(e) => setName(e.target.value)} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-sm" required type="text" name='email' placeholder='Enter your name...' />
                                    </div>
                                    <div className='text-sm mt-2'>
                                        <p>Address<sup className="text-red-500">*</sup></p>
                                        <input value={address} onChange={(e) => setAddress(e.target.value)} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-sm" required type="text" name='email' placeholder='Enter your address...' />
                                    </div>
                                    <div className='text-sm mt-2'>
                                        <p>Pincode<sup className="text-red-500">*</sup></p>
                                        <input value={pincode} onChange={(e) => setPincode(e.target.value)} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-sm" required type="text" name='email' placeholder='Enter your pincode...' />
                                    </div>
                                    <div className='text-sm mt-2'>
                                        <p>Mobile No:<sup className="text-red-500">*</sup></p>
                                        <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="text-xs w-full mt-1 px-3 py-2 border-2 focus:outline-none focus:border-[#FB7E46] rounded-sm" required type="text" name='email' placeholder='Enter your mobile no...' />
                                    </div>

                                    {/* <div onClick={handleCloseEdit} className="cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-4">Update Delivery Address</div> */}
                                    <button ref={btnDivRef} onClick={handleCloseEdit} className="w-full cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-4">
                                        <div ref={btnTextRef}>
                                            Update Delivery Address
                                        </div>
                                        <div className="hidden" ref={spinnerRef}>
                                            <SpinnerBtn />
                                        </div>
                                    </button>

                                </div>

                            </div>
                            <div className="bg-white w-100 h-fit py-6 px-5 ml-10 mt-3 rounded-lg">
                                <div className="font-staatliches text-xl">Total Price: ₹{totalAmount}/-</div>
                                {/* <div onClick={handleSubmit} className="cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-2">Proceed to Checkout</div> */}
                                <button ref={btnDivRef1} onClick={handleSubmit} className="w-full cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-4">
                                    <div ref={btnTextRef1}>
                                        Proceed to Checkout
                                    </div>
                                    <div className="hidden" ref={spinnerRef1}>
                                        <SpinnerBtn />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
