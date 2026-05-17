import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; // Assuming you are using shadcn/ui
import { Button } from "@/components/ui/button"; // Optional: Use standard buttons or custom divs

export default function RemarkInput() {
  const [remark, setRemark] = useState("");

  // 1. Define your quick-select options
  const quickOptions = ["Booking", "Half Paid", "Full Paid", "Pending Call"];

  // 2. Handle clicking an option
  const handleOptionClick = (optionText) => {
    setRemark((prev) => {
      // If the textarea is empty, just set the option. 
      // If it has text, append the new option with a comma or space.
      if (!prev) return optionText;
      
      // Prevent adding the exact same tag twice in a row (optional)
      if (prev.includes(optionText)) return prev;

      return `${prev}, ${optionText}`;
    });
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      {/* 3. Render the quick-select buttons */}
      <div className="flex flex-wrap gap-2">
        {quickOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            type="button" // Important so it doesn't submit forms accidentally
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-colors active:scale-95"
          >
            + {option}
          </button>
        ))}
      </div>

      {/* 4. Your existing Textarea */}
      <Textarea
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Add a note or select an option above (Optional)"
        className="rounded-xl min-h-[80px]"
      />
    </div>
  );
}