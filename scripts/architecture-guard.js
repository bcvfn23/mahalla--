const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../src");

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getFiles(baseDir);
let violations = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(baseDir, file).replace(/\\/g, "/");

  // Rule 1: No direct Prisma imports in UI/pages/components
  if (relativePath.startsWith("app") || relativePath.startsWith("components")) {
    if (content.includes("prisma") || content.includes("@prisma/client") || content.includes("@/lib/db")) {
      // Exclude lib/db.ts, next.config, or scripts themselves
      if (!relativePath.endsWith("lib/db.ts") && !relativePath.includes("app/api/")) {
        console.error(`? Architecture Violation in ${relativePath}: Direct database/Prisma access is forbidden in UI. Use API versioned endpoints instead.`);
        violations++;
      }
    }
  }

  // Rule 2: No React imports in services/repositories
  if (relativePath.startsWith("modules") || relativePath.startsWith("lib/services")) {
    if (content.includes("from \"react\"") || content.includes("from 'react'")) {
      console.error(`? Architecture Violation in ${relativePath}: React imports are forbidden in service and repository layers.`);
      violations++;
    }
    // Rule 3: No HTTP responses in services/repositories
    if (content.includes("NextResponse") || content.includes("next/server")) {
      console.error(`? Architecture Violation in ${relativePath}: NextResponse/HTTP abstractions are forbidden in service and repository layers.`);
      violations++;
    }
  }
});

// Check circular dependencies in modules/services
const graph = {};
const moduleFiles = files.filter(f => path.relative(baseDir, f).replace(/\\/g, "/").startsWith("modules"));

moduleFiles.forEach(file => {
  const content = fs.readFileSync(file, "utf8");
  const rel = path.relative(baseDir, file).replace(/\\/g, "/");
  const importLines = content.match(/import\s+.*\s+from\s+['"](.*)['"]/g) || [];
  graph[rel] = [];

  importLines.forEach(line => {
    const match = line.match(/from\s+['"](.*)['"]/);
    if (match) {
      let target = match[1];
      if (target.startsWith("@/modules/")) {
        target = target.replace("@/", "");
        // Resolve extension-less imports
        if (!target.endsWith(".ts") && !target.endsWith(".tsx")) {
          if (fs.existsSync(path.join(baseDir, target + ".ts"))) target += ".ts";
          else if (fs.existsSync(path.join(baseDir, target + ".tsx"))) target += ".tsx";
          else if (fs.existsSync(path.join(baseDir, target, "index.ts"))) target += "/index.ts";
        }
        graph[rel].push(target.replace(/\\/g, "/"));
      }
    }
  });
});

function hasCycle(node, visited, stack) {
  visited[node] = true;
  stack[node] = true;

  const neighbors = graph[node] || [];
  for (const neighbor of neighbors) {
    if (!visited[neighbor]) {
      if (hasCycle(neighbor, visited, stack)) return true;
    } else if (stack[neighbor]) {
      return true;
    }
  }

  stack[node] = false;
  return false;
}

const visited = {};
const stack = {};
let circular = false;

for (const node in graph) {
  if (!visited[node]) {
    if (hasCycle(node, visited, stack)) {
      console.error(`? Circular Dependency Detected in ${node}`);
      circular = true;
      violations++;
    }
  }
}

if (violations > 0) {
  console.error(`\nBuild failed with ${violations} architectural violations.`);
  process.exit(1);
} else {
  console.log("? Architecture Guard: All check constraints passed successfully.");
  process.exit(0);
}
