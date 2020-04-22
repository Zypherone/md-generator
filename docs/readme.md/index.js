const fs             = require('fs');
const util           = require('util');
const inquirer       = require('inquirer');
const writeFileAsync = util.promisify(fs.writeFile);

const runPrompt = () => {

  return true;

}

(async () =>  {

  try {
    const result = await runPrompt();

    console.log(result);
  }
  catch (error) {
    console.log(error);
  }
  
})();