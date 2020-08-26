# Ansible installation of Pizza Express example for the Test Assigment

## Disclaimer
The script set is over-structured a bit intentionally to demonstrate a common
 approach for more complicated Ansible installation

## Pre-requisites

- ansible should be installed and configured to
    - work using ssh keys (passwordless) with the target host
    - be able to run scripts in privileged mode (become has been used) on the target host
- docker should be installed on the target host and configured with desired docker hub repo credentials (use docker login). I believe creating dedicated docker hub repo and providing credentials using ansible-vault are redundant for this test assigment.
- python3 should be installed on the target host

The Ansible script installs python3-pip, docker python package and requests python package. Node/npm tests will be run using docker container, no node/npm installation required


## Configuration

All variables are configured using inventory file. 
Edit ./inventories/pizza-express.yaml and set:
- the host for pizza-express and redis servers.
As we are going to run both containers on the same host it should be the same address 
(127.0.0.1 is default).
- configure docker_hub_repo with desired docker hub repo name

## Usage

Run from the project directory
```
ansible-playbook ./roles/pizza-express.yaml -i ./inventories/pizza-express.yaml --ask-become-pass
```

## Remarks

### Redis service co-existence 

The task required redis service on all steps, includes unit testing and deployment.
The application code uses hardcoded default 127.0.0.1 to call redis.
We can meet the code requirements using 3 ways:
1. Run 2 process in the same container - the worst anti-pattern
2. Run 2 containers in k8s pod - we have no k8s
3. Use host docker networking instead of isolated user-defined bridge networking - not recommended from security perspective
So the service code has been modified to read env variable **REDIS_HOST** if provided, to connect external
Redis container. The default behavior preserved if the variable isn't configured
