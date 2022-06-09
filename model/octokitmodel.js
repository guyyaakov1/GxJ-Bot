const { Octokit } = require('@octokit/rest')

const octokit = new Octokit({
    auth:process.env.GITHUB_TOKEN,
    request: {
        timeout: 5 * 1000
    }
  })


module.exports = octokit