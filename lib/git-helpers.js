const argv = require('yargs').argv;
const runCommand = require('../lib/run-command');

const getRepoUrl = () => {
  return runCommand('git config --get remote.origin.url').then(configUrl => {
    // Remove .git extension
    let url = configUrl.replace(/\s/, '').replace(/\.git$/, '') + '/compare';

    // https clones
    if (/^http/.test(url)) return url;

    // ssh clones
    return url.replace(/(^git.+:)?/, 'https://github.com/');
  });
}

const checkForUncommittedChanges = () => {
  if (argv['ignore-changes']) return Promise.resolve();

  return runCommand('git diff-index  HEAD -- | wc -l').then(changes => {
    if (changes > 0) return Promise.reject('You have uncommitted changes. Commit them, then run codebase-review again.');
    return Promise.resolve();
  })
}

module.exports = {
  getRepoUrl,
  checkForUncommittedChanges
};
