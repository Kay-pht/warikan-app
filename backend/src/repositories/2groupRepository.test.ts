import fs from "fs";
import { GroupRepository } from "./groupRepository";

jest.mock("fs");
const filePath = "samplePath";

const groups = [
  { name: "Group A", members: ["Alice", "Bob"] },
  { name: "Group B", members: ["Charlie", "David"] },
];
const mockDataList = JSON.stringify(groups);

describe("loadGroups", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("fetches groups from the file", () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockDataList);

    const mockedGroupRepository = new GroupRepository(filePath);
    const result = mockedGroupRepository.loadGroups();
    expect(result).toEqual(groups);
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, "utf8");
  });

  it("returns an empty array if the file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockDataList);

    const mockedGroupRepository = new GroupRepository(filePath);
    const result = mockedGroupRepository.loadGroups();
    expect(result).toEqual([]);
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });
});

describe("saveGroup", () => {
  const group = { name: "Group A", members: ["Alice", "Bob"] };
  const mockData = JSON.stringify([group]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("saves a group to DB", () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    // (fs.readFileSync as jest.Mock).mockReturnValue([]);
    (fs.writeFileSync as jest.Mock).mockReturnValue("success");

    const mockedGroupRepository = new GroupRepository(filePath);
    mockedGroupRepository.saveGroup(group);
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, mockData);
  });
});
