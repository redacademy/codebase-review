const child_process = require('child_process');

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

module.exports = runCommand;
