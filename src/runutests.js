const octokit = require('../model/octokitmodel')


var runutests = async (context) =>{
    // RUN TESTS WORKFLOW FILE
    const workflow_dispatch = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        workflow_id: '4040242', // ADD DISPATCH EVENT TO WORKFLOW FILE
        ref: 'main',
      }).then((data)=>{
        context.log.info("workflow_dispatch: " + JSON.stringify(data))
      }).catch((err)=>{
        context.log.error(`faild invoking dispatches event: ${err}`)
      })
}


exports.runutests = runutests
