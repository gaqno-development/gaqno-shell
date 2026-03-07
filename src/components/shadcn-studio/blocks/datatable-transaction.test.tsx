import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import TransactionDatatable, { type Item } from "./datatable-transaction";

const mockData: Item[] = [
  {
    id: "1",
    avatar: "",
    avatarFallback: "HR",
    name: "Hallie Richards",
    email: "h@test.com",
    amount: 100,
    status: "paid",
    paidBy: "visa",
  },
];

describe("TransactionDatatable", () => {
  it("renders table with data", () => {
    render(<TransactionDatatable data={mockData} />);
    expect(screen.getByText("Hallie Richards")).toBeInTheDocument();
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("shows no results when empty", () => {
    render(<TransactionDatatable data={[]} />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});
