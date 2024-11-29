import fs from "fs";
import { GroupRepository } from "./groupRepository";
import { Group } from "../type";

jest.mock("fs");

describe("GroupRepository", () => {
  const mockFs = jest.mocked(fs);
  let repo: GroupRepository;

  beforeEach(() => {
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();
    repo = new GroupRepository("groups.json");
  });

  describe("loadGroups", () => {
    it("fetches groups from the file", () => {
      {
        const groups: Group[] = [
          { name: "Group A", members: ["Alice", "Bob"] },
          { name: "Group B", members: ["Charlie", "David"] },
        ];
        const mockData = JSON.stringify(groups);
        mockFs.existsSync.mockReturnValueOnce(true);
        mockFs.readFileSync.mockReturnValueOnce(mockData);
        const result = repo.loadGroups();
        expect(result).toEqual(groups);
      }
    });
    it("returns an empty array if the file does not exist", () => {
      {
        mockFs.existsSync.mockReturnValueOnce(false);
        const result = repo.loadGroups();
        expect(result).toEqual([]);
      }
    });
  });
  describe("saveGroup", () => {
    it("saves the group to the file", () => {
      const groups: Group = { name: "Group A", members: ["Alice", "Bob"] };
      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
      repo.saveGroup(groups);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "groups.json",
        JSON.stringify([groups])
      );
    });
  });
});
