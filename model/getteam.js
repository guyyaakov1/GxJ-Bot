const octokit = require('./octokitmodel')
// THIS CREATE FOR CHECKING THAT ANY ACTION TAKING BY THE BOT IS
// TRIGGERD BY ON OF THE COLLABORATORES OF THE PROJECT.
const get_team = async (context) => {
    var collaborators =[]
    var pr_publisher = context.payload.issue.user.login
    var members = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        }).then((res)=>{
            context.log.info(`teamteamteam : \n ${JSON.stringify(res.data)}`)
            
            if (res.data.length >= 1) {
                
                for (let i = 0; i < res.data.length; i++) {
                    context.log.info(`asfdhnjaeikrugbvhsutikr \n ${JSON.stringify(res.data[i])}`)
                    collaborators.push(res.data[i]["login"])
                }
            }else{
                context.log.error('collaborators Not Found.')
            }

        })
    return collaborators

}


exports.get_team = get_team


