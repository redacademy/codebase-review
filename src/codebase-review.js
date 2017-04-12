#! /usr/bin/env node
const child_process = require('child_process');
const argv = require('yargs').argv;
require('colour');

const branchPrefix = argv.prefix || 'codebase-review';
const emptyBranchName = `${branchPrefix}-empty`;
const projectBranchName = `${branchPrefix}-project`;

const execShellPromise = (command) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, function(error, stdout, stderr){
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

const runCommand = (command, message) => {
  if (message) console.log(message.green);
  return execShellPromise(command);
}

const getRepoUrl = () => {
  return runCommand('git config --get remote.origin.url').then(configUrl => {
    // Remove .git extension
    let url = configUrl.replace(/\s/, '').replace(/\.git$/, '');

    // https clones
    if (/^http/.test(url)) return url;

    // ssh clones
    return url.replace(/(^git.+:)?/, 'https://github.com/');
  });
}

const run = () => {
  console.log('----------------------------------------------------------'.rainbow);
  console.log(`{{{{{`.rainbow, `${'RED'.red} Skunkz -  🚀  Hack your git for a ${'FULL CODEBASE'.blue} review!`, `}}}}}`);
  console.log();

  runCommand(`git branch -D ${emptyBranchName}`, 'Setting up workspace...')
  .catch(() => true) // Swallow error if branch doesn't exist
  .then(() => runCommand(`git branch -D ${projectBranchName}`))
  .catch(() => true) // Swallow error if branch doesn't exist
  .then(() => runCommand(`git checkout --orphan ${emptyBranchName}`))
  .then(() => runCommand('git rm -rf .', 'Clearing git house...'))
  .then(() => runCommand(`git commit --allow-empty -m "Create ${emptyBranchName} branch"`, 'Commiting changes...'))
  .then(() => runCommand(`git push --set-upstream origin ${emptyBranchName} --force`, `Pushing ${emptyBranchName} branch...`))
  .then(() => runCommand(`git checkout -b ${projectBranchName}`, `Creating new project branch(${projectBranchName})...`))
  .then(() => runCommand('git merge master --allow-unrelated-histories', 'Merging master into project branch...'))
  .then(() => runCommand(`git push --set-upstream origin ${projectBranchName} --force`, `Pushing ${projectBranchName} branch...`))
  .then(() => runCommand('git checkout master', 'Returning to master branch'))
  .then(getRepoUrl)
  .then((repoUrl) => {
    console.log();
    console.log('----------------------------------------------------------'.rainbow);
    console.log();
    console.log("You're done! Visit your git repo and make a new pull request:");
    console.log(repoUrl);
    console.log();
    console.log('Base branch: ' + emptyBranchName.green);
    console.log('Compare branch: ' + projectBranchName.green);
    console.log();
  })
}

run();



