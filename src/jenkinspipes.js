const bot_agent = require('../model/jenkinsmodel')
const pr_model = require('../model/get_pr')
const collaborators = require('../model/getteam')


const jenkins_test = async (context) => {
  var clone_url = ""
  var repo_collaborators = []

  newlist = await collaborators.get_team(context)
  .then((res)=>{
      repo_collaborators = res
      context.log.info("repo_collaborators: " + repo_collaborators)
  }).catch((err)=>context.log.info(err))
  
  //CHEECK IF COMMAND SENT BY TEAM MEMMBER.
  if(repo_collaborators.includes(context.payload.comment.user.login)){

      // GET FORKED BRANCH CLONE URL {clone_url}
      const getbranch = await pr_model.get_pr(context).then((res)=>{
        clone_url = `${res.data.head.repo.clone_url}@${res.data.head.ref}`
      }).catch((err)=>console.log(err))

      bot_agent.build_with_params(process.env.JENKINS_JOB_NAME,{
        token:process.env.JENKINS_TOKEN,
        TEFLO_FORKED_BRANCH:clone_url,
      },function(err,data) {
        if (err){console.log(`build job ${process.env.JENKINS_JOB_NAME} faild with error : \n  ${err}`)}
        console.log(data)
      })     
  }
    
  
}

exports.jenkins_test = jenkins_test
