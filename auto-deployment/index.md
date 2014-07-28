---
layout: default
title: GitHub Auto-Deployment ~ Workflows for free
repository_url: http://github.com/atmos/hubot-auto-deploy
---

<h1>GitHub Auto-Deployment</h1>
<hr/>

The goal of the auto-deployment service was to use the GitHub deployment API to facilitate workflows. People tend to either want their default branch to be auto-deployed or they want the default branch auto-deployed when tests pass. This decouples the workflows from the act of delivering the code. Right now the only provider that we have that supporst Deployments is the heroku beta addon.

<img src="https://cloud.githubusercontent.com/assets/704696/3698478/df9d14ee-13c2-11e4-9f76-7b5a0da624da.jpg" alt="service list" />

<h2>Deploy on Push</h2>

Upon receiving a push to the default branch, GitHub emits a deployment event for that sha.

<img src="https://cloud.githubusercontent.com/assets/704696/3698492/3942dc04-13c3-11e4-9737-f2b69b5f49bb.jpg" alt="auto deployment ui" />

<h2>Deploy on Commit Status</h2>

Upon receiving a [commit status](https://developer.github.com/v3/repos/statuses/) to the default branch, GitHub emits a deployment event if the build was successful.

<h2>Chat Configuration</h2>

You can configure things on a per-repo basis via chat with the [hubot-auto-deploy](https://github.com/atmos/hubot-auto-deploy) script. This saves you from having to constantly look up a GitHub API token. Hubot will configure the auto-deploy integration for you from chat.

<h2>Deployment</h2>

This is all managed on your GitHub instance through the Settings section for your repo. You simply provide a GitHub personal access token with the `repo:deployment` scope.
