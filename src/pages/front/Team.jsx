import React from "react";
import { Card } from "@/components/ui/card"; // Assuming you use shadcn/ui

const orgData = {
  ceo: {
    name: "Mr. Nhanh Nhim",
    role: "CEO & Founder",
    image: "img/people/nhim.jpg",
  },
  deputy: {
    name: "Mrs. Va SOTHEAVY",
    role: "Deputy Director",
    image: "/api/placeholder/150/150",
  },
  departments: [
    {
      title: "Human Resources",
      members: [
        {
          name: "Tha Channy",
          role: "Human Resource",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Choeun Dalin",
          role: "Human Resource",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Hout Soriya",
          role: "Human Resource",
          image: "/api/placeholder/150/150",
        },
      ],
    },
    {
      title: "Digital Marketing",
      members: [
        {
          name: "Vatha Chetkongkea",
          role: "Digital marketing",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Reth annlina",
          role: "Digital marketing",
          image: "/api/placeholder/150/150",
        },
      ],
    },
    {
      title: "Video Editing",
      members: [
        {
          name: "Than Chantheary",
          role: "Video editor",
          image: "/api/placeholder/150/150",
        },
      ],
    },
    {
      title: "Mobile App Development",
      members: [
        {
          name: "Savean Raksmey",
          role: "Mobile App Developer",
          image: "/api/placeholder/150/150",
        },
      ],
    },
    {
      title: "UI/UX Design",
      members: [
        {
          name: "Phat Sopheaktra",
          role: "UI/UX Designer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Liv limey",
          role: "UI/UX Designer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Yin Prasethy Serey",
          role: "UI/UX Designer",
          image: "/api/placeholder/150/150",
        },
      ],
    },
    {
      title: "Web Development",
      members: [
        {
          name: "Seth Sopeara",
          role: "Full-Stack Developer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Uy sotheary",
          role: "Frontend Developer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Chhay Lymeng",
          role: "Tester",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Srin Rothana",
          role: "Backend Developer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Tep Panhahsak",
          role: "Backend Developer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Roeun Vathana",
          role: "Backend Developer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Yeong Vachekasy sothon",
          role: "Backend Developer",
          image: "/api/placeholder/150/150",
        },
        {
          name: "Keurn Sothy",
          role: "Backend Developer",
          image: "/api/placeholder/150/150",
        },
      ],
    },
  ],
};

// Reusable component for a single person's card
const ProfileCard = ({ member, isLeadership = false }) => (
  <Card
    className={`flex flex-col items-center p-6 transition-all duration-300 hover:shadow-lg ${
      isLeadership
        ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50"
        : "bg-white dark:bg-slate-800/60 dark:border-slate-700/50"
    }`}
  >
    <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-slate-800 shadow-md">
      <img
        src={member.image}
        alt={member.name}
        className="h-full w-full object-cover"
      />
    </div>
    <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white tracking-tight">
      {member.name}
    </h3>
    <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
      {member.role}
    </p>
  </Card>
);

// Reusable component for a department column
const DepartmentCol = ({ department }) => (
  <div className="flex flex-col rounded-[1.5rem] bg-slate-50/50 dark:bg-slate-800/20 p-5 border border-slate-200 dark:border-slate-800 transition-colors">
    <h4 className="mb-6 text-center font-bold text-slate-800 dark:text-slate-100 pb-4 border-b border-slate-200 dark:border-slate-700/50">
      {department.title}
    </h4>
    <div className="flex flex-col gap-4">
      {department.members.map((member, idx) => (
        <div
          key={idx}
          className="group flex items-center bg-white dark:bg-slate-800/60 p-3 shadow-sm border border-slate-200 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300"
        >
          <img
            src={member.image}
            alt={member.name}
            className="h-10 w-10 rounded-full object-cover border-2 border-slate-50 dark:border-slate-700 group-hover:scale-105 transition-transform"
          />
          <div>
            <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {member.name}
            </h5>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
              {member.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function OrganizationChart() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] p-8 transition-colors duration-300 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 text-center pt-8">
          <div className="text-center flex justify-center items-center py-8">
            <img
              // src="logo_ict_solu.png"
              src="image.png"
              alt="ICT Solutions Logo"
              className="h-45 w-45 rounded-full object-cover dark:bg-white shadow-sm "
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
          {/* CEO */}
          <div className="z-10 w-full max-w-[18rem]">
            <ProfileCard member={orgData.ceo} isLeadership={true} />
          </div>

          {/* Vertical Connecting Line */}
          <div className="h-10 w-[2px] bg-slate-300 dark:bg-slate-700/60"></div>

          {/* Deputy Director */}
          <div className="z-10 w-full max-w-[18rem]">
            <ProfileCard member={orgData.deputy} isLeadership={true} />
          </div>

          {/* Vertical Connecting Line to Departments */}
          <div className="h-14 w-[2px] bg-slate-300 dark:bg-slate-700/60"></div>

          {/* Horizontal Connecting Line (Desktop Only) */}
          <div className="hidden lg:block h-[2px] w-[83.33%] bg-slate-300 dark:bg-slate-700/60"></div>

          {/* Small vertical stubs for departments (Desktop Only) */}
          <div className="hidden lg:flex w-[83.33%] justify-between px-[0]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-[2px] bg-slate-300 dark:bg-slate-700/60"
              ></div>
            ))}
          </div>
        </div>

        {/* Departments Grid */}
        <div className="mt-8 lg:mt-0 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {orgData.departments.map((dept, index) => (
            <DepartmentCol key={index} department={dept} />
          ))}
        </div>
      </div>
    </div>
  );
}
