Uber = {};

// Request Uber credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Uber.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'uber'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError()
    );
    return;
  }

  var credentialToken = Random.secret();

  var scope = (options && options.requestPermissions) || [];
  var flatScope = _.map(scope, encodeURIComponent).join(',') || 'profile';

  var redirectURI = OAuth._redirectUri('uber', config);
  var encodedRedirectURI = encodeURIComponent(redirectURI);

  var loginStyle = OAuth._loginStyle('uber', config, options);

  var loginUrl =
        'https://login.uber.com/oauth/v2/authorize?'+
        'response_type=code' +
        '&client_id=' + config.client_id +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)+
        '&scope=' + flatScope +
        '&redirect_uri=' + encodedRedirectURI;

  OAuth.launchLogin({
    loginService: 'uber',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {width: 900, height: 600}
  });
};
