import React from "react";
import { addItemCart, clearItemCart, decrementCart } from "@/store/cartSlice";
import { Minus, Plus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Card } from "@/components/ui/card";

const CartCard = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <Card className="group p-3 flex flex-row gap-4 items-center bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden">
      
      {/* Product Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-50 dark:border-slate-700/50 shadow-sm relative bg-slate-50 dark:bg-slate-900">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={data?.image_url || "/placeholder-image.png"}
          alt={data?.name || "Product image"}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
        <div className="pr-6">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate transition-colors">
            {data?.name || "Unknown Product"}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-0.5">
            {data?.category?.name || "Software"}
          </p>
        </div>

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm font-black text-slate-900 dark:text-white">
            ${(Number(data?.price || 0) * Number(data?.qty || 1)).toFixed(2)}
          </p>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-sm h-8 transition-colors">
            <button
              onClick={() => dispatch(decrementCart(data))}
              className="w-8 h-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white active:bg-slate-100 dark:active:bg-slate-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            
            <span className="w-8 h-full flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 border-x border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
              {data?.qty || 1}
            </span>
            
            <button
              onClick={() => dispatch(addItemCart(data))}
              className="w-8 h-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white active:bg-slate-100 dark:active:bg-slate-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button (Top Right Absolute for cleaner layout) */}
      <button
        onClick={() => dispatch(clearItemCart(data))}
        className="absolute top-2 right-2 p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all duration-200"
        aria-label="Remove item"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
      
    </Card>
  );
};

export default CartCard;