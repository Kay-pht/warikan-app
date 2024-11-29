import { Expense, Group } from "../type";
import { ExpenseRepository } from "./../repositories/expenseRepository";
import { ExpenseService } from "./expenseService";
import { GroupService } from "./groupService";

describe("ExpenseService", () => {
  let mockGroupService: Partial<GroupService>;
  let mockExpenseRepository: Partial<ExpenseRepository>;
  let expenseService: ExpenseService;

  const group: Group = { name: "group1", members: ["member1", "member2"] };
  const expense: Expense = {
    groupName: "group1",
    expenseName: "expense1",
    payer: "member1",
    amount: 100,
  };

  beforeEach(() => {
    mockGroupService = {
      getGroupByName: jest.fn(),
    };
    mockExpenseRepository = {
      saveExpense: jest.fn(),
      loadExpenses: jest.fn(),
    };
    expenseService = new ExpenseService(
      mockExpenseRepository as ExpenseRepository,
      mockGroupService as GroupService
    );
  });
  describe("addExpense", () => {
    it("registers the expense", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepository.saveExpense).toHaveBeenCalledWith(expense);
    });
    it("throw error when group doesn't exist", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(null);
      expect(() => {
        expenseService.addExpense(expense);
      }).toThrowError("グループ： group1 が存在しません");
    });
    it("member doesn't exist", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);

      const invalidExpense = { ...expense, payer: "invalidMember" };

      expect(() => {
        expenseService.addExpense(invalidExpense);
      }).toThrowError("支払い者がメンバーの中にいません");
    });
  });

  // test cases for getSettlements
  describe("getSettlements", () => {
    it("returns settlements", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      (mockExpenseRepository.loadExpenses as jest.Mock).mockReturnValue([
        expense,
      ]);

      const settlements = expenseService.getSettlements("group1");
      expect(settlements).toEqual([
        {
          amount: 50,
          from: "member2",
          to: "member1",
        },
      ]);
    });
  });
});
