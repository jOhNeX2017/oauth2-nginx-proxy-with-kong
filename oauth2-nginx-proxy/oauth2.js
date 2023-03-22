// function to check the value is valid or not.
function isValid(data) {
  return !(data === null ||
    data === "null" ||
    data === "" ||
    data === undefined ||
    data.length === 0 ||
    data === "{}" ||
    data === "NOT AVAILABLE" ||
    data === "NaN");
}

// Function to get the access token
function getAccessToken(r) {
  r.warn(
    "OAuth sending token with UserId: " + r.variables.oauth_authenticated_userid
  );

  // calling the oauth_token_endpoint
  r.subrequest("/_oauth2_send_token_request", function (reply) {
    r.warn("OAuth token introspection response: " + JSON.stringify(reply));
    if (reply.status != 200) {
      r.error(
        "OAuth unexpected response from authorization server (HTTP " +
          reply.status +
          "). " +
          reply.body
      );
      r.return(401);
    }

    try {
      r.warn("OAuth token introspection response: " + reply.responseBody);
      let response = reply.responseBody;
      response = JSON.parse(response);
      r.warn("response TYPE:" + JSON.stringify(response));
      if (response.redirect_uri) {
        
        // Logic to fetch the access token from the response
        let access_token = response.redirect_uri.split("access_token=");
        if (isValid(access_token) && isValid(access_token[1])) {

          access_token = access_token[1].split("&expires_in=3600");
          
          if (isValid(access_token) && isValid(access_token[0])) {
            
            access_token = access_token[0];
            r.warn("access_token : " + access_token);
            r.headersOut["upstream_http_header"] = access_token;
            r.variables.access_token = access_token;  // seting the token to nginx global variable access_token 
            r.status = 204;
            r.warn("Headers Data: " + JSON.stringify(r.headersOut));
            r.sendHeader();
            r.finish();

          }else {
            r.warn(
              "Error while getting the token from the reponse" +
                reply.responseBody
            );
          }
        }else {
          r.warn(
            "Error while getting the token from the response" +
              reply.responseBody
          );
        }
      } else {
        r.warn(
          "Error while getting the response from the Oauth server" +
            reply.responseBody
        );
      }
    } catch (e) {
      r.error("OAuth token introspection response is not JSON: " + reply.body);
      r.return(401);
    }
  });
  r.return(401);
}

export default { getAccessToken };
