import { useContext, useEffect } from "react";
import { Context } from "../config/Context";

export default function DashboardName() {

    const {user, userInfo, setUser} = useContext(Context);

    return (
        <div className="flex items-center space-x-3">
            <img className="w-25 rounded-full h-auto" src={user?.profileImg} alt="" />
            <div>
                <div className="font-staatliches text-3xl">{user?.name}</div>
                <div className="font-inter text-sm font-semibold">@{user?.username}</div>
            </div>
        </div>
    )
}
