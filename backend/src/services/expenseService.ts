import { GroupService } from "./groupService";
import { calculateSettlements } from "../utils/settlements";
import { Expense, Settlement } from "../type";
import { ExpenseRepository } from "../repositories/expenseRepository";

export class ExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private groupService: GroupService
  ) {}
  // 清算リストを取得する
  getSettlements = (groupName: string): Settlement[] => {
    const group = this.groupService.getGroupByName(groupName);
    if (!group) {
      throw new Error(`グループ： ${groupName} が存在しません`);
    }

    // 支出データを取得し、グループ名と一致するものに絞り込む
    const expenses = this.expenseRepository
      .loadExpenses()
      .filter((expense) => expense.groupName === groupName);
    return calculateSettlements(expenses, group.members);
  };

  // 支出の登録を行う
  addExpense = (expense: Expense): void => {
    const group = this.groupService.getGroupByName(expense.groupName);
    if (!group) {
      throw new Error(`グループ： ${expense.groupName} が存在しません`);
    }

    if (!group.members.includes(expense.payer)) {
      throw new Error("支払い者がメンバーの中にいません");
    }

    this.expenseRepository.saveExpense(expense);
  };
}
