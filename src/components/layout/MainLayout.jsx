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
  Send,
  ShoppingBag,
  ShoppingCart,
  ArrowUpIcon,
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
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/userSlice";
// import { clearToken } from "@/store/tokenSlice";
import { clearAllCart } from "@/store/cartSlice";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

function FloatingWidgets() {
  const [isVisible, setIsVisible] = useState(false);

  // Show "Scroll to Top" only when scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
      {/* 🌙 Theme Toggler Floating Button */}
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-300 border border-slate-200 shadow-lg transition-transform hover:scale-110 active:scale-95 dark:bg-slate-800 dark:border-slate-700">
        <AnimatedThemeToggler />
      </div>

      {/* Telegram Button */}
      <a
        href="https://t.me/ictinfo1"
        target="_blank"
        rel="noreferrer"
        className="flex size-12 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <Send className="size-5 -ml-1" />
      </a>

      {/* Messenger Button */}
      {/* <a
        href="https://m.me/your_facebook_page"
        target="_blank"
        rel="noreferrer"
        className="flex size-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="size-6" />
      </a> */}

      {/* Scroll to Top Button (Fades in/out smoothly) */}
      <button
        onClick={scrollToTop}
        className={`flex size-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 dark:bg-slate-200 dark:text-slate-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <ArrowUpIcon className="size-5" />
      </button>
    </div>
  );
}

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    // 1. Clear Redux Auth & Cart
    dispatch(logout());
    // dispatch(clearToken());
    dispatch(clearAllCart()); // <-- Kills the cart in Redux memory

    // 2. Kill the browser storage completely
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root"); // <-- Default redux-persist key (if you use it)

    // Optional: If you explicitly exported your persistor, run this:
    // persistor.purge();

    // 3. Redirect
    navigate("/", { replace: true });
  };

  // Dynamic Scroll Effect for the Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav_item = [
    { label: "Home", href: "/" },
    // { label: "About Us", href: "/about" },
    { label: "Services", href: "/service" },
    // { label: "Services2", href: "/service2" },
    // { label: "Industries", href: "/industries" },
    { label: "Clients", href: "/client" },
  ];
  // 1. Grab the cart data from Redux
  const cart = useSelector((state) => state.cart);

  // 2. Calculate total items (sum of all item quantities)
  const totalItem = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + Number(item?.qty || 0), 0)
    : 0;

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-200 selection:text-blue-900 bg-white dark:dark:bg-[#050B14]">
      {/* ======================================= */}
      {/* 1. DYNAMIC NAVBAR                       */}
      {/* ======================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
          scrolled
            ? "bg-white/90 border-slate-200 shadow-sm dark:bg-[#0B1528]/90 dark:border-slate-800 dark:shadow-none py-3"
            : "bg-white border-transparent dark:bg-[#0B1528] dark:border-transparent py-5"
        }`}
      >
        {/* Your nav content here */}

        <nav className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between">
          {/* 1. Brand Logo Area */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                <img
                  src="/image.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white text-lg  leading-tight tracking-tight">
                  ICT Solution
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">
                  Co., Ltd.
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Classic Spacing) */}
          <div className="hidden lg:flex items-center space-x-1 dark:text-white">
            {nav_item.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="h-10 px-4 text-sm font-medium hover:text-blue-600 bg-transparent">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-2 p-4 bg-white shadow-lg border border-slate-100">
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
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-sm font-medium hover:text-slate-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* 3. CTA & Utility Area */}
          <div className="flex items-center gap-3">
            {/* Search or Cart - Classic Style */}
            <Link
              to={user ? "/payment" : "/auth"}
              className="relative p-2 dark:text-white hover:text-slate-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItem > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {totalItem}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block" />

            {/* Primary Action */}
            <div className="flex items-center gap-3">
              {/* Secondary Action: Clean Outline */}
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                className="hidden md:flex border-slate-200 dark:text-white dark:hover:bg-amber-50 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold uppercase tracking-widest px-5 h-10 rounded-xl transition-all active:scale-95"
              >
                Contact Us
              </Button>
              {/* 2. Conditional Logic: If user exists, show Profile. If not, show Login. */}
              {user && user.id ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0"
                    >
                      <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                        {/* Use user image if you have it, otherwise fallback to initials */}
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className="bg-[#045a8f] text-white text-xs">
                          {user?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          ["admin", "staff"].includes(user?.role)
                            ? "/admin"
                            : "/userProfile",
                        )
                      }
                    >
                      {["admin", "staff"].includes(user?.role)
                        ? "Dashboard"
                        : "Profile"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 font-medium"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="hidden md:flex bg-[#045a8f] hover:bg-[#00244d] text-white text-xs font-bold uppercase tracking-widest px-6 h-10 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
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
                to={nav.href}
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
                <div className="w-13 h-13  rounded-3xl flex items-center justify-center text-white font-black text-xl">
                  <img
                    src="/image.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-4xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h1 className="text-white font-bold tracking-[0.15em] text-2xl uppercase">
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
                  <Send size={18} />
                </a>
                {/* <a
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
                </a> */}
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
                    to="service"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Software Engineering
                  </Link>
                </li>
                <li>
                  <Link
                    to="service"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Mobile App Development
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    AI & Machine Learning
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="service"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Digital Marketing
                  </Link>
                </li>
                <li>
                  <Link
                    to="service"
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
                {/* <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Case Studies
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li> */}
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
                    Address: St240B, Road 132, Phum 06, Boeng Kak Ti Mouy, Tuol
                    Kok
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
                    092 702 175 / 096 287 5270
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-500 shrink-0" />
                  <a
                    href="mailto:hello@ictsolution.com"
                    className="hover:text-blue-400 transition-colors"
                  >
                    ictsolution3@gmail.com
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
      <FloatingWidgets />
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
