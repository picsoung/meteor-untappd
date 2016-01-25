Uber = {};

OAuth.registerService('uber', 2, null, function(query) {
    var response = getTokenResponse(query);
    var identity = getIdentity(response.accessToken);

    console.log("REES",response);
    var serviceData = {
      id: identity.rider_id,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: (+new Date()) + (1000 * response.expiresIn)
    };

    var fields = identity;
    fields.name = identity.first_name + ' ' + identity.last_name

    console.log("return val",{serviceData: serviceData,options: {profile: fields}});
    return {
      serviceData: serviceData,
      options: {
        profile: fields
      }
    };
  });


var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'uber'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;

  try {
    response = HTTP.post(
      "https://login.uber.com/oauth/v2/token", {
        headers: {
          Accept: 'application/json'
        },
        params: {
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: OAuth._redirectUri('uber', config),
          code: query.code,
          state: query.state,
          grant_type:"authorization_code"
        }
      });
  } catch (err) {
    throw _.extend(new Error("here  - Failed to complete OAuth handshake with Uber. " + err.message),
                   {response: err.response});
  }

  if (!response.data) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Uber. " + response.data.error);
  } else {
    console.log("DATA",response.data);
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token
    };
  }
};

var getIdentity = function (accessToken) {
  try {
    var response = Meteor.http.get("https://api.uber.com/v1/me", {
        headers: { Authorization: 'Bearer ' + accessToken }
    });
  } catch (err) {
    throw new Error("Failed to fetch identity from Uber. " + err.message);
  }

  if (!response.data) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Uber. " + response.data.error);
  } else {
    console.log(response.data);
    return response.data;
  }
};



Uber.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
