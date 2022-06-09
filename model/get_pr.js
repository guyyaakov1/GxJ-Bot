const octokit = require('./octokitmodel')
// THIS CREATE FOR CHECKING THAT ANY ACTION TAKING BY THE BOT IS
// TRIGGERD BY ON OF THE COLLABORATORES OF THE PROJECT.
const get_pr = async (context) => {
    const pr_get = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        pull_number: context.payload.issue.number,
    })
    return pr_get

}


exports.get_pr = get_pr
