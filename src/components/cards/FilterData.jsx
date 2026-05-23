import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Added status and setStatus to the props
export default function FilterData({
  date,
  setDate,
  status,
  setStatus,
  onFilter,
}) {
  return (
    // Note: I changed w-[30%] to w-auto so the new dropdown has enough room to breathe!
    <div className="flex w-auto items-center gap-4">
      {/* 1. Input Container: Date Picker */}
      <div className="relative min-w-[200px]">
        <div className="absolute inset-y-0 start-0 flex pointer-events-none items-center ps-3">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-heading rounded-base border-default-medium focus:border-brand focus:ring-brand bg-neutral-secondary-medium shadow-xs placeholder:text-body block w-full border px-3 py-2.5 pe-3 ps-9 text-sm focus:outline-none"
        />
      </div>

      {/* 2. Input Container: Status Dropdown */}
      <div>
        {/* <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-heading rounded-base border-default-medium focus:border-brand focus:ring-brand bg-neutral-secondary-medium shadow-xs block w-full border px-3 py-2.5 text-sm focus:outline-none min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select> */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-heading rounded-base border-default-medium focus:border-brand focus:ring-brand bg-neutral-secondary-medium shadow-xs block w-full border px-3 py-2.5 text-sm focus:outline-none min-w-[150px]"
        >
          {/* We remove pending, because pending lives on the Request page now! */}
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* 3. Filter Button */}
      <div>
        <Button
          onClick={onFilter}
          type="button"
          className={"bg-blue-500 hover:bg-sky-400 "}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}
