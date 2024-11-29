import express from "express";
import { GroupService } from "../services/groupService";
import { GroupController } from "./groupController";
import { Group } from "../type";

describe("GroupController", () => {
  let mockGroupService: Partial<GroupService>;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: jest.Mock;
  let groupController: GroupController;

  //   const group: Group = { name: "group1", members: ["member1", "member2"] };
  //   const groups: Group[] = [{}];

  beforeEach(() => {
    mockGroupService = {
      getGroups: jest.fn(),
      addGroup: jest.fn(),
      getGroupByName: jest.fn(),
    };
    groupController = new GroupController(mockGroupService as GroupService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("addGroup", () => {
    it("register the group correctly", () => {
      const group: Group = { name: "group1", members: ["member1", "member2"] };
      req.body = group;
      (mockGroupService.getGroups as jest.Mock).mockReturnValueOnce([]);
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(mockGroupService.addGroup).toHaveBeenCalledWith(group);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it("validation error, group name is required", () => {
      const invalidGroup: Group = { name: "", members: ["member1", "member2"] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["グループ名は必須です"]);
    });
    it("validation error, more than two members are required", () => {
      const invalidGroup: Group = { name: "group1", members: ["member1"] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["メンバーは2人以上必要です"]);
    });
    it("validation error, same person cannot be registered at the same time", () => {
      const invalidGroup: Group = {
        name: "group1",
        members: ["member1", "member1"],
      };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["メンバー名が重複しています"]);
    });
  });
});
