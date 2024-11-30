import React from "react";
import OrderList from "./component/list";

const Order = () => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-4">
             <OrderList/>
            </div>                  
        </div>
    )
}

export default Order;