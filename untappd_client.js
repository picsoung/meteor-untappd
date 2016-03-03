Untappd = {};

// Request untappd credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Untappd.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'untappd'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError()
    );
    return;
  }

  var credentialToken = Random.id();

  var scope = (options && options.requestPermissions) || [];
  var flatScope = _.map(scope, encodeURIComponent).join(',') || 'profile';

  var redirectURI = OAuth._redirectUri('untappd', config);
  var encodedRedirectURI = encodeURIComponent(redirectURI);

  var loginStyle = OAuth._loginStyle('untappd', config, options);

  var loginUrl =
        'https://untappd.com/oauth/authenticate'+
        '?response_type=code' +
        '&client_id=' + config.client_id +
        '&redirect_url=' + encodedRedirectURI+
        '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

        console.log(OAuth._stateParam(loginStyle, credentialToken))

  OAuth.launchLogin({
    loginService: 'untappd',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {width: 900, height: 600}
  });
};
