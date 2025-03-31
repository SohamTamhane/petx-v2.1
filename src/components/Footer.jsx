import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaShieldDog, FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="z-100 relative container bg-[#27221F] text-white py-10 px-10 rounded-t-4xl mt-20">
            <div className="container flex justify-between">
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-1 font-staatliches text-2xl font-semibold"><FaShieldDog /> Petx</div>
                        <div className="font-inter text-sm w-40">An Expert Solution for Pet Lovers</div>
                    </div>
                    <div className="container">
                        <div>
                            <div className="font-inter">Follow on Social</div>
                            <div className="flex space-x-3 mt-1">
                                <FaInstagram fontSize={22} />
                                <FaFacebook fontSize={22} />
                                <FaXTwitter fontSize={22} />
                                <FaYoutube fontSize={22} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-20">
                    <div>
                        <ul className="flex flex-col gap-2">
                            <li className="font-staatliches text-lg mb-2">Quick Links</li>
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/marketplace'>Marketplace</Link></li>
                            <li><Link to='/healthcare'>Healthcare</Link></li>
                            <li><Link to='/tracking'>Tracking</Link></li>
                            <li><Link to='/adoption'>Adoption</Link></li>
                            {/* <li><Link to='/login' className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches">Login</Link></li> */}
                        </ul>
                    </div>
                    <div>
                        <ul className="flex flex-col gap-2">
                            <li className="font-staatliches text-lg mb-2">Support</li>
                            <li><Link to='/'>Docs</Link></li>
                            <li><Link to='/'>Privacy Policy</Link></li>
                            <li><Link to='/'>Terms and Conditions</Link></li>
                            <li><Link to='/'>Code of Conduct</Link></li>
                            {/* <li><Link to='/login' className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches">Login</Link></li> */}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}
