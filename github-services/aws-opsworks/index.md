---
layout: default
title: AWS OpsWorks ~ Deploy GitHub repos to amazon's cloud
repository_url: https://github.com/github/github-services/blob/master/lib/services/aws_opsworks.rb
---

# AWS OpsWorks Service
<hr/>

The OpsWorks service allows you to deploy a specific branch to Amazon's [OpsWorks][6] cloud. Using the deployments API you can have multi-environment deployments as well.

By default you can deploy one app. When it receives a `push` event it will create a deployment for the application in Amazon OpsWorks.

## Configuration

| Attributes            | Description                                     |
|-----------------------|-------------------------------------------------|
| app_id                | "OpsWorks ID" on the app setting page in the AWS OpsWorks Console or see [AppId][8]. |
| stack_id              | "OpsWorks ID" on the stack setting page in the AWS OpsWorks Console or see [StackId][7]. |
| branch_name           | "Branch/Revision" configured for that app in the AWS OpsWorks Console or see [Revision][9].
| aws_access_key_id     | Access key id of an AWS IAM user having the permission for the `opsworks:CreateDeployment` action.|
| aws_secret_access_key | Corresponding secret access key of the AWS IAM user. |

### IAM User Configuration

Try to identify the least number of privileges required to trigger these deployments.

## Multi-Environment Deployments

If you're using [hubot-deploy][10] then you can specify different stacks and applications and group them into an environment. An example `apps.json` script for hubot looks like this.

### apps.json entry

```json
"camo": {
  "provider": "aws_opsworks",
  "repository": "atmos/camo",
  "environments": ["production", "staging"],

  "opsworks": {
    "production": {
      "app_id": "<app_id>",
      "stack_id": "<stack_id>"
    },
    "staging": {
      "app_id": "<staging_app_id>",
      "stack_id": "<staging_stack_id>"
    }
  }
}
```
The associated GitHub Deployment API payload ends up looking like this:

### Deployment API Payload

```json
"payload": {
  "name": "camo",
  "config": {
    "opsworks": {
      "production": {
        "app_id": "<app_id>",
        "stack_id": "<stack_id>"
      },
      "staging": {
        "app_id": "<staging_app_id>",
        "stack_id": "<staging_stack_id>"
      }
    }
  }
}
```

You can then issue commands like:

`hubot deploy camo to staging`

or

`hubot deploy camo/my-topic-branch to production`.

The deployment will still be triggered with the credentials stored on GitHub.

[1]: https://github.com/github/github-services
[2]: https://developer.github.com/v3/repos/deployments/
[3]: https://help.github.com/articles/creating-an-access-token-for-command-line-use
[4]: https://devcenter.heroku.com/articles/oauth#direct-authorization
[5]: https://devcenter.heroku.com/articles/platform-api-quickstart#authentication
[6]: http://aws.amazon.com/opsworks/
[7]: http://docs.aws.amazon.com/opsworks/latest/APIReference/API_Stack.html
[8]: http://docs.aws.amazon.com/opsworks/latest/APIReference/API_App.html
[9]: http://docs.aws.amazon.com/opsworks/latest/APIReference/API_Source.html
