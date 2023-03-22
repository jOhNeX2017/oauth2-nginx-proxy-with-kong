# Installing Kong using docker

## For installing the kong just use the following command to up the docker containers for kong
    docker compose up -d
            or
    docker-compose up -d

Once the container is up and running, u can access the kong-admin at port 8001 & kong user port at 8000, 8443(with ssl).

Now open the terminal on your machine & run the following commands to register oauth2 plugins, dummy consumers, service & routes on kong.

## oauth2 plugin
    curl --location 'http://localhost:8001/plugins' \
    --header 'Content-Type: application/json' \
    --data '{
        "protocols": [
            "grpc",
            "grpcs",
            "http",
            "https"
        ],
        "service": null,
        "tags": null,
        "route": null,
        "enabled": true,
        "consumer": null,
        "name": "oauth2",
        "config": {
            "provision_key": "oauth2-nginx-proxy",
            "scopes": null,
            "enable_authorization_code": true,
            "enable_implicit_grant": true,
            "enable_client_credentials": false,
            "hide_credentials": false,
            "mandatory_scope": false,
            "anonymous": null,
            "token_expiration": 3600,
            "refresh_token_ttl": 1209600,
            "global_credentials": true,
            "reuse_refresh_token": false,
            "auth_header_name": "authorization",
            "accept_http_if_already_terminated": false,
            "enable_password_grant": false,
            "pkce": "lax"
        }
    }'
Note: Please make sure enable_implicit_grant is true in config

## dummy consumer
    curl --location 'http://localhost:8001/consumers' \
    --header 'Content-Type: application/json' \
    --data '{
        "username": "dummy-consumer"
    }'

## dummy consumer oauth2 configuration
    curl --location 'http://localhost:8001/consumers/dummy-consumer/oauth2' \
    --header 'Content-Type: application/json' \
    --data '{
        "client_type": "confidential",
        "client_id": "dummy-consumer-client-id",
        "hash_secret": false,
        "client_secret": "dummy-consumer-client-secret",
        "name": "dummy-consumer",
        "redirect_uris": [
            "https://dummy.com"
        ]
    }'

## dummy service
    curl --location --request POST 'http://localhost:8001/services/' \
    --header 'Content-Type: application/json' \
    --data '{
        "host": "mockbin.org",
        "name": "dummy-service",
        "port": 80,
        "path": null,
        "protocol": "http",
        "enabled": true
    }'

## dummy route
    curl -i -X POST \
    --url http://localhost:8001/services/dummy-service/routes \
    --data 'hosts[]=example.com'

Once all this in place u can call the api through kong by following step-

## generating the oauth2 token
    curl --location --request POST 'https://localhost:8443/oauth2/authorize?client_id=dummy-consumer-client-id&response_type=token&provision_key=oauth2-nginx-proxy&authenticated_userid=dummy-consumer&redirect_uri=https%3A%2F%2Fdummy.com' \
    --header 'Host: example.com'
#### Reponse: 
    {
        "redirect_uri": "https://dummy.com#access_token=5tprfxJk4FYl6KxvtPplAPuK483DoY4R&expires_in=3600&token_type=bearer"
    }

## API call with access token
    curl --location 'http://localhost:8000/' \
    --header 'Host: example.com' \
    --header 'Authorization: Bearer 5tprfxJk4FYl6KxvtPplAPuK483DoY4R'