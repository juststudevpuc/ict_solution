import { ArrowRight, Maximize2, X } from "lucide-react";
import { useState } from "react";

export default function SoftwareCard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const softwareCard = [
    {
      image: "/img/software/pos.png",
      title: "Point of Sale (POS)",
      description:
        "Streamline retail operations with fast, secure, and intuitive sales tracking systems.",
    },
    {
      image: "/img/software/eco.png",
      title: "E-Commerce Solutions",
      description:
        "Build powerful, scalable online stores designed to convert visitors into loyal customers.",
    },
    {
      image: "/img/software/web.png",
      title: "Web Applications",
      description:
        "Custom, responsive web platforms engineered for speed, security, and growth.",
    },
    {
      image: "/img/software/edu.png",
      title: "EdTech Systems",
      description:
        "Smart management and e-learning tools for schools, universities, and training centers.",
    },
    {
      image: "/img/software/system.png",
      title: "Enterprise Systems (ERP)",
      description:
        "Centralize your business data and automate workflows with robust management software.",
    },
  ];
  return (
    <div className="px-24 py-18 bg-slate-900">
      <div className="text-2xl py-14 text-slate-100">
        <h1>Software Categories : </h1>
      </div>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {softwareCard.map((serveSell, index) => (
            <div
              key={index}
              // 1. CARD CONTAINER: Removed p-8. Added overflow-hidden and rounded corners
              // so the image doesn't poke outside the rounded edges.
              className="group flex flex-col bg-white border border-slate-200 hover:border-blue-600 overflow-hidden transition-colors duration-300 cursor-pointer"
            >
              {/* 2. IMAGE SECTION: Edge-to-edge. Increased height (h-48) so it looks proportional */}
              <div
                className="relative w-full h-48 sm:h-48 cursor-pointer overflow-hidden group/img bg-slate-50"
                onClick={() => setSelectedImage(serveSell.image)}
              >
                <img
                  src={serveSell.image}
                  alt={serveSell.title}
                  // Changed object-contain to object-cover so it completely fills the space.
                  // (If parts of your logo get cut off, you can change it back to object-contain)
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

              {/* 3. TEXT SECTION: We moved the p-6/p-8 padding down here! */}
              <div className="flex flex-col flex-grow p-6 md:p-8">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-3">
                  {serveSell.title}
                </h3>

                <p className="text-slate-500 font-light leading-relaxed flex-grow">
                  {serveSell.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* for view */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setSelectedImage(null)} // Closes modal if you click the background
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>

          {/* The Full-Size Image */}
          <img
            src={selectedImage}
            alt="Full screen view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform scale-95 animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // Prevents closing if you click the image itself
          />
        </div>
      )}
    </div>
  );
}
