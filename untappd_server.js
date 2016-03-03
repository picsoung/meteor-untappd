Untappd = {};

OAuth.registerService('untappd', 2, null, function(query) {
  query.state ="eyJsb2dpblN0eWxlIjoicG9wdXAiLCJjcmVkZW50aWFsVG9rZW4iOiJ5R2hodW5DeW91NldMMkttRyIsImlzQ29yZG92YSI6ZmFsc2V9="
    var response = getTokenResponse(query);
    var identity = getIdentity(response.accessToken);
    console.log("HEEEERE")

    var serviceData = {
      accessToken: response.accessToken,
    };

    var fields = identity;
    fields.name = identity.first_name + ' ' + identity.last_name

    // console.log("return val",{serviceData: serviceData,options: {profile: fields}});
    // debugger
    return {
      serviceData: serviceData,
      options: {
        profile: fields
      }
    };
  });


var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'untappd'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  console.log(OAuth._redirectUri('untappd', config));
  try {
    var url = "https://untappd.com/oauth/authorize/?"
    url+= "client_id="+config.client_id
    url+="&client_secret="+config.client_secret
    url+= "&response_type=code"
    url+= "&redirect_url="+OAuth._redirectUri('untappd', config)
    url+= "&code="+query.code;

    console.log("state",query.state);
    response = HTTP.get(url);
  } catch (err) {
    throw _.extend(new Error("here  - Failed to complete OAuth handshake with Untappd. " + err.message),
                   {response: err.response});
  }

  if (!response.data) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Untappd. " + response.data.error);
  } else {
    return {
      accessToken: response.data.response.access_token
    };
  }
};

var getIdentity = function (accessToken) {
  try {
    var url = "https://api.untappd.com/v4/user/info?access_token="+accessToken
    var response = HTTP.get(url);
  } catch (err) {
    throw new Error("Failed to fetch identity from Untappd. " + err.message);
  }

  if (!response.data) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Untappd. " + response.data.error);
  } else {
    return response.data.response.user;
  }
};



Untappd.retrieveCredential = function(credentialToken, credentialSecret) {
  console.log(credentialToken,credentialSecret)
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
