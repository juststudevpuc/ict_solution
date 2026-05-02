import React from "react";

import { addItemCart, clearItemCart, decrementCart } from "@/store/cartSlice";
import { Minus, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CartCard = ({ data }) => {
  // const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  // const totalItem = cart?.reduce((acc, item) => acc + item?.qty, 0);
  return (
    <div className="">
      {/* <div className="">
        <h1>item : {totalItem} </h1>
      </div> */}
      <Card className="p-3 flex flex-row gap-4 items-center bg-slate-50/50 border-slate-100">
        {/* Product Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white shadow-sm">
          <img
            className="w-full h-full object-cover"
            src={data?.image_url}
            alt={data?.name}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 truncate">{data?.name}</p>
          <p className="text-xs text-blue-600 font-medium">
            {data?.category?.name || "Software"}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center border rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => dispatch(decrementCart(data))}
                className="p-1 hover:bg-slate-100 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-sm font-bold text-slate-700 border-x">
                {data?.qty}
              </span>
              <button
                onClick={() => dispatch(addItemCart(data))}
                className="p-1 hover:bg-slate-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="text-sm font-bold text-slate-900">
              ${(Number(data?.price) * Number(data?.qty)).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => dispatch(clearItemCart(data))}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          <X size={18} />
        </button>
      </Card>
    </div>
  );
};

export default CartCard;
