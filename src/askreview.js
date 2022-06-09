
const octokit = require('../model/octokitmodel')
const collaborators = require('../model/getteam')

var ask_review = async (context) => {
    var repo_collaborators = []

    // GET TEAM LIST
    newlist = await collaborators.get_team(context)
    .then((res)=>{
        repo_collaborators = res
        context.log.info("thithtihti:: : " + repo_collaborators)
    })
    .catch((err)=>context.log.info(err))
    var prnumber = context.payload.issue.number
    const pr_get = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        pull_number: context.payload.issue.number,
    })
    if (repo_collaborators.length > 0) {
        for (let i = 0; i < repo_collaborators.length; i++) {
            context.log.info(`asfdhnjaeikrugbvhsutikr \n ${JSON.stringify(res.data[i])}`)
            // DELETE TEAM MEMBER IF == COMMANT SENDER
            if (repo_collaborators[i] == context.payload.issue.user.login) {
                repo_collaborators.slice(i, 1)
            }
        }   
    }
    // ASK REVIEW FROM REPO TEAM LIST
    const req_rev = await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers', {
        owner: process.env.G_BOT_OWNER, //prosses.env.g_bot_owner
        repo: process.env.G_BOT_REPO,  //prosses.env.g_bot_owner
        pull_number: context.payload.issue.number,
        reviewers: repo_collaborators,
    }).then((res)=>{
        context.log.info(`Review req was sent to the team ${res}`)
    }).catch((err)=>context.log.info(`Ask Review faild with error: \n  ${err}`))


}

exports.ask_review = ask_review