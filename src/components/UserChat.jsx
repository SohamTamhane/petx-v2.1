export default function UserChat({msg, img}) {
    return (
        <div className="font-inter text-sm w-full my-3 justify-end flex items-start space-x-2 ">
            <img className="w-7 rounded-full h-auto" src={img} alt="" />
            <div className="max-w-[40%]">{msg}</div>
        </div>
    )
}
