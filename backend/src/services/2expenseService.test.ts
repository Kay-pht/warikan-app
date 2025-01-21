import { GroupService } from "./groupService";
import { ExpenseRepository } from "../repositories/expenseRepository";
import { ExpenseService } from "./expenseService";
import { mock } from "node:test";
import { Expense, Group } from "../type";

jest.mock("../repositories/expenseRepository");
jest.mock("../services/groupService");

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
    jest.clearAllMocks();
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
      expect(mockGroupService.getGroupByName).toHaveBeenCalledWith("group1");
      expect(mockExpenseRepository.loadExpenses).toHaveBeenCalled();
    });

    it("throw an error if no group exits", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(false);
      (mockExpenseRepository.loadExpenses as jest.Mock).mockReturnValue([
        expense,
      ]);
      expect(() => {
        expenseService.getSettlements("group1");
      }).toThrowError("グループ： group1 が存在しません");
      expect(mockExpenseRepository.loadExpenses).not.toHaveBeenCalled();
    });
  });

  describe("addExpense", () => {
    it("registers the expense", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepository.saveExpense).toHaveBeenCalledWith(expense);
    });

    it("throw error when group doesn't exist", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(false);
      expect(() => {
        expenseService.addExpense(expense);
      }).toThrowError("グループ： group1 が存在しません");
    });

    it("member doesn't exist", () => {
      const invalidExpense: Expense = {
        groupName: "group1",
        expenseName: "expense1",
        payer: "member3",
        amount: 100,
      };
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      expect(() => {
        expenseService.addExpense(invalidExpense);
      }).toThrowError("支払い者がメンバーの中にいません");
    });
  });
});
