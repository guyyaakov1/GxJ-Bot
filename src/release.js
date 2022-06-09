
const octokit = require('../model/octokitmodel')

const g_note = require('../model/releasedraft')


var release_process = async (context) =>{
    var bump_status = ""
    var last_r_t = ""
    var last_r_id = ""
    var finel_draft= ""
    var commits_arry= []
      // CALLING WORKFLOW TO CREATE NEW RELEASE TAG.
      // START BUMP VERSION WORKFLOW | IN TEFLO CREATE NEW RELEASE TAG
      const workflow_dispatch = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
        workflow_id: '25691532',
        ref: 'main',
      }).then((data)=>{
        context.log.info("workflow_dispatch invoked" + JSON.stringify(data))
      }).catch((err)=>{
        context.log.error(`faild invoking dispatches event: ${err}`)
      })
      const runs_list = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
        owner: process.env.G_BOT_OWNER,
        repo: process.env.G_BOT_REPO,
      }).then(async(data)=>{
        context.log.info(`run status: ${data.data.workflow_runs[0].status}`)
        bump_status = data.data.workflow_runs[0].status
        switch(bump_status){
            case 'completed':
            //GET LAST RELESA TAG
                const get_last_r = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
                    owner: process.env.G_BOT_OWNER,
                    repo: process.env.G_BOT_REPO,
                }).then(async(res)=>{
                    context.log.info(`last release obj \n ${JSON.stringify(res.data)}`)
                    last_r_t = res.data.tag_name
                    last_r_id = res.data.id
                    commits_arry.push(context.payload.commits)
                    finel_draft = g_note.create_release_draft(commits_arry, last_r_t)
                    context.log.info(`Finel release draft : \n ${finel_draft}`)
                }).catch((err)=>{
                    octokit.log.error(`faild getting last release: ${err}`)
                })
                break;

            case 'in_progress':
            //ADD TIME INTERVAL OF SEC
                setTimeout(async()=>{
                    const get_last_r = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
                        owner: process.env.G_BOT_OWNER,
                        repo: process.env.G_BOT_REPO,
                    }).catch((err)=>{
                    octokit.log.error(`faild getting last release: ${err}`)
                    })
                    relese_ob = get_last_r.data
                    last_r_t = get_last_r.data.tag_name
                    last_r_id = get_last_r.data.id
                    commits_arry.push(context.payload.commits)
                    finel_draft = g_note.create_release_draft(commits_arry, last_r_t)
                    context.log.info(`Finel release draft : \n ${finel_draft}`)
                },60000); // SET FOR ONE MIN
                break;
        }          
      }).then(async()=>{
          // UPDATE RELEASE WITH GENERATED DATE
         const update_teg = await octokit.request('PATCH /repos/{owner}/{repo}/releases/{release_id}', {
            owner: process.env.G_BOT_OWNER,
            repo: process.env.G_BOT_REPO,
            release_id: last_r_id,
            tag_name: last_r_t,
            body: finel_draft,
            draft: false,
          }).then(()=>context.log.info('release tag update pass!'))
        }).catch((err)=>{
        context.log.info(`release tag update faild: \n ${err}`)
        context.log.info(`catch err : ${last_r_t}`)
      })

      // TEST/MERGE/ASK FOR REVIEW


    
}




exports.release_process = release_process