import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export const Context = createContext();

const AppContext = ({children}) => {

    const [userInfo, setUserInfo] = useState();
    const [user, setUser] = useState();
    const [cookies, setCookie] = useCookies(['petx']);
    const [token, setToken] = useState();
    const [cart, setCart] = useState([]);
    const [buyNow, setBuyNow] = useState([]);

    // Fetching User Details
    async function fetchUserDetails(token){
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/details`, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        ).then((res)=>{
            setUser(res.data.user);
        }).catch((error)=>{
            console.log(error.response);
        })
    }

    useEffect(()=>{
        if(token){
            fetchUserDetails(token);
        }
    }, [token])

    useEffect(()=>{
        setToken(cookies?.petx);
    }, [cookies])

    // Cart
    useEffect(()=>{
        if(user){
            // console.log(user);
            setCart(user.profile.cart);
        }
    }, [user])
    
    return(
        <Context.Provider value={{
            userInfo, setUserInfo, user, setUser, token, setToken, fetchUserDetails, cart, setCart,
            buyNow, setBuyNow
        }}>
            {children}
        </Context.Provider>
    )
}
export default AppContext;