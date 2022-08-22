require('dotenv').config()
const upmodel = require('./src/uppr') 
const releasemodel = require('./src/release')
const usetests = require('./src/runutests')
const ask_review = require('./src/askreview')
const starte2e = require('./src/jenkinspipes')
const { bump_v } = require('./src/trigger_bump_v')
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {


  // app.onAny(async (context) => {
  //   context.log.info({ event: context.name, action: context.payload.action });
  // });


  app.onError(async (error) => {
    app.log.error(error);
  });
  

  app.on("pull_request",async (context) =>{
 
  })

  app.on("issue_comment",async (context) =>{
    // CHECK IF COMMANT IS CREATED ON PR.
    if(context.payload.action == "created" && context.payload.issue.html_url.includes('/pull/')){  

      
      var massage_content = context.payload.comment.body
      var pr_publisher = context.payload.issue.user.id
      var comment_sender = context.payload.comment.user.id
      //CHECK IF PR COMMAND SENDER == PR PUBLISHER
      if (pr_publisher == comment_sender) { 

        context.log.info(`issue commentted :   \n ${JSON.stringify(context)}`)

	        // update pr branch against head repo master
	        if (massage_content.includes('/UP_PR')){
              const getupprmodel = await upmodel.up_pr(context)  // UPDATE PR BRANCH
              break;
          }// run worflow file
          if (massage_content.includes('/RUN_U_T')){
              const testrun = await usetests.runutests(context)  // RUN UTESTS WORKFLOW
              break;
          }// ask review from repo team list
          if (massage_content.includes('/ASK_R')){ 
              const getreview = await ask_review.ask_review(context) // ASK FOR REVIEW  
              break;
          }// run jenknis jobs
          if (massage_content.includes('/ETOE')){//MODIFY JENKINS FILE TO GET FORKED.
              const start_jenkins = await starte2e.jenkins_test(context) // START E2E TESTS
              break;
          }
          if (massage_content.includes('/BMP_V')){//RUN BUMP VERSION WORKFLOW. NEED TO PROVIDE BUMP LEVEL.
              const bmp_v = await bump_v(context,massage_content)
              break;
          }
          else{
              context.log.info(`Massage: "${massage_content}" not include Bot Instractions.`)
              break;
          }

      }else{
        context.log.info(`User ${context.payload.comment.user.login} is Not PR maintainer`)
      }


    }else{
      context.log.info(context.payload.issue.html_url)

    }
  })

  // START BUMPTAG WORKFLOW AND UPDATE RELEASE NOTE. 
  app.on("push", async (context) => {
    target_branch = context.payload.ref
    if(target_branch == "refs/heads/main"){
      const getreleaseprosses = releasemodel.release_process(context) 
    }
  })
  
}


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
// };
