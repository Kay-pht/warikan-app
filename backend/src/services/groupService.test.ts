import { GroupRepository } from "../repositories/groupRepository";
import { Group } from "../type";
import { GroupService } from "./groupService";

describe("GroupService", () => {
  let mockGroupRepository: Partial<GroupRepository>;
  let groupService: GroupService;

  const group = { name: "group1", members: ["member1", "member2"] };

  beforeEach(() => {
    mockGroupRepository = {
      loadGroups: jest.fn(),
      saveGroup: jest.fn(),
    };
    groupService = new GroupService(mockGroupRepository as GroupRepository);
  });

  describe("getGroups", () => {
    it("get groups", () => {
      (mockGroupRepository.loadGroups as jest.Mock).mockReturnValue([group]);
      expect(groupService.getGroups()).toEqual([group]);
      expect(mockGroupRepository.loadGroups).toHaveBeenCalled();
    });
  });

  describe("getGroupByName", () => {
    it("should return a group by name", () => {
      (mockGroupRepository.loadGroups as jest.Mock).mockReturnValue([group]);
      const targetGroup = groupService.getGroupByName("group1");
      expect(targetGroup).toEqual(group);
    });

    it("should return undefined if group doesn't exist", () => {
      (mockGroupRepository.loadGroups as jest.Mock).mockReturnValue([group]);
      const targetGroup = groupService.getGroupByName("group2");
      expect(targetGroup).toBeUndefined();
    });
  });
});
