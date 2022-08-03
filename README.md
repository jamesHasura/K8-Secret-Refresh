# Hasura Init Script

## Description

This project creates a hasura zero downtime deployment for scenarios when there
is a rotating credential that expires after a certain duration and needs to be refreshed & reloaded 
into hasura as an environment variable.

## How to Run?

### Step 1: Edit and build the DockerFile

Edit the ENV variables in the Dockerfile located at /Docker/Dockerfile. This
file has two environment variables:

1. TOKEN_REFRESH_ENDPOINT - The endpoint of the IDP provider in which the token
   will need to be retrieved.

   **Example: `TOKEN_REFRESH_ENDPOINT:http://localhost:3414`**

2. TOKEN_REFRESH_PERIOD - The time period denoted in cron-tab that the
   (`secret-refresh-pod`) will run a job to refresh the token. I suggest not
   setting this value above 28 minutes to ensure there is a buffer between the
   token expiration and the time it takes for nodes to restart.

   **`Example: TOKEN_REFRESH_PERIOD:"* */25 * * * *"`**

3. Build the Dockerfile - In the Dockerfile directory /Docker/Dockerfile, build
   the Dockerfile using the tag 'secret-refresh-pod'

   **`Example: Docker build -t 'secret-refresh-pod'`**

### Step 2: Edit the k8s Deployment File

Edit the ENV variables in the K8s deployment file located at /k8s/Deployment.
This file has two environment variables:

1. HASURA_GRAPHQL_DATABASE_URL: postgres DB connection string
   **`Example: HASURA_GRAPHQL_DATABASE_URL:postgres://postgres:postgrespassword@10.100.140.14:5432/postgres`**

2. (OPTIONAL) JWT_SERVICE_TOKEN: this is the JWT env variable that will be
   refreshed. The name can changed.

### Step 3: Run the K8s deployment files

1. **`kubectl apply -f db_pod.yaml`**
2. **`kubectl apply -f db_svc.yaml`**
3. **`kubectl apply -f scrt.yaml`**
4. **`kubectl apply -f role.yaml`**
5. **`kubectl apply -f deployment.yaml`**
6. **`kubectl apply -f deployment_svc.yaml`**
