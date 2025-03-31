import { MdChat } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

export default function ChatSidebar({ current }) {

    return (
        <div className="bg-[#27221F] text-white w-[250px] h-[100%] fixed px-2 py-3 select-none">
            <div className="font-staatliches text-xl text-center my-5">Healthcare Chatbot</div>

            <div className="font-inter text-sm text-center px-3">
                Enter all your pet related queries and get instant answers from this chatbot!
            </div>

            <div className="flex justify-center mt-5">
                <div className="cursor-pointer w-fit bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches flex items-center justify-center">
                    Get Started
                </div>
            </div>

            {/* <div className="rounded-2xl mb-5 font-inter flex items-center justify-center cursor-pointer">
                <div onClick={handleNewChat} className="flex items-center space-x-2 text-sm bg-[#545353] rounded-2xl px-4 py-2">
                    <FaPlus />
                    <div>New Chat</div>
                </div>
            </div>
            <div className="bg-[#545353] rounded-2xl my-1 px-4 py-2 font-inter flex items-center space-x-2 text-sm cursor-pointer">
                <MdChat />
                <div>Get Started</div>
            </div>

            <div className="rounded-2xl my-1 px-4 py-2 font-inter flex items-center space-x-2 text-sm cursor-pointer">
                <MdChat />
                <div>What is petx</div>
            </div> */}


        </div>
    )
}
