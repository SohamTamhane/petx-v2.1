import SellerSidebar from "../../../components/SellerSidebar";
import { Chart } from "react-google-charts";

export default function ViewAnalytics() {

    const data = [
        ["Category", "Sales"],
        ["Food", 1000],
        ["Accessories", 500],
        ["Others", 100],
    ];

    const options = {
        title: "Category-wise Sales",
    };

    return (
        <div className="container min-h-dvh pt-13">
            <div className=" ">

                <SellerSidebar current='analytics' />

                <div className="h-auto ml-[250px] px-10 py-7">
                    <div className="flex items-center space-x-3">
                        <img className="w-25 rounded-full h-auto" src="https://api.dicebear.com/5.x/initials/svg?seed=Soham%20Tamhane" alt="" />
                        <div>
                            <div className="font-staatliches text-3xl">Soham Tamhane</div>
                            <div className="font-inter text-sm font-semibold">@sohamtamhane</div>
                        </div>
                    </div>

                    <div className="mt-10 px-2">
                        <div className="font-staatliches text-xl mb-3">Category-wise Sales</div>
                        <Chart
                            chartType="PieChart"
                            data={data}
                            options={options}
                            width={"100%"}
                            height={"400px"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
