# Inspectra

Inspectra is a web vulnerability scanner designed to identify security weaknesses in web applications, specifically focusing on HTML, JavaScript, and Content Security Policy (CSP) headers. This tool helps developers and security professionals ensure that their web applications are secure and compliant with best practices.

## Features

- Scans web applications for vulnerabilities in HTML and JavaScript.
- Analyzes Content Security Policy (CSP) headers for potential security issues.
- Provides detailed reports on identified vulnerabilities and recommendations for remediation.

## Prerequisites

Before running Inspectra, ensure you have the following installed on your machine:

- Docker
- Docker Compose

## Getting Started

To get started with Inspectra, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RStephanH/inspectra.git
   cd inspectra
   ```

2. **Directory Structure**:
   Ensure that your project directory contains the following structure:
   ```
   inspectra/
   ├── inspectra-engine/
   ├── inspectra-dashboard/
   └── docker-compose.yml
   ```

3. **Build and Run the Application**:
   Use Docker Compose to build and run the application. In the root directory of the project, execute the following command:
   ```bash
   docker compose up --build
   ```

4. **Access the Application**:
   - The backend service (Inspectra Engine) will be available at `http://localhost:3000`.
   - The frontend service (Inspectra Dashboard) will be available at `http://localhost:8888`.

5. **Using the Application**:
   - Open your web browser and navigate to `http://localhost:8888` to access the Inspectra Dashboard.
   - From the dashboard, you can initiate scans and view reports on vulnerabilities detected in your web applications.

## Stopping the Application

To stop the running services, press `CTRL + C` in the terminal where Docker Compose is running. You can also run the following command to stop and remove the containers:
```bash
docker compose down
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## Acknowledgments

- [Docker](https://www.docker.com/)
- [Next.js](https://nextjs.org/) for the frontend framework
- [Node.js](https://nodejs.org/) for the backend engine

