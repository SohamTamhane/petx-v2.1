import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Error from "./pages/Error"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./pages/auth/Login"
import SignupEmail from "./pages/auth/SignupEmail"
import SignupDetails from "./pages/auth/SignupDetails"
import SignupVerify from "./pages/auth/SignupVerify"
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail"
import ResetPasswordDetails from "./pages/auth/ResetPasswordDetails"
import ResetPasswordVerify from "./pages/auth/ResetPasswordVerify"
import Marketplace from "./pages/marketplace/Marketplace"
import SingleProduct from "./pages/marketplace/SingleProduct"
import Cart from "./pages/marketplace/Cart"
import PaymentSuccess from "./pages/marketplace/PaymentSuccess"
import Dashboard from "./pages/dashboard/user/Dashboard"
import UserOrders from "./pages/dashboard/user/UserOrders"
import ScrollToTop from "./ScrollToTop"
import Setting from "./pages/dashboard/user/Setting"
import SellerDashboard from "./pages/dashboard/seller/SellerDashboard"
import ManageOrder from "./pages/dashboard/seller/ManageOrder"
import ManageProducts from "./pages/dashboard/seller/ManageProducts"
import ViewAnalytics from "./pages/dashboard/seller/ViewAnalytics"
import Healthcare from "./pages/healthcare/Healthcare"
import AppContext from "./config/Context"
import Tracking from "./pages/tracking/Tracking"
import MapLocation from "./pages/tracking/MapLocation"

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <AppContext>
                <div className="bg-(--color-bg-home)">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/signup" element={<SignupEmail />} />
                        <Route path="/auth/signup/details" element={<SignupDetails />} />
                        <Route path="/auth/signup/verify" element={<SignupVerify />} />
                        <Route path="/auth/resetpass" element={<ResetPasswordEmail />} />
                        <Route path="/auth/resetpass/details" element={<ResetPasswordDetails />} />
                        <Route path="/auth/resetpass/verify/:id" element={<ResetPasswordVerify />} />

                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/payment/success/:orderid" element={<PaymentSuccess />} />
                        <Route path="/product/:slug" element={<SingleProduct />} />


                        <Route path="/user/dashboard" element={<Dashboard />} />
                        <Route path="/user/dashboard/order" element={<UserOrders />} />
                        <Route path="/user/dashboard/settings" element={<Setting />} />

                        <Route path="/seller/dashboard" element={<SellerDashboard />} />
                        <Route path="/seller/dashboard/order" element={<ManageOrder />} />
                        <Route path="/seller/dashboard/product" element={<ManageProducts />} />
                        <Route path="/seller/dashboard/analytics" element={<ViewAnalytics />} />


                        <Route path="/healthcare" element={<Healthcare />} />
                        <Route path="/tracking" element={<Tracking />} />
                        <Route path="/tracking/map" element={<MapLocation />} />
                        
                        <Route path="*" element={<Error />} />
                    </Routes>
                    {/* <Footer /> */}
                </div>
            </AppContext>
        </BrowserRouter>
    )
}

export default App
