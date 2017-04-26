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
  return runCommand('git diff-index  HEAD --').then(changes => {
    if (changes) return Promise.reject('You have uncommitted changes. Commit them, then run codebase-review again.');
    return Promise.resolve();
  })
}

module.exports = {
  getRepoUrl,
  checkForUncommittedChanges
};
