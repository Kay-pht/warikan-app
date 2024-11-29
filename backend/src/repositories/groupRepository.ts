import fs from "fs";
import { Group } from "../type";

export class GroupRepository {
  constructor(private filePath: string) {}

  loadGroups(): Group[] {
    // 指定されたパスにファイルまたはディレクトリが存在するかどうかを同期的に確認
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    // ファイルのデータを同期的に読み込んでオブジェクト形式にして返す
    const data = fs.readFileSync(this.filePath, "utf8");
    return JSON.parse(data);
  }

  saveGroup(group: Group): void {
    const groups = this.loadGroups();
    groups.push(group);
    fs.writeFileSync(this.filePath, JSON.stringify(groups));
  }
}
