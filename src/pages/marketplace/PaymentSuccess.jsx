import { useParams } from "react-router-dom";
import PaymentSuccessImg from "../../assets/payment-success.gif";

export default function PaymentSuccess() {

    const {orderid} = useParams();

    return (
        <div className="bg-(--color-bg-home) container min-w-full min-h-dvh flex flex-col items-center justify-center">
            <div>
                <img src={PaymentSuccessImg} alt="" />
            </div>
            <div className="text-center font-staatliches text-5xl mt-5">
                Order Placed Successful !
            </div>
            <div className="text-center font-staatliches text-xl mt-3">
                OrderId - #{orderid}
            </div>
        </div>
    )
}