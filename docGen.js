// generateDocsWithHierarchy.js
import fs from "fs";
import path from "path";

const SOURCE_DIR = "./server"; // <-- Change this if needed
const OUTPUT_DIR = "./docs_md"; // Output doc folder

function extractComments(content) {
  const regex = /\/\*\*([\s\S]*?)\*\//g;
  const matches = [...content.matchAll(regex)];
  return matches.map((match) => match[0].trim());
}

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function walkDirAndGenerateDocs(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      walkDirAndGenerateDocs(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      const relativePath = path.relative(SOURCE_DIR, fullPath);
      const outputFilePath = path.join(
        OUTPUT_DIR,
        relativePath.replace(/\.(ts|tsx)$/, ".md")
      );
      const outputDir = path.dirname(outputFilePath);
      ensureDirSync(outputDir);

      const content = fs.readFileSync(fullPath, "utf-8");
      const comments = extractComments(content);
      if (comments.length > 0) {
        const markdown =
          `# Documentation for \`${relativePath}\`\n\n` +
          comments.map((c) => `---\n\`\`\`ts\n${c}\n\`\`\`\n`).join("\n");

        fs.writeFileSync(outputFilePath, markdown, "utf-8");
        console.log(`📄 Generated: ${outputFilePath}`);
      }
    }
  });
}

// Create output root folder if not exists
ensureDirSync(OUTPUT_DIR);
walkDirAndGenerateDocs(SOURCE_DIR);
