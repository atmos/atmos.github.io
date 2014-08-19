---
layout: default
title: GitHub Auto-Deployment ~ Workflows for free
repository_url: http://github.com/atmos/hubot-auto-deploy
---

# GitHub Auto-Deployment
<hr/>

GitHub Auto-Deployment is a workflow service for software teams deploying applications.  It uses simple interactions around git usage to decide when code changes to your application should be deployed.

[![GitHub Flow](https://cloud.githubusercontent.com/assets/38/3716148/60484298-1603-11e4-8f30-30a381f5c89d.jpg)](https://guides.github.com/introduction/flow/)

## Behaviors

There's two different ways to trigger deployments, by pushing and by commit status.

### Deploy on Push

Upon receiving a push to the default branch, GitHub emits a deployment event for that sha. This is great for workflows where you push to GitHub and see changes on heroku in 30-60 seconds.

Example:

* You run `git push origin master`
* GitHub creates a deployment for your push
* The HerokuBeta service picks up the deployment and pushes your master branch out.

![Push to Deploy](https://cloud.githubusercontent.com/assets/38/3716383/ce41d122-160a-11e4-927c-b13b8bd44350.gif)

### Deploy on Commit Status

Upon receiving a [commit status](https://developer.github.com/v3/repos/statuses/) to the default branch, GitHub emits a deployment event if the commit status is successful.

Example:

* You run `git push origin master`
* GitHub dispatches a push event to your CI system.
* Your CI system calls back to GitHub stating that the commit passed tests.
* GitHub creates a deployment for your successful commit status.
* The HerokuBeta service picks up the deployment and pushes your master branch out.

![CI Based Deploy](https://cloud.githubusercontent.com/assets/38/3716387/0436fd3e-160b-11e4-9aba-4a3b4e0934c8.gif)

## Setup

Auto-Deployment is available as a [github service](https://github.com/github/github-services) and is configured in your repository's admin settings under the Webhooks & Services section.

GitHub will handle creating Deployments via the API, but you will still need to configure a system that does the actual deployment for you.

### Supported Deployment Systems

Right now there's only a few easy ways to deploy. You can use [heaven](https://github.com/atmos/heaven) with webhooks, the HerokuBeta GitHub service, or the AWS OpsWorks GitHub service.

### Configuration

| Attributes       | Description                                     |
|------------------|-------------------------------------------------|
| github_token     | A GitHub [personal oauth token]() with `repo:deployment` scope |
| environments     | A comma delimited list of environments to deploy to automatically. |
| push_on_status   | When set to `1` deployments are only created on successful commit statuses. |
| status_contexts  | A comma delimimted list of commit status context names to verify against.<b>Unimplemented</b>|

### Chat Configuration

The easiest way to configure auto-deployment is via Hubot. You can configure things on a per-repo basis via hubot with the [hubot-auto-deploy](https://github.com/atmos/hubot-auto-deploy) script. This saves you from having to do things like look up a GitHub API token or remember the exact syntax.

## TODO

* More real-world testing.
* Support for status_contexts and multi-commit status aware.
* Support for continuous-deployment on branch deploys.

### Branch based continuous deployment

<em>Desired, but currently unimplemented</em>

Example:

* You deploy a non-default branch from chat `/deploy myapp/mybranch`.
* The HerokuBeta service picks up the deployment and pushes your 'mybranch' branch out.
* You add commits and push to the 'mybranch' branch.
* GitHub dispatches a push event to your CI system.
* Your CI system calls back to GitHub stating that the commit passed tests.
* GitHub creates a deployment for your successful commit status on the deployed branch.
* The HerokuBeta service picks up the deployment and pushes your 'mybranch' branch out.
