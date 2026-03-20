import {
  Cpu,
  Key,
  LifeBuoy,
  LineChart,
  PenTool,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function ClientPage() {
  const clients = [
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
  ];

  return (
    <div className="py-24 bg-slate-700">
      <section className="relative w-full h-100 flex flex-col justify-end pb-24 md:pb-32 overflow-hidden group">
        {/* Full Screen Background Image */}
        {/* Added 'h-full' so the image actually fills the container */}
        <img
          src="img/handshake02.webp"
          alt="ICT Center Campus"
          className="absolute inset-0 w-full h-120 object-cover scale-105 group-hover:scale-100 transition-transform duration-[3000ms] ease-out"
        />

        {/* Deep Bottom Gradient to make text pop against the image */}
        <div className="absolute inset-0 bg-gradient-to-t to-transparent z-10 " />

        {/* Minimal Text Content floating at the bottom of the image */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-12   ">
          <div className="max-w-4xl">
            <h1 className="text-white font-medium tracking-tight leading-[1.05] text-5xl sm:text-xl md:text-7xl lg:text-[3.5rem]">
              Our Client <br />
              {/* <span className="text-white/70">Engineered for scale.</span> */}
            </h1>
          </div>
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-15">
        {/* Header - Fixed text colors for Dark Mode */}
        <div className="mb-16 md:text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
            Trusted by industry leaders.
          </h2>
          <p className="text-slate-400 font-light text-lg">
            We partner with innovative companies to build, scale, and secure
            their digital infrastructure.
          </p>
        </div>

        {/* The Minimalist Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-9 w-full">
          {clients.map((client, index) => (
            <div
              key={index}
              // Changed px-8 to p-4 md:p-6 to give an even, small border of breathing room all the way around
              className="flex items-center justify-center  rounded-sm bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
            >
              {/* The Logo Image */}
              <img
                src={client.img}
                alt={client.name}
                // w-full h-full forces it to take up the whole box. object-contain stops it from stretching weirdly!
                className="w-full h-full object-contain group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
