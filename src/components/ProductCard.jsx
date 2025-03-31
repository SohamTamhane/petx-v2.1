import { useNavigate } from "react-router-dom"

export default function ProductCard({ pImg, slug, bgImg, title, desc, price, oldPrice, category }) {

    const navigate = useNavigate();

    return (
        <div onClick={()=>navigate(`/product/${slug}`)} className="cursor-pointer relative w-47 px-2 py-2">
            <div className="relative h-50 flex justify-center w-40">
                <img className="w-auto h-40 absolute top-0 z-10" src={pImg} alt="" />
                <img className="w-40 absolute bottom-5 z-0" src={bgImg} alt="" />
            </div>
            <div className="truncate">
                <div className="truncate font-staatliches text-base">{title}</div>
                <div className="truncate font-inter text-xs text-[#979697]">{desc}</div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-staatliches text-base">₹{price}/-</span>
                        <span className="ml-2 font-inter text-xs text-[#979697]"><del>₹{oldPrice}/-</del></span>
                    </div>
                    <div className="font-inter text-xs text-wrap font-semibold">{category}</div>
                </div>
                <div className="cursor-pointer bg-[#124C5F] text-white text-center font-inter font-semibold text-xs py-2 rounded-sm mt-1">Buy Now</div>
            </div>
        </div>
    )
}
