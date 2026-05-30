
const { exec } = require('child_process');

const server = exec('pnpm --filter @workspace/api-server start');

server.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

server.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
