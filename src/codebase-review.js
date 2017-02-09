#! /usr/bin/env node
var child_process = require('child_process');
require('colour');

const execShellPromise = (command) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, function(error, stdout, stderr){
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

const runCommand = (command, message) => {
  console.log(message.green);
  return execShellPromise(command);
}

const run = () => {
  console.log('----------------------------------------------------------'.rainbow);
  console.log(`{{{{{`.rainbow, `${'RED'.red} Skunkz -  🚀  Hack your git for a ${'FULL CODEBASE'.blue} review!`, `}}}}}`);
  console.log();

  runCommand('git checkout --orphan empty', 'Creating empty branch...')
    .then(() => runCommand('git rm -rf .', 'Clearing git house...'))
    .then(() => runCommand('git commit --allow-empty -m "Create empty branch"', 'Commiting changes...'))
    .then(() => runCommand('git push --set-upstream origin empty', 'Pushing empty branch...'))
    .then(() => runCommand('git checkout -b project', 'Creating project branch...'))
    .then(() => runCommand('git merge master --allow-unrelated-histories', 'Merging master into project branch...'))
    .then(() => runCommand('git push --set-upstream origin project', 'Pushing project branch...'))
    .then(() => {
      console.log();
      console.log('----------------------------------------------------------'.rainbow);
      console.log();
      console.log("You're done! Visit your git repo and make a new pull request.");
      console.log('Base branch: ' + 'empty'.blue);
      console.log('Compare branch: ' + 'project'.blue);
    })
}

run();

