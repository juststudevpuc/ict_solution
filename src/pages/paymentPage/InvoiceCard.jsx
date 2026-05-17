import { forwardRef, useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { useSelector } from "react-redux";
import { request } from "@/utils/request/request";

const InvoiceCard = forwardRef((props, ref) => {
  const cart = useSelector((state) => state.cart) || [];

  const subtotal = cart.reduce((acc, item) => acc + Number(item?.price || 0) * Number(item?.qty || 0), 0);
  
  const totalDiscount = cart.reduce((acc, item) => {
    const itemTotal = Number(item?.price || 0) * Number(item?.qty || 0);
    const itemDiscount = Number(item?.discount || 0);
    return acc + (itemTotal * (itemDiscount / 100));
  }, 0);

  const grandTotal = subtotal - totalDiscount;

  const [order, setOrder] = useState([]);
  const [me, setMe] = useState(null);


  const fetchingData = async () => {
    const order = await request("order" , "get")
    const res = await request("me", "get");
    if (res) {
      setMe(res?.user);
    }

  }
  useEffect(() => {
    fetchingData();
  }, []);

  return (
    // Reduced outer padding (p-8 instead of p-12)
    <div ref={ref} className="bg-white text-slate-900 w-full max-w-4xl mx-auto p-8">
      {/* Reduced inner padding (p-6 instead of p-8) */}
      <div className="border-2 border-slate-800 p-6">
        
        {/* ===== 1. HEADER ===== */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-3">
            {/* Reduced Logo Size (w-14 h-14 instead of w-20) */}
            <div className="w-14 h-14 border border-slate-300 flex items-center justify-center p-1">
              <img
                className="w-full h-full object-contain"
                src={logo}
                alt="ICT Solution Logo"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            <div>
              {/* Reduced title text */}
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">ICT Solution</h2>
              {/* <p className="text-xs text-slate-600 mt-0.5">Bekchan, Anksnoul</p>
              <p className="text-xs text-slate-600">Kandal, Cambodia</p>
              <p className="text-xs text-slate-600 mt-0.5">Tel: +855 XX XXX XXX</p> */}
            </div>
          </div>

          <div className="text-right">
            {/* Reduced Invoice Title (text-4xl instead of 5xl) */}
            <h1 className="text-4xl font-black tracking-widest text-slate-900 uppercase mb-3">Invoice</h1>
            <div className="grid grid-cols-2 gap-x-4 text-xs bg-slate-100 p-2 border border-slate-800">
              <p className="font-bold text-slate-700 text-left">INVOICE NO:</p>
              <p className="font-mono text-slate-900 text-right">INV-{Date.now().toString().slice(-6)}</p>
              
              <p className="font-bold text-slate-700 text-left mt-1">DATE:</p>
              <p className="font-mono text-slate-900 text-right mt-1">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        {/* ===== 2. BILLING INFO ===== */}
        {}
        <div className="grid grid-cols-2 gap-10 mb-6">
          <div>              
            <div className="bg-slate-800 text-white uppercase text-[10px] font-bold py-1 px-2 mb-1.5 inline-block">
              Bill To
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase">Walk-in Customer</h3>
            <p className="text-xs text-slate-600">Customer:{me?.name}</p>
            <p className="text-xs text-slate-600">Phone:N/A</p>
            
          </div>
          <div className="text-right">
             <div className="bg-slate-800 text-white uppercase text-[10px] font-bold py-1 px-2 mb-1.5 inline-block">
              Status
            </div>
            <h3 className="text-base font-bold uppercase text-slate-900">Paid</h3>
          </div>
        </div>

        {/* ===== 3. PURE HTML TABLE (Fixes the print scrollbar!) ===== */}
        <div className="mb-8">
          <table className="w-full table-fixed border-collapse border border-slate-800">
            <thead className="bg-slate-200 border-b-2 border-slate-800">
              <tr>
                <th className="w-10 border-r border-slate-400 py-2 text-center text-[10px] font-bold uppercase text-slate-900">Item</th>
                {/* Description takes remaining space */}
                <th className="border-r border-slate-400 py-2 px-3 text-left text-[10px] font-bold uppercase text-slate-900">Description</th>
                <th className="w-16 border-r border-slate-400 py-2 text-center text-[10px] font-bold uppercase text-slate-900">Qty</th>
                <th className="w-24 border-r border-slate-400 py-2 px-2 text-right text-[10px] font-bold uppercase text-slate-900">Unit Price</th>
                <th className="w-24 py-2 px-2 text-right text-[10px] font-bold uppercase text-slate-900">Line Total</th>
              </tr>
            </thead>
            
            <tbody>
              {cart.length > 0 ? (
                cart.map((item, index) => {
                  const itemTotal = Number(item?.qty || 0) * Number(item?.price || 0);
                  return (
                    <tr key={index} className="border-b border-slate-300 align-top">
                      <td className="border-r border-slate-300 py-3 text-center font-mono text-xs text-slate-900">{index + 1}</td>
                      
                      {/* Description Cell */}
                      <td className="border-r border-slate-300 py-3 px-3">
                        <p className="font-bold text-xs text-slate-900 uppercase">{item?.name || "Unknown Item"}</p>
                        
                        {item?.description && (
                          <div className="text-[10px] text-slate-700 mt-1.5 space-y-0.5 whitespace-pre-wrap break-words pr-2">
                            {item.description.split('\n').map((line, i) => {
                              const trimmedLine = line.trim();
                              if (!trimmedLine) return <div key={i} className="h-1"></div>;
                              
                              if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                                return (
                                  <div key={i} className="flex items-start gap-1.5 ml-1">
                                    <span className="font-bold text-slate-500">•</span>
                                    <span className="break-words w-full leading-snug">{trimmedLine.substring(1).trim()}</span>
                                  </div>
                                );
                              }
                              return <p key={i} className="leading-snug break-words">{trimmedLine}</p>;
                            })}
                          </div>
                        )}
                        
                        {item?.discount > 0 && (
                          <p className="text-[10px] text-slate-900 font-bold mt-1.5">Discount: {item.discount}%</p>
                        )}
                      </td>

                      <td className="border-r border-slate-300 py-3 text-center font-mono text-xs text-slate-900">{item?.qty || 0}</td>
                      <td className="border-r border-slate-300 py-3 px-2 text-right font-mono text-xs text-slate-900">${Number(item?.price || 0).toFixed(2)}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-xs text-slate-900">${itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-500 italic">
                    No items on this invoice.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== 4. FINANCIAL SUMMARY ===== */}
        <div className="flex justify-end mb-10">
          <div className="w-full max-w-[280px] border border-slate-800">
            <div className="flex justify-between p-2 border-b border-slate-300 text-xs">
              <span className="font-bold uppercase text-slate-700">Subtotal</span>
              <span className="font-mono text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            
            {totalDiscount > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300 text-xs bg-slate-50">
                <span className="font-bold uppercase text-slate-700">Discount</span>
                <span className="font-mono text-slate-900">-${totalDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between p-2 border-b-2 border-slate-800 text-xs">
              <span className="font-bold uppercase text-slate-700">Tax (0%)</span>
              <span className="font-mono text-slate-900">$0.00</span>
            </div>
            
            <div className="flex justify-between p-2.5 bg-slate-200">
              <span className="text-base font-black uppercase text-slate-900">Total Due</span>
              <span className="text-lg font-black font-mono text-slate-900">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ===== 5. FOOTER & TERMS ===== */}
        <div className="grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-bold uppercase text-slate-900 border-b border-slate-800 mb-1.5 inline-block text-[10px]">Terms & Conditions</p>
            <p className="text-slate-600 text-[10px] leading-relaxed">Payment is due upon receipt. All custom software developments include a 30-day warranty. Please make checks payable to ICT Solution.</p>
          </div>
          <div className="text-center pt-6">
            <div className="border-t border-slate-800 w-3/4 mx-auto pt-1.5">
              <p className="font-bold uppercase text-slate-900 text-[10px]">Authorized Signature</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default InvoiceCard;