---
layout: default
title: Heroku Beta ~ Deploy GitHub repos to heroku with ease
repository_url: https://github.com/github/github-services/blob/master/lib/services/heroku_beta.rb
---

# Herkou Beta
<hr/>

The Heroku Beta integration is a [github-service][1] that responds to [deployment events][2] on GitHub to ship your code to a [heroku][7] application.

## Setup

You can configure the Heroku Beta from the 'Settings' link on your repository. Then click on 'Webhooks & Services'.

![Configuration Screen](https://cloud.githubusercontent.com/assets/704696/3985470/d47c1a9a-2891-11e4-8646-1b8882c02c81.jpg)

### Configuration

| Attributes       | Description                                     |
|------------------|-------------------------------------------------|
| name             | The heroku application name to deploy to. |
| heroku_token     | A Heroku [direct authorization][4] or [api token][5]. |
| github_token     | A GitHub [personal oauth token][3] with `repo_deployment` scope |

## TODO

* Fix up deployment statuses to mark as complete with a link to the heroku dashboard.
* Support multiple environments via the payload.

![GitHub Flow](https://cloud.githubusercontent.com/assets/38/3985358/e93afc18-2890-11e4-97ac-7ccf847a4b7f.png)

[1]: https://github.com/github/github-services
[2]: https://developer.github.com/v3/repos/deployments/
[3]: https://help.github.com/articles/creating-an-access-token-for-command-line-use
[4]: https://devcenter.heroku.com/articles/oauth#direct-authorization
[5]: https://devcenter.heroku.com/articles/platform-api-quickstart#authentication
[6]: https://www.heroku.com/
[7]: https://www.heroku.com/
