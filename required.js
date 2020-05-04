const inquirer = require('inquirer')
const { license }  = require('./license.js')
const ajax = require('./ajax.js')

let userdata = {};

// Lets build all the different questions to ask.
let question = [
  {
    type: 'input',
    name: 'title',
    message: 'What is the title of your project?',
    validate: function (input) {
      return (input.length > 0) ? true : 'You have not provided a valid response.'
    }
  },
  {
    type: 'input',
    name: 'user',
    message: 'Please provide your GitHub username.',
    validate: function (input) {
      if (!(input.length > 0)) {
        return 'You have not provided a valid response.';
      } 
      else {
        try {
          return ajax(input)
          .then((userExists) => {

            // Lets check the username provided was correct so we can proceed in capturing other details later.
            if (typeof userExists[1] === 'object') {
              userdata = userExists[1];
            }
            else {
              return 'You have provided an invalid username.';
            }
          })
          .then(() => {
            // Since we were able to get the user details, lets collect a list of repo details to choose from.
            return ajax('', 'repos', input).then((repos) => {
              userdata.repos = repos;            
              return true;
            })
            .catch(err => { console.log(err) })
          });
        }
        catch(err) {
          console.log(err);
        }
      }
    },
  },
  {
    type: 'input',
    name: 'email',
    message: 'Unable to get an email, please provide one',
    validate: function (input) {
      return input.length > 0 ? true : 'You have not provided a valid response.';
    },
    when: () => {
      // Only ask this question if we have not been able to access the public email.
      return !userdata.email;
    }
  },
  {
    type: 'confirm',
    name: 'isRepoSet',
    message: 'Have you set your repo yet?'
  },
  {
    type: 'input',
    name: 'repo',
    message: 'What is the the exaxt repo name? (This must match the repo URL)',
    validate: function (input) {
      return input.length > 0 ? true : 'You have not provided a valid response.';
    },
    when: (answers) => {
      // Only ask if the repo was not set and retrived from github.
      return !answers.isRepoSet;
    }
  },
  {
    type: 'rawlist',
    name: 'repo',
    message: 'Please select which repo.',
    choices: () => {
      // Return a list of existing repo from Github.
      return userdata.repos;
    },
    when: (answers) => {
      // Only provide a choise if the repo was set to true in an earlier question, this is the alternative to typing it out manually.
      return answers.isRepoSet;
    }
  },
  {
    type: 'input',
    name: 'description',
    message: 'Write a brief description of your project',
    validate: function (input) {
      return (input.length > 0) ? true : 'You have not provided a valid response.'
    }
  },
  {
    type: 'checkbox',
    message: 'Please select which sections you want to include in your readme.md file.',
    name: 'contents',
    choices: [
      'Installation',
      'Usage',
      'Contribute',
      'Tests',
      'License'
    ]
  },
  {
    type: 'input',
    name: 'contents.Installation',
    message: 'Please provide instructions on how to install it.',
    validate: function (input) {
      return (input.length > 0) ? true : 'You have not provided a valid response.'
    },
    when: (answers) => {
      return (answers.contents.indexOf('Installation') > -1)
    }
  },
  {
    type: 'input',
    name: 'contents.Usage',
    message: 'Please provide information on how to use it.',
    validate: function (input) {
      return (input.length > 0) ? true : 'You have not provided a valid response.'
    },
    when: (answers) => {
      return (answers.contents.indexOf('Usage') > -1)
    }
  },
  {
    type: 'input',
    name: 'contents.Contribute',
    message: 'Please let people know how they can contribute into your project.',
    validate: function (input) {
      return (input.length > 0) ? true : 'You have not provided a valid response.'
    },
    when: (answers) => {
      return (answers.contents.indexOf('Contribute') > -1)
    }
  },
  {
    type: 'input',
    name: 'contents.Tests',
    message: 'Please describe and show how to run the tests with code examples.',
    validate: function (input) {
      return (input.length > 0) ? true : 'You have not provided a valid response.'
    },
    when: (answers) => {
      return (answers.contents.indexOf('Tests') > -1)
    }
  },
  {
    type: 'rawlist',
    name: 'contents.License',
    message: 'Please provide information on how to use it.',
    choices: Object.keys(license), // Grab a list of valid licenses from the license.js file
    filter: input => {
      // Lets filter the results and match the license information from Github.
      return ajax(license[input], 'license')
        .then(input => {

          userdata.license = input;

        return input.name;  
      })
    },
    when: answers => {
      return (answers.contents.indexOf('License') > -1)
    }
  }
]

const resp = inquirer.prompt(question).then((answers) => {

  // Add the userdata information to the answer object.
  answers.user = userdata;

  // Lets add an email should a public email was not retrieved from Github.
  if (answers.email) {
    answers.user.email = answers.email;
  }

  // Lets clean the TOC section.
  Object.keys(answers.contents).filter((key, index) => {

    if (!isNaN(key)) {
      
      const title = answers.contents[key]
      const data  = answers.contents[title];
      delete answers.contents[title];

      answers.contents[key] = { title: title }

      if (title === 'License') {
        // We must display license slightly different from standard format.
        answers.contents[key].license = userdata.license;
      }
      else {
        // Incase you want to use inline code markdown.
        answers.contents[key].data = data.replace('```', '\n```\n');  
      }
      
    }
    
    
  })

  return answers;
})
.catch(err => {
  console.log(err);
})



module.exports = resp;