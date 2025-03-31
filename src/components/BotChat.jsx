import React from 'react'
import { FaShieldDog } from 'react-icons/fa6'

export default function BotChat({msg}) {
    return (
        <div className="font-inter text-sm w-full my-3 justify-start flex items-start space-x-2 ">
            <FaShieldDog className="text-xl" />
            <div className="max-w-[40%]">{msg}</div>
        </div>
    )
}
