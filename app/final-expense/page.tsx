import { pageMetadata } from "@/lib/seo";
import FinalExpenseClient from "./FinalExpenseClient";

export const metadata = pageMetadata({
  title: "Final Expense Insurance | Dustin McCormick | Licensed Nationwide",
  description:
    "Final expense insurance to help cover funeral costs and end-of-life expenses. Get a free assessment from an independent agent.",
  path: "/final-expense",
});

export default function FinalExpensePage() {
  return <FinalExpenseClient />;
}

/*
---
*Last updated: 2026-04-14 19:00 ET | Updated by: Claude Code*
*/
