import fs from 'node:fs';
import path from 'node:path';

const TARGET_DIR = './src'; // 只看源码目录
const IGNORE_FILES = ['.DS_Store'];

function dumpProject(dir) {
  const files = fs.readdirSync(dir);
  let output = `\n# Project Snapshot: ${path.resolve(dir)}\n`;
  output += "================================================\n";

  for (const file of files) {
    if (IGNORE_FILES.includes(file)) continue;

    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      output += dumpProject(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      output += `\n## FILE: ${fullPath}\n`;
      output += "------------------------------------------------\n";
      output += "```" + (file.split('.').pop()) + "\n";
      output += content;
      output += "\n```\n";
    }
  }
  return output;
}

console.log(dumpProject(TARGET_DIR));

