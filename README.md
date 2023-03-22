# oauth2-nginx-proxy-with-kong
Using nginx proxy for OAuth2 requests with Kong

To get started with oauth2-nginx-proxy, follow these steps:

### 1.  Deploy Kong with the OAuth2 plugin enabled. You can use the instructions provided in the "kong" folder for testing purposes.

### 2.  Create the Nginx image using the Dockerfile provided in the "oauth2-nginx-proxy" folder:
    docker build -t oauth2-nginx-proxy:latest .

### 3. Run the container using the Docker image:
    docker run -d -p 3030:80 oauth2-nginx-proxy:latest
    Note: Please change the Kong URL in the "oauth2-nginx-proxy/oauth2.conf" file before running the container.

### 4. Open the browser, go to the URL 
    http://localhost:3030/
![Alt text](screenshots/home.png?raw=true "Home Page")    

### 5. On the webpage click on the call API button, on the inspect window over the network tab you can see that API is giving you proper reponse.
![Alt text](screenshots/api-call.png?raw=true "Home Page")    