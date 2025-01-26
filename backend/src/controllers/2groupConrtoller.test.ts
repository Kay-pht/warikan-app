import express from "express";
import { GroupService } from "../services/groupService";
import { GroupController } from "./groupController";
import { Group } from "../type";
import { mock } from "node:test";

describe("GroupController", () => {
  let mockGroupService: Partial<GroupService>;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: jest.Mock;
  let groupController: GroupController;
  const group: Group = { name: "group1", members: ["member1", "member2"] };

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

  describe("getGroupList", () => {
    it("returns a list of groups", () => {
      (mockGroupService.getGroups as jest.Mock).mockReturnValue([group]);
      groupController.getGroupList(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(mockGroupService.getGroups).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([group]);
    });

    it("calls next if an error occurs", () => {
      (mockGroupService.getGroups as jest.Mock).mockImplementation(() => {
        throw new Error("test error");
      });
      groupController.getGroupList(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe("getGroupByName", () => {
    it("returns a group by name", () => {
      req = {
        params: { name: "group1" },
      };
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
      groupController.getGroupByName(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(mockGroupService.getGroupByName).toHaveBeenCalledWith("group1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(group);
    });

    it("should throw an error for a non-existent group", () => {
      req = {
        params: { name: "group1" },
      };
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(null);
      groupController.getGroupByName(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("グループが存在しません");
    });

    it("calls next if an error occurs", () => {
      req = {
        params: { name: "group1" },
      };
      (mockGroupService.getGroupByName as jest.Mock).mockImplementation(() => {
        throw new Error("test error");
      });
      groupController.getGroupByName(
        req as express.Request,
        res as express.Response,
        next
      );
      expect(next).toHaveBeenCalled();
    });
  });
});
