import { FileWalker } from "../src/core/FileWalker";
import fs from "fs";
import path from "path";
import os from "os";

describe("FileWalker", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'filewalker-test-'));
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  test("Walk empty directory", async () => {
    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    expect(files.length).toBe(0);
  });

  test("Walk directory with single .ts file", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.promises.writeFile(testFile, 'const x = 42;');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(1);
    expect(files[0]).toBe(testFile);
  });

  test("Walk directory with multiple .ts files", async () => {
    const testFile1 = path.join(tempDir, 'test1.ts');
    const testFile2 = path.join(tempDir, 'test2.ts');
    await fs.promises.writeFile(testFile1, 'const x = 42;');
    await fs.promises.writeFile(testFile2, 'const y = 43;');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(2);
    expect(files).toContain(testFile1);
    expect(files).toContain(testFile2);
  });

  test("Walk directory ignores non-.ts files", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    const jsFile = path.join(tempDir, 'test.js');
    const txtFile = path.join(tempDir, 'test.txt');
    await fs.promises.writeFile(testFile, 'const x = 42;');
    await fs.promises.writeFile(jsFile, 'const x = 42;');
    await fs.promises.writeFile(txtFile, 'some text');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(1);
    expect(files[0]).toBe(testFile);
  });

  test("Walk directory with nested subdirectories", async () => {
    const subDir = path.join(tempDir, 'subdir');
    await fs.promises.mkdir(subDir);
    
    const rootFile = path.join(tempDir, 'root.ts');
    const subFile = path.join(subDir, 'sub.ts');
    await fs.promises.writeFile(rootFile, 'const x = 42;');
    await fs.promises.writeFile(subFile, 'const y = 43;');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(2);
    expect(files).toContain(rootFile);
    expect(files).toContain(subFile);
  });

  test("Walk directory with deeply nested subdirectories", async () => {
    const level1 = path.join(tempDir, 'level1');
    const level2 = path.join(level1, 'level2');
    const level3 = path.join(level2, 'level3');
    await fs.promises.mkdir(level1, { recursive: true });
    await fs.promises.mkdir(level2, { recursive: true });
    await fs.promises.mkdir(level3, { recursive: true });
    
    const rootFile = path.join(tempDir, 'root.ts');
    const level1File = path.join(level1, 'level1.ts');
    const level2File = path.join(level2, 'level2.ts');
    const level3File = path.join(level3, 'level3.ts');
    
    await fs.promises.writeFile(rootFile, 'const x = 42;');
    await fs.promises.writeFile(level1File, 'const y = 43;');
    await fs.promises.writeFile(level2File, 'const z = 44;');
    await fs.promises.writeFile(level3File, 'const w = 45;');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(4);
    expect(files).toContain(rootFile);
    expect(files).toContain(level1File);
    expect(files).toContain(level2File);
    expect(files).toContain(level3File);
  });

  test("Walk directory with mixed files and directories", async () => {
    const subDir = path.join(tempDir, 'subdir');
    await fs.promises.mkdir(subDir);
    
    const rootTs = path.join(tempDir, 'root.ts');
    const rootJs = path.join(tempDir, 'root.js');
    const subTs = path.join(subDir, 'sub.ts');
    const subTxt = path.join(subDir, 'sub.txt');
    
    await fs.promises.writeFile(rootTs, 'const x = 42;');
    await fs.promises.writeFile(rootJs, 'const x = 42;');
    await fs.promises.writeFile(subTs, 'const y = 43;');
    await fs.promises.writeFile(subTxt, 'some text');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(2);
    expect(files).toContain(rootTs);
    expect(files).toContain(subTs);
  });

  test("Walk directory with empty subdirectories", async () => {
    const subDir1 = path.join(tempDir, 'subdir1');
    const subDir2 = path.join(tempDir, 'subdir2');
    await fs.promises.mkdir(subDir1);
    await fs.promises.mkdir(subDir2);
    
    const rootFile = path.join(tempDir, 'root.ts');
    await fs.promises.writeFile(rootFile, 'const x = 42;');

    const walker = new FileWalker();
    const files = await walker.walk(tempDir);
    
    expect(files.length).toBe(1);
    expect(files[0]).toBe(rootFile);
  });
});
