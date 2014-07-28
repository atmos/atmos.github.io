---
layout: default
title: GitHub Auto-Deployment ~ Workflows for free
repository_url: http://github.com/atmos/hubot-auto-deploy
---

# GitHub Auto-Deployment
<hr/>

The goal of the auto-deployment service is to use the [GitHub Deployment API](https://developer.github.com/v3/repos/deployments/) to facilitate deployment workflows. This helps implement one portion of [GitHub Flow](https://guides.github.com/introduction/flow/).

### Auto-Deployment Behaviors

* Push changes to the application when the default branch is pushed to.
* Push changes to the application when the default branch passes ci tests.
* Continuously push branch deploys when new commits are added and tests pass.

## Deploy on Push

Upon receiving a push to the default branch, GitHub emits a deployment event for that sha. This is great for workflows like "push to heroku" to see your changes live in 30-60 seconds.

## Deploy on Commit Status

Upon receiving a [commit status](https://developer.github.com/v3/repos/statuses/) to the default branch, GitHub emits a deployment event if the commit status is successful.

## Options

GitHub will handle creating the Deployments via the API, but you will still need to configure a system that does the actual deployment for you.

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

## TODO

* More real-world testing.
* Support for status_contexts and multi-commit status aware.
* Support for continuous-deployment on branch deploys.
