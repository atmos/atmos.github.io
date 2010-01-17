--- 
layout: post
title: consider openid
---
There was a bit of chatter the other day in #caboose about "openid":http://www.openidenabled.com/.  A lot of people seem to think the idea is good but they have this strange aversion to using it in their app.  A few people mentioned that there wasn't a tutorial anywhere, and since there was no "uber plugin":http://svn.techno-weenie.net/projects/plugins for them to take advantage of it, why bother?  The only counterpoint to using it that stuck out was first time end-users trying to understand how openid works.  Most people are familiar with the silly create user with password followed by a confirmation email workflow, I think it might be time for a change.  Everyone I know hates remembering usernames and passwords for the ever-growing number of sites on the web that require some sort of authentication.  

I've created a generator based on technoweenie's "restful authentication plugin":http://svn.techno-weenie.net/projects/plugins/restful_authentication/ that leverages the "openid consumer plugin":http://svn.eastmedia.com/svn/bantay/plugins/open_id_consumer/.  You can checkout the "README":http://svn.caboo.se/plugins/repository/file/atmos/restful_openid_authentication/README for how to get going.

OpenID auth is seriously *SIMPLE*.  Check out this integration test to see how things flow for an authentication attempt.  The network response interaction is being stubbed out, there is a little more going on which the open_id_consumer plugin thankfully shelters us from.

<filter:jscode lang="ruby">
class SessionsOpenidAuthTest < ActionController::IntegrationTest
  fixtures :users

  def setup
    setup_stubs
    OpenID::Consumer.any_instance.stubs(:complete).returns(OpenID::SuccessResponse.new(1, {}))
    OpenID::SuccessResponse.any_instance.stubs(:status).returns(OpenID::SUCCESS)
    OpenID::SuccessResponse.any_instance.stubs(:extension_response).returns(HashWithIndifferentAccess.new(:nickname => 'quentin', :email => 'quentin@example.com'))    
    OpenID::SuccessResponse.any_instance.stubs(:identity_url).returns("http://quentin.myopenid.com")
  end

  def test_user_should_be_able_to_authenticate
    get "sessions/new"
    assert_response :success

    post "sessions/create", :openid_url => 'http://quentin.myopenid.com'
    assert_response :redirect
    # the user is dished off to myopenid.com
    # it checks a cookie to see if they've previously logged in, otherwise they're prompted to login
    # if it's the first time they've registered with your site, they pick what info to provide to you(age,gender,address,etc)

    # myopenid.com is going to redirect back to our server with a bunch of parameters
    # we find or create a user based on the users openid url
    get "sessions;complete"
    assert_response :redirect
    assert_redirected_to '/'
    assert_equal assigns(:user).id, session[:user]
  end
end
</filter:code>

So the next time you want to tie a few sites together or want to be subtlety progressive, know that there's a generator out there for you if openid *might* be the right solution.
