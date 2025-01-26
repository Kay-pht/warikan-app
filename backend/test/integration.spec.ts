import request from "supertest";
import fs from "fs";
import { createApp } from "../src/app";
import { Expense, Group } from "../src/type";

const GROUP_FILE_PATH = "../data/integration/groups.json";
const EXPENSE_FILE_PATH = "../data/integration/expenses.json";

const testGroups: Group[] = [
  {
    name: "group1",
    members: ["member1", "member2"],
  },
  {
    name: "group2",
    members: ["member3", "member4"],
  },
];

const testExpenses: Expense[] = [
  {
    groupName: "group1",
    expenseName: "expense1",
    amount: 1000,
    payer: "member1",
  },
];

describe("integration test", () => {
  let app: any;

  beforeEach(() => {
    fs.writeFileSync(GROUP_FILE_PATH, JSON.stringify(testGroups));
    fs.writeFileSync(EXPENSE_FILE_PATH, JSON.stringify(testExpenses));

    app = createApp(GROUP_FILE_PATH, EXPENSE_FILE_PATH);
  });

  describe("GET /groups", () => {
    it("should return a list of groups", async () => {
      const response = await request(app).get("/groups");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(testGroups);
    });
  });

  describe("POST /groups", () => {
    it("should return a list of groups", async () => {
      const group: Group = {
        name: "group3",
        members: ["member5", "member6"],
      };
      const response = await request(app).post("/groups").send(group);
      expect(response.status).toBe(200);
      expect(response.text).toBe("グループの作成が成功しました");
    });
  });
});
