"use client";

import { format } from "date-fns";

export function FormattedDate({ dateString }: { dateString: string }) {
  return <div>{format(new Date(dateString), "MMM d, h:mm a")}</div>;
}
