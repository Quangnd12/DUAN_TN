import React from "react";
import OrderList from "./component/list";

const Order = () => {
    return (
        <div className="pt-10"> 
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
             <OrderList/>
            </div>                  
        </div>
    </div>
    )
}

export default Order;