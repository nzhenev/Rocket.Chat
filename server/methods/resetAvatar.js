Meteor.methods({
  resetAvatar() {
    var user;
    if (!Meteor.userId()) {
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {
        method: 'resetAvatar'
      });
    }
    if (!RocketChat.settings.get("Accounts_AllowUserAvatarChange")) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {
        method: 'resetAvatar'
      });
    }
    user = Meteor.user();
    RocketChatFileAvatarInstance.deleteFile(user.username + ".jpg");
    RocketChat.models.Users.unsetAvatarOrigin(user._id);
    RocketChat.Notifications.notifyLogged('updateAvatar', {
      username: user.username
    });
  }
});

DDPRateLimiter.addRule({
  type: 'method',
  name: 'resetAvatar',
  userId() {
    return true;
  }
}, 1, 60000);
