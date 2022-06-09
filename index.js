require('dotenv').config()
const upmodel = require('./src/uppr') 
const releasemodel = require('./src/release')
const usetests = require('./src/runutests')
const ask_review = require('./src/askreview')
const starte2e = require('./src/jenkinspipes')
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
      var commands_array = ['/UP_PR', '/RUN_U_T', '/ASK_R', '/ETOE']
      if (commands_array.includes(massage_content) && pr_publisher == comment_sender) { 

        context.log.info(`issue commentted :   \n ${JSON.stringify(context)}`)

        switch (massage_content) {
          case '/UP_PR': //WORKS
              const getupprmodel = await upmodel.up_pr(context)  // UPDATE PR BRANCH
              break;
          case '/RUN_U_T': //WORKS
              const testrun = await usetests.runutests(context)  // RUN UTESTS WORKFLOW
              break;
          case '/ASK_R': //WORKS
              const getreview = await ask_review.ask_review(context) // ASK FOR REVIEW  
              break;
          case '/ETOE'://MODIFY JENKINS FILE TO GET FORKED.
              const start_jenkins = await starte2e.jenkins_test(context) // START E2E TESTS
              break;
          default:
              context.log.info(`Command ${massage_content} not found`)
              break;
        }

      }else{
        context.log.info(`User ${context.payload.comment.user.login} is Not PR maintainer`)
      }


    }else{
      context.log.info("NONONONO FROM PULL REQ : \n  " +  context.payload.issue.html_url)

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
