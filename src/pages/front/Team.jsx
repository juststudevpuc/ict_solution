import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Mail, Phone, Eye } from "lucide-react";

// Added mock email and phone data for demonstration
const orgData = {
  ceo: {
    name: "Mr. Nhanh Nhim",
    role: "CEO & Founder",
    image: "img/people/nhim.jpg",
    // email: "nhanh.nhim@ictsolutions.com",
    phone: "+855 70 295 027",
    bio: "Visionary leader with over 15 years of experience in the tech industry, driving ICT Solutions to new heights."
  },
  deputy: {
    name: "Mrs. Va SOTHEAVY",
    role: "Deputy Director",
    image: "/img/people/sotheavy.png",
    // email: "va.sotheavy@ictsolutions.com",
    // phone: "+855 12 987 654",
  },
  departments: [
    {
      title: "Human Resources",
      members: [
        { name: "Tha Channy", role: "Human Resource", image: "img/people/Channy.jpg" },
        { name: "Choeun Dalin", role: "Human Resource", image: "img/people/Lin.jpg" },
        { name: "Hout Soriya", role: "Human Resource", image: "img/people/Soriya.jpg" },
      ],
    },
    {
      title: "Digital Marketing",
      members: [
        { name: "Vatha Chetkongkea", role: "Digital marketing", image: "img/people/Kongkea.jpg" },
        { name: "Reth Annlina", role: "Digital marketing", image: "img/people/Lyna.jpg" },
      ],
    },
    {
      title: "Video Editing",
      members: [
        { name: "Than Chantheary", role: "Video editor", image: "img/people/Theary.jpg" },
      ],
    },
    {
      title: "Mobile App Development",
      members: [
        { name: "Savean Raksmey", role: "Mobile App Developer", image: "img/people/Rasmey.jpg" },
      ],
    },
    {
      title: "UI/UX Design",
      members: [
        { name: "Phat Sopheaktra", role: "UI/UX Designer", image: "img/people/Tra.jpg" },
        { name: "Liv limey", role: "UI/UX Designer", image: "img/people/Limey.jpg" },
        { name: "Yin Prasethy Serey", role: "UI/UX Designer", image: "img/people/serey.PNG" },
      ],
    },
    {
      title: "Web Development",
      members: [
        { name: "Seth Sopeara", role: "Full-Stack Developer", image: "img/people/Ra.jpg" },
        { name: "Uy sotheary", role: "Frontend Developer", image: "img/people/Theary.jpg" },
        { name: "Chhay Lymeng", role: "Tester", image: "img/people/Lymeng.jpg" },
        { name: "Srin Rothana", role: "Backend Developer", image: "img/people/Rotana.jpg" },
        { name: "Tep Panhahsak", role: "Backend Developer", image: "img/people/Sak.jpg" },
        { name: "Roeun Vathana", role: "Backend Developer", image: "img/people/Vathana.jpg" },
        { name: "Yeong Vachekasy sothon", role: "Backend Developer", image: "img/people/Sothon.jpg" },
        { name: "Keurn Sothy", role: "Backend Developer", image: "img/people/Sothy.jpg" },
      ],
    },
  ],
};

// --- Reusable Leadership Card ---
const ProfileCard = ({ member, onClick }) => (
  <Card
    onClick={() => onClick(member)}
    className="group flex flex-col items-center p-4 transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800/60 dark:border-slate-700/50 cursor-pointer"
  >
    <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-slate-50 dark:border-slate-700 shadow-md">
      <img
        src={member.image}
        alt={member.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Image Overlay on Hover */}
      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
        <Eye className="text-white size-8" />
      </div>
    </div>
    
    <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {member.name}
    </h3>
    <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
      {member.role}
    </p>

    {/* Smooth Expanding Details on Hover */}
    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out w-full">
      <div className="overflow-hidden flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 group-hover:pt-4 transition-opacity duration-300 delay-100 text-xs text-slate-500 dark:text-slate-400">
        {/* <div className="flex items-center gap-1.5"><Mail className="size-3.5" /> {member.email || "contact@ict.com"}</div>
        <div className="flex items-center gap-1.5"><Phone className="size-3.5" /> {member.phone || "+855 000 000"}</div> */}
      </div>
    </div>
  </Card>
);

// --- Department Column ---
const DepartmentCol = ({ department, onMemberClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const lead = department.members[0];
  const team = department.members.slice(1);

  return (
    <div className="flex flex-col rounded-[1.5rem] bg-slate-50/50 dark:bg-slate-800/20 p-5 border border-slate-200 dark:border-slate-800 transition-colors h-fit">
      
      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-center mb-5 pb-4 border-b border-slate-200 dark:border-slate-700/50">
        {department.title}
      </h4>

      {/* Top Person (Lead) */}
      {lead && (
        <div 
          className="group flex flex-col items-center mb-4 cursor-pointer"
          onClick={() => onMemberClick(lead)}
        >
          <div className="relative h-20 w-20 rounded-full border-white dark:border-slate-700 shadow-sm mb-3 overflow-hidden">
            <img
              src={lead.image}
              alt={lead.name}
              className="h-30 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <Eye className="text-white size-5" />
            </div>
          </div>
          
          <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {lead.name}
          </h5>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 text-center line-clamp-1 px-2">
            {lead.role}
          </p>

          {/* Smooth Expanding Details */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out w-full">
            <div className="overflow-hidden flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:pt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {/* <div>{lead.email || "contact@ict.com"}</div> */}
              {/* <div>{lead.phone || "+855 000 000"}</div> */}
            </div>
          </div>
        </div>
      )}
      
      {/* Expandable Team Section */}
      {team.length > 0 && (
        <div className="flex flex-col items-center mt-2 w-full">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-full transition-all shadow-sm"
          >
            {isOpen ? "Hide Team" : `View Team (${team.length})`}
            {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>

          <div
            className={`grid w-full transition-all duration-300 ease-in-out ${
              isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-3 pt-2">
                {team.map((member, idx) => (
                  <div
                    key={idx}
                    onClick={() => onMemberClick(member)}
                    className="group flex flex-col bg-white dark:bg-slate-800/60 p-2.5 shadow-sm border border-slate-200 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-full border-2 border-slate-50 dark:border-slate-700 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-15 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="text-white size-3" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-[13px] text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {member.name}
                        </h5>
                        <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-0.5 line-clamp-1">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Smooth Expanding Details */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out w-full">
                      <div className="overflow-hidden flex flex-col gap-1 opacity-0 group-hover:opacity-100 group-hover:pt-2 group-hover:mt-2 group-hover:border-t group-hover:border-slate-100 dark:group-hover:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5"><Mail className="size-3" /> {member.email || "contact@ict.com"}</div>
                        <div className="flex items-center gap-1.5"><Phone className="size-3" /> {member.phone || "+855 000 000"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export default function OrganizationChart() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] p-8 transition-colors duration-300 font-sans relative">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-16 text-center pt-8">
          <div className="text-center flex justify-center items-center py-8">
            <img
              src="image.png"
              alt="ICT Solutions Logo"
              className="h-45 w-45 rounded-full object-cover dark:bg-white shadow-sm"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            ICT Solutions, Co. Ltd
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Organizational Structure
          </p>
        </div>

        {/* Leadership Section */}
        <div className="relative flex flex-col items-center">
          <div className="z-10 w-full max-w-[18rem]">
            <ProfileCard member={orgData.ceo} onClick={setSelectedMember} />
          </div>

          <div className="h-10 w-[2px] bg-slate-300 dark:bg-slate-700/60"></div>

          <div className="z-10 w-full max-w-[18rem]">
            <ProfileCard member={orgData.deputy} onClick={setSelectedMember} />
          </div>

          <div className="h-14 w-[2px] bg-slate-300 dark:bg-slate-700/60"></div>

          <div className="hidden lg:block h-[2px] w-[83.33%] bg-slate-300 dark:bg-slate-700/60"></div>

          <div className="hidden lg:flex w-[83.33%] justify-between px-[0]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-[2px] bg-slate-300 dark:bg-slate-700/60"></div>
            ))}
          </div>
        </div>

        {/* Departments Grid */}
        <div className="mt-8 lg:mt-0 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-start">
          {orgData.departments.map((dept, index) => (
            <DepartmentCol 
              key={index} 
              department={dept} 
              onMemberClick={setSelectedMember} 
            />
          ))}
        </div>
      </div>

      {/* 🔥 NEW: Profile Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="sm:max-w-md md:max-w-xl rounded-[2rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-0 overflow-hidden transition-colors">
          <DialogTitle className="sr-only">Profile Details</DialogTitle>
          
          {selectedMember && (
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Large Image */}
              <div className="w-full md:w-2/5 bg-slate-100 dark:bg-slate-800/50 p-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent dark:from-blue-500/10 z-0"></div>
                <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full  object-cover"
                  />
                </div>
              </div>

              {/* Right Side: Information */}
              <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  {selectedMember.name}
                </h2>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 inline-block bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                  {selectedMember.role}
                </p>

                {/* <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500"><Mail className="size-4" /></div>
                    <span className="font-medium">{selectedMember.email || "contact@ictsolutions.com"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500"><Phone className="size-4" /></div>
                    <span className="font-medium">{selectedMember.phone || "+855 (0) 23 000 000"}</span>
                  </div>
                </div> */}

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">About</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {selectedMember.bio || `${selectedMember.name} is a dedicated ${selectedMember.role} bringing valuable expertise and leadership to our team.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}