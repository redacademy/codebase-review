#! /usr/bin/env node
const argv = require('yargs').argv;
require('colour');

const fs = require('fs');
const runCommand = require('../lib/run-command');
const { getRepoUrl, checkForUncommittedChanges } = require('../lib/git-helpers');

const branchPrefix = argv.prefix || 'codebase-review';
const emptyBranchName = `${branchPrefix}-empty`;
const projectBranchName = `${branchPrefix}-project`;
const sourceBranchName = argv.source || 'master';
const nullDirectory = fs.existsSync('/dev/null') ? '/dev/null' : 'NUL'; // Use /dev/null where possible, otherwise probably Windows so use NUL.

const handleEmptyBranchCreation = () => {
  return runCommand(`git branch -a | grep ${emptyBranchName} | wc -l`)
    .then(branch => {
      if (!parseInt(branch)) return createAndPushEmptyBranch();
      return runCommand(`git checkout ${emptyBranchName}`, `Using remote version of ${emptyBranchName}`);
    });
}

const createAndPushEmptyBranch = () => {
  return runCommand(`git checkout --orphan ${emptyBranchName}`)
    .then(() => runCommand(`git rm -rf . > ${nullDirectory}`, 'Clearing git house...'))
    .then(() => runCommand(`git commit --allow-empty -m "Create ${emptyBranchName} branch"`, 'Commiting changes...'))
    .then(() => runCommand(`git push --set-upstream origin ${emptyBranchName} --force`, `Pushing ${emptyBranchName} branch...`))
};

const run = () => {
  console.log('----------------------------------------------------------'.rainbow);
  console.log(`{{{{{`.rainbow, `${'RED'.red} Skunkz -  🚀  Hack your git for a ${'FULL CODEBASE'.blue} review!`, `}}}}}`);
  console.log();

  runCommand(`git branch -D ${emptyBranchName}`, 'Setting up workspace...')
  .then(`git branch -D ${emptyBranchName}`, 'Setting up workspace...')
  .catch(() => true) // Swallow error if branch doesn't exist
  .then(() => runCommand(`git branch -D ${projectBranchName}`))
  .catch(() => true) // Swallow error if branch doesn't exist
  .then(checkForUncommittedChanges)
  .then(handleEmptyBranchCreation)
  .then(() => runCommand(`git checkout -b ${projectBranchName}`, `Creating new project branch(${projectBranchName})...`))
  .then(() => runCommand(`git add --all`, 'Adding any hidden files...'))
  .then(() => runCommand(`git commit -am "Handling hidden files"`, 'Commiting any hidden files...'))
  .then(() => runCommand(`git merge ${sourceBranchName} --allow-unrelated-histories > ${nullDirectory}`, `Merging ${sourceBranchName} into project branch...`))
  .then(() => runCommand(`git push --set-upstream origin ${projectBranchName} --force`, `Pushing ${projectBranchName} branch...`))
  .then(() => runCommand(`git checkout ${sourceBranchName}`, `Returning to ${sourceBranchName} branch`))
  .then(() => runCommand(`git branch -D ${emptyBranchName} ${projectBranchName}`, 'Clearing Codebase Review branches'))
  .then(getRepoUrl)
  .then((repoUrl) => {
    console.log();
    console.log('----------------------------------------------------------'.rainbow);
    console.log();
    console.log("You're done! Visit your git repo and make a new pull request:");
    console.log();
    console.log(repoUrl);
    console.log();
    console.log('Base branch: ' + emptyBranchName.green);
    console.log('Compare branch: ' + projectBranchName.green);
    console.log();
  })
  .catch(err => {
    console.log();
    console.log('Error:'.red);
    console.log(err);
    console.log();
  });
}

run();
