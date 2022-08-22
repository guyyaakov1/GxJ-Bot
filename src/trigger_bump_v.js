const octokit = require('./octokitmodel')


function get_bump_level_from_str(msg) {
    if  (msg.includes('major')){ //true
        return 'major'
    }
    if  (msg.includes('minor')){ //true
        return 'minor'
    }
    if  (msg.includes('patch')){ //true
        return 'patch'
    }

}

var bump_v = async (context, massage_content) => {

    const get_bump_level = get_bump_level_from_str(massage_content)

    // GET EVENT PULL REQUEST
    var prnumber = context.payload.issue.number
    const pr_get = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        pull_number: context.payload.issue.number,
    })

    var commetuser =JSON.stringify(context.payload.issue.user.login)
    var base_ref = `heads/${pr_get.data.base.ref}`
    
    
    if (get_bump_level){
        await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: process.env.G_BOT_OWNER,
            repo: process.env.G_BOT_REPO,
            workflow_id: 'WORKFLOW_ID', // Create A workflow.yml for github(add exampls dir)
            ref: base_ref,
            inputs: {
              bmp_level: get_bump_level,
            }
          })
    }

}


exports.bump_v = bump_v