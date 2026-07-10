import React from "react";

export default function LegalPage({ title = "Privacy Policy", lastUpdated = "July 10, 2026" }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050B14] py-24 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Prose formatting for highly readable legal text */}
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-a:text-blue-600">
          <h2>1. Introduction</h2>
          <p>
            Welcome to ICT Solutions. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website.
          </p>
          
          <h2>2. The data we collect about you</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can be identified.
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          </ul>

          <h2>3. How we use your personal data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            Where we need to perform the contract we are about to enter into or have entered into with you.
          </p>
        </div>
      </div>
    </div>
  );
}