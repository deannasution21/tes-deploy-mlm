import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import cn from "../utils/class-names";
import { formatDate } from "../utils/format-date";

interface DateCellProps {
  date: Date;
  className?: string;
  dateFormat?: string;
  dateClassName?: string;
  timeFormat?: string;
  timeClassName?: string;
}

dayjs.extend(customParseFormat);

export default function DateCell({
  date,
  className,
  timeClassName,
  dateClassName,
  dateFormat = "MMMM D, YYYY",
  timeFormat = "h:mm A",
}: {
  date: string | Date;
  className?: string;
  timeClassName?: string;
  dateClassName?: string;
  dateFormat?: string;
  timeFormat?: string;
}) {
  // ✅ Safely handle both Date objects and DD-MM-YYYY strings
  let parsedDate: Date;
  if (typeof date === "string") {
    // Try parsing as DD-MM-YYYY HH:mm (your format)
    const d = dayjs(
      date,
      ["DD-MM-YYYY HH:mm", "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD"],
      true
    );
    parsedDate = d.isValid() ? d.toDate() : new Date(date);
  } else {
    parsedDate = date;
  }

  return (
    <div className={cn("grid gap-1", className)}>
      <time
        dateTime={formatDate(parsedDate, "YYYY-MM-DD")}
        className={cn("font-medium text-[12px] text-gray-700", dateClassName)}
      >
        {formatDate(parsedDate, dateFormat)}
      </time>
      <time
        dateTime={formatDate(parsedDate, "HH:mm:ss")}
        className={cn("text-[12px] text-gray-500", timeClassName)}
      >
        {formatDate(parsedDate, timeFormat)}
      </time>
    </div>
  );
}
