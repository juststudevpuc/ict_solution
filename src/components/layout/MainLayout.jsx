import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import {
  Menu,
  X,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Contact,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Dynamic Scroll Effect for the Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav_item = [
    { label: "About Us", href: "/about" },
    {
      label: "Services",
      // Adding the components array as "children"
      children: [
        {
          title: "Software Engineering",
          href: "/services/software-engineering",
          description:
            "Custom web and mobile app development tailored to scale your business operations.",
        },
        {
          title: "Retail & E-Commerce",
          href: "/services/ecommerce",
          description:
            "Robust POS systems and high-converting e-commerce platforms for modern retail.",
        },
        {
          title: "Maintenance & QA",
          href: "/services/qa-support",
          description:
            "Ongoing technical support, rigorous testing, and quality assurance to keep your systems flawless.",
        },
        {
          title: "Digital Media & Design",
          href: "/services/design",
          description:
            "Engaging graphic design and professional video editing to elevate your brand identity.",
        },
        {
          title: "Digital Marketing",
          href: "/services/marketing",
          description:
            "Data-driven digital marketing campaigns designed to expand your reach and drive conversions.",
        },
        {
          title: "Licensing & Hardware",
          href: "/services/hardware",
          description:
            "Reliable enterprise software licensing and premium hardware equipment for your IT infrastructure.",
        },
      ],
    },
    { label: "Industries", href: "/industries" },
    { label: "Clients", href: "/clients" },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-200 selection:text-blue-900 bg-white">
      {/* ======================================= */}
      {/* 1. DYNAMIC NAVBAR                       */}
      {/* ======================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 transition-all duration-500">
        <nav
          className={`flex items-center justify-between px-4 py-2 md:px-6 transition-all duration-500 rounded-2xl border ${
            scrolled
              ? "w-full max-w-[1200px] bg-white/70 backdrop-blur-2xl border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
              : "w-full max-w-[1300px] bg-transparent border-transparent"
          }`}
        >
          {/* 1. Brand Logo Area */}
          <div className="flex lg:flex-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xl">
                  ICT
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className={`font-bold tracking-tighter text-lg ${
                    scrolled ? "text-slate-900" : "text-white"
                  }`}
                >
                  Solution
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold">
                  Systems
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Centered) */}
          <div className="hidden lg:flex items-center gap-x-1">
            <NavigationMenu>
              <NavigationMenuList className="hidden lg:flex gap-x-2">
                {nav_item.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    {/* CONDITION 1: IF IT HAS CHILDREN (DROPDOWN) */}
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger
                          className={`text-[13px] font-bold uppercase tracking-widest bg-transparent   focus:bg-transparent data-[state=open]:bg-transparent transition-colors ${
                            scrolled
                              ? "text-slate-700 hover:text-blue-600"
                              : "text-white/90 hover:text-black"
                          }`}
                        >
                          {item.label}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white rounded-xl shadow-xl border border-slate-100">
                            {item.children.map((child) => (
                              <ListItem
                                key={child.title}
                                title={child.title}
                                href={child.href}
                              >
                                {child.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      /* CONDITION 2: STANDARD LINK */
                      <Link to={item.href}>
                        <NavigationMenuLink
                          className={`block px-4 py-2 text-[13px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                            scrolled
                              ? "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                              : "text-white/90 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 3. CTA Area */}
          <div className="flex lg:flex-1 justify-end items-center gap-4">
            <Button
              onClick={() => navigate("/contact")}
              className="hidden md:flex group relative items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5 overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>
              <span className="text-xs font-bold uppercase tracking-widest relative z-10">
                Contact Us
              </span>
              <Contact
                size={16}
                className="group-hover:translate-x-1 transition-transform relative z-10"
              />
            </Button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                scrolled
                  ? "bg-slate-100 text-slate-900"
                  : "bg-white/10 text-white backdrop-blur-md"
              }`}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* --- MOBILE MENU (FULL SCREEN OVERLAY) --- */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl" />
        <DialogPanel className="fixed inset-0 z-[70] flex flex-col p-8">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
              ICT
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/5 rounded-full text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-center gap-8">
            {nav_item.map((nav) => (
              <Link
                key={nav.label}
                to={nav.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-bold text-white hover:text-blue-500 transition-colors"
              >
                {nav.label}
              </Link>
            ))}
          </div>

          <Button className="w-full bg-blue-600 text-white py-8 rounded-2xl text-xl font-bold">
            Get Started
          </Button>
        </DialogPanel>
      </Dialog>

      {/* ======================================= */}
      {/* 2. MAIN CONTENT AREA                    */}
      {/* ======================================= */}
      {/* flex-grow ensures this takes up all space between header and footer */}
      <main className="w-full">
        <Outlet />
      </main>

      {/* ======================================= */}
      {/* 3. PREMIUM DETAILED FOOTER              */}
      {/* ======================================= */}
      <footer className="bg-[#0b1120] text-slate-400 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          {/* Top Grid Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Company Info */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                  ICT
                </div>
                <h1 className="text-white font-bold tracking-[0.15em] text-sm uppercase">
                  Solution
                </h1>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering businesses with scalable enterprise software,
                cutting-edge AI integrations, and robust IT infrastructure.
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Column 2: Services */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
                Services
              </h3>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Software Engineering
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Mobile App Development
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    AI & Machine Learning
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Digital Marketing
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    IT Consulting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
                Company
              </h3>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Details */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
                Get in Touch
              </h3>
              <ul className="flex flex-col gap-5 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    123 Tech Avenue, Innovation District
                    <br />
                    Phnom Penh, Cambodia
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-500 shrink-0" />
                  <a
                    href="tel:+85512345678"
                    className="hover:text-blue-400 transition-colors"
                  >
                    +855 12 345 678
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-500 shrink-0" />
                  <a
                    href="mailto:hello@ictsolution.com"
                    className="hover:text-blue-400 transition-colors"
                  >
                    hello@ictsolution.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Area */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
            <p>
              © {new Date().getFullYear()} ICT Solution. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={href}
            className={`block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-50 hover:text-blue-600 focus:bg-slate-50 focus:text-blue-600 ${className}`}
            {...props}
          >
            <div className="text-sm font-bold leading-none text-slate-900 mb-2">
              {title}
            </div>
            <p className="line-clamp-2 text-xs leading-snug text-slate-500">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
