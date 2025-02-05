import { watch } from 'chokidar';
import { exec } from 'child_process';
import data from './sanity-typegen.json' assert { type: 'json' };

const directoriesToWatch = data.path;

const runTypegen = () => {
  console.log('Running Sanity Typegen...');
  exec('npm run sanity:type-gen', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error running Sanity Typegen: ${err.message}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
};

const watcher = watch(directoriesToWatch, {
  persistent: true,
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
});

watcher.on('change', (path) => {
  console.log(`File changed: ${path}`);
  runTypegen();
});

console.log('Watching directories for changes...');
