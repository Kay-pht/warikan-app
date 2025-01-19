import { Expense, Settlement } from "../type";
import { calculateSettlements } from "./settlements";

describe("calculateSettlements", () => {
  it("returns settlements based on expenses and group members", () => {
    const expenses: Expense[] = [
      {
        groupName: "groupA",
        expenseName: " expense1",
        payer: "A",
        amount: 300,
      },
      {
        groupName: "groupA",
        expenseName: "expense2",
        payer: "B",
        amount: 100,
      },
    ];
    const groupMembers = ["A", "B", "C"];

    const expectedSettlements: Settlement[] = [
      { from: "B", to: "A", amount: 34 },
      { from: "C", to: "A", amount: 133 },
    ];

    const result = calculateSettlements(expenses, groupMembers);
    expect(result).toEqual(expectedSettlements);
  });
});
