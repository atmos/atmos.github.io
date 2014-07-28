---
layout: default
title: GitHub Auto-Deployment ~ Workflows for free
repository_url: http://github.com/atmos/hubot-auto-deploy
---

# GitHub Auto-Deployment
<hr/>

The goal of the auto-deployment service is to use the [GitHub Deployment API](https://developer.github.com/v3/repos/deployments/) to facilitate deployment workflows. This helps implement one portion of [GitHub Flow](https://guides.github.com/introduction/flow/).

<img src="https://cloud.githubusercontent.com/assets/38/3716148/60484298-1603-11e4-8f30-30a381f5c89d.jpg" alt="github flow" />

There's three distinct behaviors around auto-deployment. They work like this:

### Deploy on Push

Upon receiving a push to the default branch, GitHub emits a deployment event for that sha. This is great for workflows like "push to heroku" to see your changes live in 30-60 seconds.

Example:

* You run `git push origin master`
* GitHub creates a deployment for your push
* The HerokuBeta service picks up the deployment and pushes your master branch out.

### Deploy on Commit Status

Upon receiving a [commit status](https://developer.github.com/v3/repos/statuses/) to the default branch, GitHub emits a deployment event if the commit status is successful.

Example:

* You run `git push origin master`
* GitHub dispatches a push event to your CI system.
* Your CI system calls back to GitHub stating that the commit passed tests.
* GitHub creates a deployment for your successful commit status.
* The HerokuBeta service picks up the deployment and pushes your master branch out.

### Branch based continuous deployment

<em>This is currently unimplemented</em>

Example:

* You deploy a non-default branch from chat `/deploy myapp/mybranch`.
* The HerokuBeta service picks up the deployment and pushes your 'mybranch' branch out.
* You add commits and push to the 'mybranch' branch.
* GitHub dispatches a push event to your CI system.
* Your CI system calls back to GitHub stating that the commit passed tests.
* GitHub creates a deployment for your successful commit status on the deployed branch.
* The HerokuBeta service picks up the deployment and pushes your 'mybranch' branch out.

## Options

GitHub will handle creating the Deployments via the API, but you will still need to configure a system that does the actual deployment for you.

### Supported Deployment Systems

Right now there's only two easy ways to deploy. You can use [heaven](https://github.com/atmos/heaven) with webhooks, or you can use the HerokuBeta service.

* HerokuBeta GitHub Service
* Webhooks

### Configuration

| Attributes       | Description                                     |
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
