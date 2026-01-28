import fs from "fs";
import path from "path";

export class FileWalker {
    async walk(dir: string): Promise<string[]> {
        const files: string[] = [];
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if(entry.isDirectory()) {
                files.push(...await this.walk(fullPath));
            } else if (entry.isFile() && fullPath.endsWith('.ts')) {
                files.push(fullPath);
            }
        }

        return files;
    }
}
