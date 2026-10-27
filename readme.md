# SentinelOps — AI-Driven CI/CD Remediation Agent via GitLab Duo Chat

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SentinelOps is an autonomous AI agent integrated with GitLab Duo Chat designed to monitor, diagnose, and remediate CI/CD pipeline failures in real time. It eliminates manual log analysis by transforming raw build errors into context-aware root cause diagnoses and actionable fixes directly inside the developer workspace.

---

## Key Features

- **Automated Log Analysis**: Intercepts failed runner jobs (such as `docker_build` failures) and extracts key execution error signals.
- **Intelligent Root Cause Diagnosis**: Correlates raw build outputs with codebase context to identify dependency conflicts, missing scripts, or configuration flaws.
- **Actionable Remediation**: Generates instant, copy-pasteable code fixes (e.g., corrected Dockerfiles, dependency adjustments) directly inside GitLab Duo Chat.
- **Green DevSecOps**: By accelerating error resolution, SentinelOps eliminates redundant build iterations, directly reducing CI/CD runner compute hours and energy consumption.

---

## System Architecture & Pipeline

SentinelOps is built on a clean microservices architecture deployed to Google Cloud Run and integrated into a complete 5-stage DevSecOps pipeline:

1. **Create**: Source code verification & environment bootstrap.
2. **Verify**: Automated unit and integration testing via Node.js/Jest.
3. **Package**: Container build and automated vulnerability scanning.
4. **Secure**: Static Application Security Testing (SAST) and dependency audits.
5. **Monitor**: Post-deployment health verification and real-time failure diagnostics via GitLab Duo Chat.

---

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **AI Agent Integration**: GitLab Duo Chat
- **CI/CD & DevSecOps**: GitLab Pipelines, Docker, Google Cloud Run
- **Database**: PostgreSQL / MongoDB

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Christopher Adegoke
