const axios = require("axios");

// Let create the ajax function
const ajax = (input = '', get = 'username', username = '') => {
  let endpoint = '';

  // Change the different endpoints depending on the @get value.
  switch(get) {
    case 'license':
      endpoint = `https://api.github.com/licenses/${input}`;
      break;
    case 'repo':
      endpoint = `https://api.github.com/repos/${username}/${input}`;
      break;
    case 'repos':
      endpoint = `https://api.github.com/users/${username}/repos`;
      break;
    default:
      endpoint = `https://api.github.com/users/${input}`;
      break;
  }

  return axios.get(endpoint)
    .then(resp => {
      resp = resp.data;

      const data = {};

      // The default, will return basic username information from GitHub
      if(get === 'username') {

        data.username = resp.login;
        data.name = resp.name;
        data.avatar = resp.avatar_url;
        data.html_url = resp.html_url;
        data.email = resp.email;

        return [true, data];
      } 

      // Getting a specific repo information from GitHub
      if(get === 'repo') {

        data.name = resp.name;
        data.html_url = resp.html_url;
        
        return [true, data];
      } 

      // Get the license info from GitHub
      if(get === 'license') {

        data.name = resp.name;
        data.key = resp.key;
        data.badge = resp.spdx_id.replace('-', '%20');
        data.html_url = resp.html_url;
        data.desc = resp.description;
        
        return  data;
      } 

      // Get a list of repos from github
      if (resp.length) {

        return resp.map((key, index) => {
          return key.name;
        })

      }

      // return false if it does not match.
      return [false];
    })
    .catch(err => {
      console.log(err);
    }) 
}

module.exports = ajax;