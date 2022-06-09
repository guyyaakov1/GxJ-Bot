
const octokit = require('../model/octokitmodel')

var up_pr = async (context) => {

    // GET EVENT PULL REQUEST
    var prnumber = context.payload.issue.number
    const pr_get = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        pull_number: context.payload.issue.number,
    })

    var commetuser =JSON.stringify(context.payload.issue.user.login)
    var base_ref = `heads/${pr_get.data.base.ref}`
    var last_base_sha =""
    await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        ref: base_ref,
    }).then( (res) => {
        last_base_sha = res.data.sh
    })
    var new_sha = ""
    // MERGE UPDATES FROM BASE BRANCH
    await octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        pull_number: prnumber,
        expected_head_sha: last_base_sha,
    }).then((res) =>{
        context.log.info(`${JSON.stringify(res.data)}`)
        context.log.info(`Merge prosses pass!`)
      }).catch((err)=>context.log.info(`Merge prosses failed! : \n ${err}`))  

}

exports.up_pr = up_pr