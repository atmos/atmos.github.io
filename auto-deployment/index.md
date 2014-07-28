---
layout: default
title: GitHub Auto-Deployment ~ Workflows for free
repository_url: http://github.com/atmos/hubot-auto-deploy
---

# GitHub Auto-Deployment
<hr/>

On GitHub everything revolves around repositories. In a lot of cases these repositories are hosts to applications. If you subscribe to the idea that the default branch of your application should always be deployable then auto-deployment will hopefully save you some time.

### Auto-Deployment Behaviors

* Push changes to the application when the default branch is pushed to.
* Push changes to the application when the default branch passes ci tests.
* Continuously push branch deploys when new commits are added and tests pass.

The goal of the auto-deployment service is to use the [GitHub Deployment API](https://developer.github.com/v3/repos/deployments/) to facilitate workflows regardless of how you're getting your code out to update your applications. This decouples the workflows from the act of delivering the code.

### Supported Deployment Systems

Right now there's only two easy ways to deploy. You can use [heaven](https://github.com/atmos/heaven) with webhooks, or you can use the HerokuBeta service.

* HerokuBeta GitHub Service
* Webhooks

### Configuration

| Attributes       |                                                 |
|------------------|-------------------------------------------------|
| github_token     | A GitHub [personal oauth token]() with `repo:deployment` scope |
| environments     | A comma delimited list of environments to deploy to automatically. |
| push_on_status   | When set to `1` deployments are only created on successful commit statuses. |
| status_contexts  | A comma delimimted list of commit status context names to verify against.<b>Unimplemented</b>|

These values are all available in your repository's admin settings under the Webhooks & Services section.

### Chat Configuration

The easiest way to configure auto-deployment is via Hubot. You can configure things on a per-repo basis via hubot with the [hubot-auto-deploy](https://github.com/atmos/hubot-auto-deploy) script. This saves you from having to do things like look up a GitHub API token or remember the exact syntax.

## Deploy on Push

<img src="https://cloud.githubusercontent.com/assets/704696/3698478/df9d14ee-13c2-11e4-9f76-7b5a0da624da.jpg" alt="service list" />

Upon receiving a push to the default branch, GitHub emits a deployment event for that sha. This is great for workflows like "push to heroku" to see your changes live in 30-60 seconds.

## Deploy on Commit Status

<img src="https://cloud.githubusercontent.com/assets/704696/3698492/3942dc04-13c3-11e4-9737-f2b69b5f49bb.jpg" alt="auto deployment ui" />

Upon receiving a [commit status](https://developer.github.com/v3/repos/statuses/) to the default branch, GitHub emits a deployment event if the commit status is successful.

## TODO

* More real-world testing.
* Support for status_contexts and multi-commit status aware.
* Support for continuous-deployment on branch deploys.
