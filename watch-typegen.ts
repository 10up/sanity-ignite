import { exec } from 'node:child_process';
import { watch } from 'chokidar';

import data from './sanity-typegen.json' with { type: 'json' };

const queryPaths = data.path.map((p) => {
  // Handle both glob patterns: **/*.ts and *.ts
  return p
    .replace(/\*\*\/\*\..*$/, '') // Remove **/*.ts pattern
    .replace(/\*\..*$/, ''); // Remove *.ts pattern
});
const schemaPath = 'src/sanity/schema'; // Hardcoded schema path

console.log('Watching for changes in:');
console.log('🔍 Query Paths:', queryPaths);
console.log('📜 Schema Path:', schemaPath);

// Enum for file types
enum FileType {
  QUERY = 'query',
  SCHEMA = 'schema',
}

// Function to determine if a file belongs to queryPaths or schemaPath
const getFileType = (filePath: string): FileType => {
  console.log('getFileType', filePath, schemaPath);
  if (filePath.includes(schemaPath)) {
    return FileType.SCHEMA;
  } else {
    return FileType.QUERY;
  }
};

// Shared event handler function
const handleFileEvent = (event: string, filePath: string): void => {
  const fileType = getFileType(filePath);
  if (fileType === FileType.SCHEMA) {
    console.log('📜 Schema updated - running Sanity Typegen...');
    exec('npm run sanity:typegen', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running Sanity Typegen: ${err.message}`);
        return;
      }
      console.log('Sanity Typegen generated successfully');
      if (stderr) console.error(stderr);
    });
  }
  if (fileType === FileType.QUERY) {
    console.log('🟢 Query updated - running Sanity Typegen...');

    exec('npx sanity typegen generate', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running npx sanity typegen generate: ${err.message}`);
        return;
      }
      console.log('Sanity Typegen generated successfully');
      if (stderr) console.error(stderr);
    });
  }
};

// Initialize watcher
const watcher = watch([...queryPaths, schemaPath], {
  ignored: /node_modules|\.git/, // Ignore unnecessary files
  persistent: true,
  ignoreInitial: true, // Detect existing files
  depth: Infinity, // Watch subdirectories
});

// Attach event handlers with shared callback
watcher
  .on('add', (filePath: string) => handleFileEvent('File added', filePath))
  .on('change', (filePath: string) => handleFileEvent('File changed', filePath))
  .on('unlink', (filePath: string) => handleFileEvent('File deleted', filePath))
  .on('addDir', (dirPath: string) => handleFileEvent('Directory added', dirPath))
  .on('unlinkDir', (dirPath: string) => handleFileEvent('Directory removed', dirPath))
  .on('error', (error: unknown) => console.error(`⚠️ Watcher error: ${error}`));

process.on('SIGINT', () => {
  console.log('\nStopping watcher...');
  watcher.close().then(() => process.exit(0));
});
