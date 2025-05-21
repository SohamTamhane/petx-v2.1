import SectionImg1 from "../../assets/section_img1.png"
import SectionImg2 from "../../assets/section_img2.png"
import SectionImg3 from "../../assets/section_img3.png"
import SectionImg4 from "../../assets/section_img4.png"
import Section2Img1 from "../../assets/section2_img1.png"
import Section2Img2 from "../../assets/section2_img2.png"
import Section2Img3 from "../../assets/section2_img3.png"
import Section2Img4 from "../../assets/section2_img4.png"
import Section3Img1 from "../../assets/section3_img1.png"

import Team1 from "../../assets/team1.jpg"
import Team2 from "../../assets/team2.png"
import Team3 from "../../assets/team3.jpeg"
import Team4 from "../../assets/team4.jpeg"
import Team5 from "../../assets/team5.jpg"

import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../../components/Footer"

export default function Home() {

    const navigate = useNavigate();

    const [slider, setSlider] = useState({
        id1: "flex",
        id2: "hidden"
    })

    const [currentId, setCurrentId] = useState("id1");
    const [count, setCount] = useState(0);

    const updateSlider = () => {
        if (currentId == "id1") {
            setSlider({ ...slider, id1: "hidden", id2: "flex", id3: "hidden", id4: "hidden", id5: "hidden" });
            setCurrentId("id2");
        }
        else if(currentId == "id2"){
            setSlider({ ...slider, id1: "hidden", id2: "hidden" , id3: "flex", id4: "hidden", id5: "hidden"  });
            setCurrentId("id3");
        }
        else if(currentId == "id3"){
            setSlider({ ...slider, id1: "hidden", id2: "hidden" , id3: "hidden", id4: "flex", id5: "hidden"});
            setCurrentId("id4");
        }
        else if(currentId == "id4"){
            setSlider({ ...slider, id1: "hidden", id2: "hidden" , id3: "hidden", id4: "hidden", id5: "flex"});
            setCurrentId("id5");
        }
        else {
            setSlider({ ...slider, id1: "flex", id2: "hidden" , id3: "hidden", id4: "hidden", id5: "hidden"});
            setCurrentId("id1");
        }
    }

    useEffect(() => {
        //Implementing the setInterval method
        const interval = setInterval(() => {
            setCount(count + 1);
            updateSlider();
        }, 2000);

        //Clearing the interval
        return () => clearInterval(interval);
    }, [count]);

    return (
        <>
            <div className="bg-(--color-bg-home)">
                <div className="container min-w-full pt-20 min-h-dvh">
                    <img src={SectionImg1} className="absolute w-[210px] left-4 animate-fade-up" alt="" />
                    <img src={SectionImg2} className="absolute w-[210px] right-4 animate-fade-up" alt="" />
                    <img src={SectionImg3} className="absolute w-[170px] bottom-4 left-38 animate-fade-up" alt="" />
                    <img src={SectionImg4} className="absolute w-[170px] bottom-4 right-38 animate-fade-up" alt="" />
                    <div className="min-w-full flex flex-col items-center">
                        <div className="text-center font-staatliches text-9xl text-wrap w-[65%] animate-fade-up">
                            Where Every Pet's Joy Begins!
                        </div>
                        <div className="text-center font-inter text-lg text-wrap w-[40%] animate-fade-up">
                            We know your pets are cherished members of your family. That's why we provide loving, personalized pet care services tailored to their needs.
                        </div>
                        <div onClick={() => navigate('/auth/login')} className="bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches mt-3 cursor-pointer animate-fade-up">Get Started</div>
                    </div>
                </div>

                <div className="container min-w-full py-15">
                    <div className="container text-center font-staatliches text-4xl">Our Services</div>
                    <div className="container flex justify-center mt-7 space-x-10">
                        <div className="cursor-pointer flex flex-col py-5 items-center justify-center container w-40 border-black border-2 rounded-xl">
                            <img className="w-auto h-25" src={Section2Img1} alt="" />
                            <div className="font-inter text-center mt-2 text-base font-semibold">Marketplace</div>
                        </div>
                        <div className="cursor-pointer flex flex-col py-5 items-center justify-center container w-40 border-black border-2 rounded-xl">
                            <img className="w-auto h-25" src={Section2Img2} alt="" />
                            <div className="font-inter text-center mt-2 text-base font-semibold">Healthcare</div>
                        </div>
                        <div className="cursor-pointer flex flex-col py-5 items-center justify-center container w-40 border-black border-2 rounded-xl">
                            <img className="w-auto h-25" src={Section2Img4} alt="" />
                            <div className="font-inter text-center mt-2 text-base font-semibold">Tracking</div>
                        </div>
                        <div className="cursor-pointer flex flex-col py-5 items-center justify-center container w-40 border-black border-2 rounded-xl">
                            <img className="w-auto h-25" src={Section2Img3} alt="" />
                            <div className="font-inter text-center mt-2 text-base font-semibold">Adoption</div>
                        </div>
                    </div>
                </div>

                <div className="container min-w-full px-10 mt-2">
                    <div className="container flex bg-[#27221F] text-white px-10 py-10 rounded-2xl">
                        <div>
                            <div className="font-staatliches text-3xl">Celebrate the Bond</div>
                            <div className="font-inter w-[70%] mt-3">Join us this season as we come together to honor the companionship and care we share with our pets. Whether through adoption, healthcare, or safety, let PetX be your partner in creating lasting memories with your beloved pets.</div>
                            <div className="mt-3">
                                <span className="cursor-pointer bg-[#FB7E46] text-[#27221F] px-3 py-[5px] rounded-sm font-staatliches"> Join Us</span>
                            </div>
                        </div>
                        <div>
                            <img src={Section3Img1} className="rounded-xl" alt="" />
                        </div>
                    </div>
                </div>


                <div className="container min-w-full px-10 mt-17">
                    <div className="container text-center font-staatliches text-4xl">Meet Our Team</div>
                    <div>
                        <div id="id1" className={`animate-fade-left animate-delay-none ${slider.id1} w-full container bg-white text-black px-10 py-10 rounded-2xl space-x-15 mt-5`}>
                            <div>
                                <img src={Team1} className="rounded-sm w-50 h-auto" alt="" />
                            </div>
                            <div>
                                <div className="font-inter w-[70%] mb-1 text-sm font-semibold">Full Stack Developer</div>
                                <div className="font-staatliches text-3xl">Soham Tamhane</div>
                                <div className="font-inter w-[70%] mt-2">As an aspiring Full Stack Developer, I am passionate about crafting secure and innovative web technologies. I am also enthusiastic about developing my management and leadership skills.</div>
                                <div className="flex space-x-3 mt-3">
                                    <FaGithub className="cursor-pointer" fontSize={22} />
                                    <FaInstagram className="cursor-pointer" fontSize={22} />
                                    <MdEmail className="cursor-pointer" fontSize={22} />
                                    <FaFacebook className="cursor-pointer" fontSize={22} />
                                </div>
                            </div>
                        </div>

                        <div id="id2" className={`animate-fade-left animate-delay-none ${slider.id2} w-full container bg-white text-black px-10 py-10 rounded-2xl space-x-15 mt-5`}>
                            <div>
                                <img src={Team2} className="rounded-sm w-55 h-40" alt="" />
                            </div>
                            <div>
                                <div className="font-inter w-[70%] mb-1 text-sm font-semibold">Full Stack Developer</div>
                                <div className="font-staatliches text-3xl">Abhijit Abdagire</div>
                                <div className="font-inter w-[70%] mt-2">As an aspiring Full Stack Developer, I am passionate about crafting secure and innovative web technologies. I am also enthusiastic about developing my management and leadership skills.</div>
                                <div className="flex space-x-3 mt-3">
                                    <FaGithub className="cursor-pointer" fontSize={22} />
                                    <FaInstagram className="cursor-pointer" fontSize={22} />
                                    <MdEmail className="cursor-pointer" fontSize={22} />
                                    <FaFacebook className="cursor-pointer" fontSize={22} />
                                </div>
                            </div>
                        </div>

                        <div id="id3" className={`animate-fade-left animate-delay-none ${slider.id3} w-full container bg-white text-black px-10 py-10 rounded-2xl space-x-15 mt-5`}>
                            <div>
                                <img src={Team3} className="rounded-sm w-55 h-40" alt="" />
                            </div>
                            <div>
                                <div className="font-inter w-[70%] mb-1 text-sm font-semibold">Frontend Developer</div>
                                <div className="font-staatliches text-3xl">Samarth Tapkire</div>
                                <div className="font-inter w-[70%] mt-2">As an aspiring Frontend Developer, I am passionate about crafting secure and innovative web technologies. I am also enthusiastic about developing my management and leadership skills.</div>
                                <div className="flex space-x-3 mt-3">
                                    <FaGithub className="cursor-pointer" fontSize={22} />
                                    <FaInstagram className="cursor-pointer" fontSize={22} />
                                    <MdEmail className="cursor-pointer" fontSize={22} />
                                    <FaFacebook className="cursor-pointer" fontSize={22} />
                                </div>
                            </div>
                        </div>

                        <div id="id4" className={`animate-fade-left animate-delay-none ${slider.id4} w-full container bg-white text-black px-10 py-10 rounded-2xl space-x-15 mt-5`}>
                            <div>
                                <img src={Team4} className="rounded-sm w-55 h-40" alt="" />
                            </div>
                            <div>
                                <div className="font-inter w-[70%] mb-1 text-sm font-semibold">Frontend Developer</div>
                                <div className="font-staatliches text-3xl">Rohit Patil</div>
                                <div className="font-inter w-[70%] mt-2">As an aspiring Frontend Developer, I am passionate about crafting secure and innovative web technologies. I am also enthusiastic about developing my management and leadership skills.</div>
                                <div className="flex space-x-3 mt-3">
                                    <FaGithub className="cursor-pointer" fontSize={22} />
                                    <FaInstagram className="cursor-pointer" fontSize={22} />
                                    <MdEmail className="cursor-pointer" fontSize={22} />
                                    <FaFacebook className="cursor-pointer" fontSize={22} />
                                </div>
                            </div>
                        </div>

                        <div id="id5" className={`animate-fade-left animate-delay-none ${slider.id5} w-full container bg-white text-black px-10 py-10 rounded-2xl space-x-15 mt-5`}>
                            <div>
                                <img src={Team5} className="rounded-sm w-55 h-40" alt="" />
                            </div>
                            <div>
                                <div className="font-inter w-[70%] mb-1 text-sm font-semibold">Frontend Developer</div>
                                <div className="font-staatliches text-3xl">Anish Pandat</div>
                                <div className="font-inter w-[70%] mt-2">As an aspiring Frontend Developer, I am passionate about crafting secure and innovative web technologies. I am also enthusiastic about developing my management and leadership skills.</div>
                                <div className="flex space-x-3 mt-3">
                                    <FaGithub className="cursor-pointer" fontSize={22} />
                                    <FaInstagram className="cursor-pointer" fontSize={22} />
                                    <MdEmail className="cursor-pointer" fontSize={22} />
                                    <FaFacebook className="cursor-pointer" fontSize={22} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="flex items-center space-x-2 mt-2">
                            <div onClick={updateSlider} className="cursor-pointer bg-white p-2 rounded-2xl">
                                <FaArrowLeftLong fontSize={20} />
                            </div>
                            <div onClick={updateSlider} className="cursor-pointer bg-white p-2 rounded-2xl">
                                <FaArrowRightLong fontSize={20} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    )
}