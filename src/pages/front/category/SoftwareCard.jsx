import { addItemCart } from "@/store/cartSlice";
import { request } from "@/utils/request/request";
import { ArrowRight, Maximize2, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SoftwareCard() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true); // Added missing loading state
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("product", "get");
      if (res) {
        console.log("Response Product : ", res);
        // Ensure we set the array correctly
        setProduct(res?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    // We send the item from your Laravel API directly to Redux
    dispatch(addItemCart(item));

    navigate("/subscription");

  };

  return (
    <div className="px-6 py-16 md:px-28 md:py-24 bg-slate-900 min-h-screen">
      <div className="max-w-[1400px] mx-auto mb-16">
        <div className="max-w-3xl">
          {/* 1. The Eyebrow & Accent Line */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-blue-500 rounded-full"></div>
            <span className="text-blue-400 font-semibold tracking-widest uppercase text-sm">
              Ready-to-Deploy Systems
            </span>
          </div>

          {/* 2. The Main Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Software Categories
          </h2>

          {/* 3. The Supporting Description */}
          <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
            Explore our suite of enterprise-grade applications. From Point of
            Sale to E-Commerce, we have the tools to streamline your operations
            and scale your growth.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {product.map((item, index) => (
              <div
                key={item.id || index}
                className="group flex flex-col bg-white border border-slate-200 hover:border-blue-600 rounded-xl overflow-hidden transition-colors duration-300 cursor-pointer"
              >
                {/* IMAGE SECTION */}
                <div
                  className="relative w-full h-48 sm:h-56 cursor-pointer overflow-hidden group/img bg-slate-50"
                  // Use image_url if your backend sends the full path, otherwise use image
                  onClick={() => setSelectedImage(item.image_url || item.image)}
                >
                  <img
                    src={item.image_url || item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-100 transition-transform duration-500 group-hover/img:scale-105"
                  />

                  {/* Hover Overlay: Darkens image and shows "View Image" button */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-all duration-300 shadow-lg">
                      <Maximize2 size={16} />
                      View Image
                    </div>
                  </div>
                </div>

                {/* TEXT SECTION */}
                <div className="flex flex-col flex-grow p-6 md:p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                      {/* FIXED: Changed from title to name */}
                      {item.name}
                    </h3>
                    {/* Added price display since your DB supports it! */}
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-slate-500 font-light leading-relaxed flex-grow line-clamp-3">
                    {/* FIXED: Mapped to database description */}
                    {item.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-100 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Important: Stops the button click from triggering the card's image lightbox!
                        // handleAddToCart(item); // Your cart logic will go here
                        handleAddToCart(item);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 py-3 px-4 rounded-xl font-semibold transition-all duration-300 group/btn"
                    >
                      <ShoppingCart
                        size={18}
                        className="transition-transform group-hover/btn:scale-110"
                      />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>
          <img
            src={selectedImage}
            alt="Full screen view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform scale-95 animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
