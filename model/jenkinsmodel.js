

// var jenkins = require('jenkins')({
//     baseUrl: `https://${process.env.JENKINS_USER_ID}:${process.env.JENKINS_TOKEN}@${process.env.JENKINS_URL}`,
//     crumbIssuer: true,
// });
var jenkins = require('jenkins-api').init(`https://${process.env.JENKINS_USER_ID}:${process.env.JENKINS_TOKEN}@${process.env.JENKINS_URL}`)

module.exports = jenkins