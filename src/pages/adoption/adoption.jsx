import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import PetCard from "../../components/PetCard";
import BgPink from "../../assets/bg-pink.png";
import Footer from "../../components/Footer";


export default function adoption() {
  const ref1 = useRef();
  const ref2 = useRef();

  const [dogPets, setDogPets] = useState(undefined);
  const [catPets, setCatPats] = useState(undefined);
  const[other, setOther] = useState(undefined);

  async function fetchDogPets(){
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/adopt/category`,{category: "Dog"}
        ).then((res) => {
            setDogPets(res.data.pets);
            // console.log(res.data);
        }).catch((error) => {
            console.log(error.response);
        })
  }

  async function fetchCatPets(){
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/adopt/category`,{category: "Cat"}
    ).then((res) => {
        setCatPats(res.data.pets);
        // console.log(res.data);
    }).catch((error) => {
        console.log(error.response);
    })
}

  useEffect(() =>{
    fetchDogPets();
    fetchCatPets();
  }, []);

  return (
    <>
         <div className="container min-h-dvh pt-20">
      <div className="">
        <div className="container font-staatliches text-6xl text-center mt-4">
          Looking to Adopt a Pet?
        </div>
        <div className="container font-inter text-center flex items-center justify-center mt-2">
          <div className="w-[50%]">
            You'r come to the right place! We provide healthy puppies and dogs
            for adoption in India.Urgent Need for pet adopters near me. Pets for
            adoption in India - Find puppies and dogs for adoption in India.
           
            Mr n Mrs Pet with the absolute responsibility of completing your
            family with <br /> your dream companion and giving pets a loving
            home.
          </div>
        </div>

        <div className="mt-12">
          <div className="font-staatliches text-center text-4xl">Dog Pets</div>
          <div className="flex items-center justify-center">
            <div
              ref={ref1}
              className="no-scrollbar scroll-smooth flex w-[80%] overflow-x-scroll items-center mt-6 gap-x-7"
            >
              {dogPets?.map((elm, index) => (
                <PetCard
                  id={elm._id}
                  pImg={elm.img[0]}
                  bgImg={BgPink}
                  name={elm.name}
                  age={elm.age}
                  gender={elm.gender}
                  category={elm.category}
                  price={elm.price}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex items-center space-x-2 mt-2">
              <div
                onClick={() => (ref1.current.scrollLeft -= 100)}
                className="cursor-pointer bg-white p-2 rounded-2xl"
              >
                <FaArrowLeftLong fontSize={20} />
              </div>
              <div
                onClick={() => (ref1.current.scrollLeft += 100)}
                className="cursor-pointer bg-white p-2 rounded-2xl"
              >
                <FaArrowRightLong fontSize={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="font-staatliches text-center text-4xl">Cats Pets</div>
          <div className="flex items-center justify-center">
            <div
              ref={ref1}
              className="no-scrollbar scroll-smooth flex w-[80%] overflow-x-scroll items-center mt-6 gap-x-7"
            >
              {catPets?.map((elm, index) => (
                <PetCard
                  id={elm._id}
                  pImg={elm.img[0]}
                  bgImg={BgPink}
                  name={elm.name}
                  age={elm.age}
                  gender={elm.gender}
                  category={elm.category}
                  price={elm.price}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex items-center space-x-2 mt-2">
              <div
                onClick={() => (ref1.current.scrollLeft -= 100)}
                className="cursor-pointer bg-white p-2 rounded-2xl"
              >
                <FaArrowLeftLong fontSize={20} />
              </div>
              <div
                onClick={() => (ref1.current.scrollLeft += 100)}
                className="cursor-pointer bg-white p-2 rounded-2xl"
              >
                <FaArrowRightLong fontSize={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
