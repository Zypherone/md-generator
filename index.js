const Handlebars = require('handlebars')
const fs = require('fs')
const util = require('util')
const required = require('./required.js')
const readFileAsync = util.promisify(fs.readFile)
const accessFileAsync = util.promisify(fs.access)
const mkdirFileAsync = util.promisify(fs.mkdir)
const writeFileAsync = util.promisify(fs.writeFile);

(async () => {
  try {
    // Run through all the questions and return the results.
    const resp = await required
    
    // Let use the template.md as a template for this.
    const markdownFile = await readFileAsync('template.md', 'utf8')

    // Lets compile and build the readme data.
    const template = Handlebars.compile(markdownFile)

    // Lets ensure we do not overwrite other readme previously generated and send to a new directy based on repo project title.
    const dir = resp.title
    
    // Check to to see if the directory exists, if not create.
    const dirExists = await accessFileAsync(dir).catch(function (err) {
      if (err && err.code === 'ENOENT') {
        mkdirFileAsync(dir)
      }
      return true
    })

  
    // Let write the readme.md file and with compiled template.
    await writeFileAsync(dir + '/README.md', template(resp))
    .then(() => {
      console.log('Readme file created!');
    }).catch(err => {
      console.log(err);
    })
    
  } catch (error) {
    console.log(error)
  }
})()
