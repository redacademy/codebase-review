var child_process = require('child_process');

const execShell = (command) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, function(error, stdout, stderr){
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

// const commands = [
//   // Create empty branch.
//   'git checkout --orphan review',
//   'git rm -rf',
//   'git commit --allow-empty -m "Create empty branch"',
//   'git push --set-upstream origin review',

//   // Create `project` branch from `master` current state.
//   'git checkout -b project',
//   'git merge master --allow-unrelated-histories',
//   'git push --set-upstream origin project',
// ];

async function run() {
  await execShell('git checkout --orphan review');
  await execShell('git rm -rf');
  await execShell('git commit --allow-empty -m "Create empty branch"');
  await execShell('git push --set-upstream origin review');
  await execShell('git checkout -b project');
  await execShell('git merge master --allow-unrelated-histories');
  await execShell('git push --set-upstream origin project');
}

run();
// // exec: spawns a shell.
// execShell('ls -al')
//   .then(console.log)
//   .catch(console.err);

