
export default function ProductOrder({pImg, bgImg, title, desc, price, oldPrice, status}) {


    return (
        <div className="flex py-2 rounded-lg">
            <div className="relative h-27 flex justify-center w-30">
                <img className="w-auto h-full absolute top-0 z-10" src={pImg} alt="" />
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
                <div className="font-inter text-xs text-wrap text-green-600 font-bold"><span className="text-black">Delivery Status:</span> {status}</div>
                {/* <div className="cursor-pointer w-20 bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Remove</div> */}
            </div>
        </div>
    )
}
