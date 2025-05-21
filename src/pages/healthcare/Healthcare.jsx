import { useContext, useEffect, useRef, useState } from "react";
import ChatSidebar from "../../components/ChatSidebar";
import { IoSend } from "react-icons/io5";
import UserChat from "../../components/UserChat";
import BotChat from "../../components/BotChat";
import { Context } from "../../config/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpinnerBtnBlack from "../../components/SpinnerBtnBlack";

export default function Healthcare() {

    const btnDivRef = useRef();
    const btnTextRef = useRef();
    const spinnerRef = useRef();
    const inputRef = useRef();

    const [prompt, setPrompt] = useState("");
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const [msgHistory, setMsgHistory] = useState([
        {
            sender: "bot",
            msg: "Welcome to Petx, How can I help you?",
        }
    ]);

    async function handleSubmit() {

        if (!user) {
            toast.error("Please Login to Access Chatbot")
            navigate('/auth/login');
        }
        else {

            btnDivRef.current.disabled = true;
            inputRef.current.disabled = true;
            btnTextRef.current.style.display = "none";
            spinnerRef.current.style.display = "block";

            setMsgHistory([...msgHistory, {
                sender: "user",
                msg: prompt
            }])
            const msg = prompt;
            setPrompt("");
            await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                "model": "meta-llama/llama-3.3-8b-instruct:free",
                "messages": [
                    {
                        "role": "user",
                        "content": `${msg}`
                    }
                ],
                "top_p": 1,
                "temperature": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
                "repetition_penalty": 1,
                "top_k": 0
            },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_API_BOT_TOKEN}` } })
                .then((res) => {
                    setMsgHistory([...msgHistory,
                    {
                        sender: "user",
                        msg: msg
                    },
                    {
                        sender: "bot",
                        msg: res.data.choices[0].message.content
                    }
                    ])
                    window.scrollTo(0, document.body.scrollHeight);
                }).catch((error) => {
                    console.log(error);
                }).finally(()=>{
                    btnDivRef.current.disabled = false;
                    inputRef.current.disabled = false;
                    btnTextRef.current.style.display = "block";
                    spinnerRef.current.style.display = "none";
                })
        }
    }

    return (
        <div className="container min-h-dvh pt-13">
            <div className="">
                <ChatSidebar current='profile' />

                <div className="no-scrollbar h-[70%] overflow-y-scroll ml-[250px] px-10 py-7 pb-40">
                    {
                        msgHistory.map((elm, index) => (
                            elm.sender === "bot" ?
                                <BotChat key={index} msg={elm.msg} />
                                :
                                <UserChat key={index} img={user?.profileImg} msg={elm.msg} />
                        ))
                    }
                </div>


                <div className="bg-(--color-bg-home) ml-[250px] px-10 py-7 fixed bottom-0 w-[calc(100%-250px)]">
                    <div className="w-full flex space-x-4">
                        <input ref={inputRef} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }} autoFocus value={prompt} onChange={(e) => setPrompt(e.target.value)} className="bg-white px-4 py-2 font-inter text-sm w-full rounded-sm" type="text" name="" id="" placeholder="Ask Anything ..." />
                        {/* <div onClick={handleSubmit} className="cursor-pointer bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches flex items-center justify-center">
                            <IoSend />
                        </div> */}
                        <button ref={btnDivRef} onClick={handleSubmit} className="cursor-pointer bg-[#FB7E46] px-3 py-[5px] rounded-sm font-staatliches flex items-center justify-center">
                            <div ref={btnTextRef}>
                                <IoSend />
                            </div>
                            <div className="hidden" ref={spinnerRef}>
                                <SpinnerBtnBlack />
                            </div>
                        </button>
                    </div>
                </div>


            </div>
        </div>
    )
}
