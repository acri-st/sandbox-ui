# DESP-AAS Sandbox UI


## Table of Contents

- [Introduction](#Introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [Deployment](#deployment)
- [License](#license)
- [Support](#support)

## Introduction

###  What is the DESP-AAS Sandbox?

DESP-AAS Sandbox is a service that allows users to develop applications and models using cloud based services and to ease the deployment to the DESP-AAS collaborative platform.

The Microservices that make up the Sandbox project are the following: 
- **Auth** Authentication service tu authenticate users.
- **Project management** Project management system.
- **VM management** manages the virtual machines for the projects. These virtual machines are where the user manages their project and develops.
- **Storage** Manages the project git files.

![DESP-AAS Sandbox UI Architecture](https://github.com/acri-st/DESPAAS-sandbox-ui/blob/development/docs/architecture.png?raw=true)


### What is the Sandbox UI?

The sandbox UI is a web application that interfaces with the microservices that comprise the DESP-AAS (Data Exchange and Service Platform - As A Service) ecosystem. It provides a user-friendly interface for testing, debugging, and interacting with various microservices in a controlled sandbox environment.

The Sandbox UI also uses a DESP-AAS common library that contains interfaces to DESP-AAS services and styling.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16.x or higher)
- **Git** 
- **Docker** Docker is mainly used for the test suite, but can also be used to deploy the project via docker compose

## Installation

1. Clone the repository:
```bash
git clone https://github.com/acri-st/DESPAAS-sandbox-ui.git
# OR
git clone git@github.com:acri-st/DESPAAS-sandbox-ui.git
cd sandbox-ui
```

## Development

## Development Mode

### Standard local development

Setup environment
```bash
make setup
```

Start the development server:
```bash
make start
```

The application will be available at `http://localhost:8100`

To clean the project and remove node_modules and other generated files, use:
```bash
make clean
```

### Production Build

Build the application for production:
```bash
make build
```
#### Docker local development 
Setup environment
```bash
make setup DEPLOY=docker
```

Start the development server:
```bash
make start DEPLOY=docker
```

Stop the development server:
```bash
make stop DEPLOY=docker
```

The application will be available at `http://localhost:8100`

To clean the project and remove node_modules and other generated files, use:
```bash
make clean DEPLOY=docker
```

### Production Build

Build the application for production:
```bash
make build
```

## Testing

To run tests, make sure the local project is running and then run the test suite:
```bash
make test
```

## Contributing

Check out the [CONTRIBUTING.md](https://github.com/acri-st/DESPAAS-sandbox-ui/blob/development/CONTRIBUTING.md) for more details on how to contribute.