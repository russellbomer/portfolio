# Documentation Plan: Portfolio (Operations & DevOps)

**Created**: 2026-02-17  
**Target Audience**: DevOps engineers, infrastructure managers, system administrators  
**Documentation Standard**: Diátaxis  
**Status**: Planning Phase

---

## Overview

This portfolio project has foundational deployment infrastructure but lacks depth in operations documentation. This plan prioritizes creating comprehensive guides for DevOps/Ops teams to manage, monitor, scale, and troubleshoot the production environment.

- **Current Status**: Deployment templates exist but lack depth; monitoring & troubleshooting sparse
- **Estimated Documents**: 12-15
- **Documentation Standard**: Diátaxis (Tutorials, How-To Guides, Explanations, Reference)

---

## 📊 Existing Documentation Status

| Document | Location | Status | Action |
|----------|----------|--------|--------|
| Initial Setup | `deploy/README.md` | Partial | Expand & link tutorial |
| Environment Setup | `.env.example` | Basic | Create reference doc |
| AI Guidelines | `docs/ai-guidelines.md` | Current | Link to ops sections |
| Architecture | `docs/architecture/ADR-0001...` | Exists | Create ops-focused summary |
| Postgres Setup | N/A | Missing | **Create tutorial** |
| Monitoring | N/A | Missing | **Create how-to & reference** |
| Security | N/A | Missing | **Create explanation** |
| Deployment Flow | N/A | Missing | **Create how-to** |
| Backup/DR | N/A | Missing | **Create how-to** |
| Troubleshooting | N/A | Missing | **Create reference** |
| GitHub Actions | `.github/workflows/` | Exists | Create reference |
| Nginx Config | N/A | Partial | Create reference |

---

## 🎓 TUTORIALS (Learning-Oriented)

Get ops teams productive quickly through hands-on guides:

### 1. Initial Server Setup & Configuration
- **Purpose**: First-time deployment setup on DigitalOcean VPS
- **Covers**: SSH keys, firewall, reverse proxy (Nginx), SSL certificates, environment variables
- **Status**: Partial in `deploy/README.md` — **needs expansion**
- **Estimated length**: 2,000-2,500 words
- **Priority**: ⚠️ **HIGH**
- **Prerequisites**: DigitalOcean account, basic Linux/Nginx knowledge
- **Deliverable**: Step-by-step guide with example configs

### 2. Postgres Setup & Drizzle Migration
- **Purpose**: Database initialization, schema management, backups
- **Covers**: Postgres installation, connection pooling, Drizzle CLI, disaster recovery
- **Status**: Missing
- **Estimated length**: 1,500-2,000 words
- **Priority**: ⚠️ **HIGH**
- **Prerequisites**: Linux command line, SQL basics
- **Deliverable**: Setup script + annotated SQL schema walkthrough

### 3. CI/CD Pipeline Configuration (GitHub Actions)
- **Purpose**: Understand automated testing, building, and deployment workflow
- **Covers**: Workflow triggers, environment secrets, artifact caching, rollback
- **Status**: Workflows exist but undocumented in `.github/workflows/`
- **Estimated length**: 1,500-1,800 words
- **Priority**: 🟡 **MEDIUM**
- **Prerequisites**: GitHub Actions basics, Docker familiarity
- **Deliverable**: Annotated workflow files + troubleshooting guide

### 4. Subdomain Routing & Wildcard SSL Setup
- **Purpose**: Configure and maintain subdomain isolation for interactive demos
- **Covers**: DNS wildcard configuration, Nginx routing, SSL certificate renewal
- **Status**: ADR-0001 exists — **needs ops runbook**
- **Estimated length**: 1,200-1,500 words
- **Priority**: 🟡 **MEDIUM**
- **Prerequisites**: DNS configuration knowledge, Nginx basics
- **Deliverable**: Configuration guide + renewal automation script

---

## 🛠️ HOW-TO GUIDES (Task-Oriented)

Step-by-step solutions for common operational tasks:

### 1. How to Deploy Updates (Staging & Production)
- **Purpose**: Safe, repeatable deployment process
- **Covers**: Blue-green deployment, rollback steps, zero-downtime updates
- **Status**: Missing structured runbook
- **Estimated length**: 1,000 words
- **Priority**: ⚠️ **HIGH**
- **Audience**: Release engineers, DevOps
- **Steps Outline**:
  - Pre-deployment validation
  - Staging deployment & testing
  - Production deployment strategies
  - Monitoring deployment
  - Rollback procedures
- **Deliverable**: Deployment runbook checklist

### 2. How to Monitor Uptime & Performance Metrics
- **Purpose**: Use monitoring dashboards; alert on anomalies
- **Covers**: Datadog/New Relic integration, key metrics (LCP, error rate, uptime), alerting rules
- **Status**: Missing (guidelines exist in `docs/ai-guidelines.md`)
- **Estimated length**: 1,200 words
- **Priority**: ⚠️ **HIGH**
- **Audience**: DevOps, SREs, on-call engineers
- **Metrics Covered**:
  - LCP <1500ms
  - Error rate <1%
  - Uptime ≥99.9%
- **Deliverable**: Dashboard setup guide + alert configuration templates

### 3. How to Scale Database Connections & Cache
- **Purpose**: Maintain performance during traffic spikes
- **Covers**: Connection pooling (PgBouncer), Redis caching strategy, load testing
- **Status**: Missing
- **Estimated length**: 1,000 words
- **Priority**: 🟡 **MEDIUM**
- **Audience**: DevOps, database admins
- **Deliverable**: Scaling checklist + performance tuning guide

### 4. How to Rotate Secrets & API Keys
- **Purpose**: Maintain security without downtime
- **Covers**: Resend API key rotation, GitHub secrets, environment variable updates
- **Status**: Missing security protocols
- **Estimated length**: 800-1,000 words
- **Priority**: 🔴 **CRITICAL** (security)
- **Audience**: DevOps, security team, release engineers
- **Secrets Covered**:
  - Resend API key
  - Postgres connection string
  - GitHub Actions secrets
  - SSL certificates
- **Deliverable**: Secret rotation runbook with automation scripts

### 5. How to Handle Demo Subdomain Failures
- **Purpose**: Troubleshoot demo-specific outages
- **Covers**: Nginx debugging, DNS propagation, certificate expiry, demo isolation
- **Status**: Missing troubleshooting guide
- **Estimated length**: 900 words
- **Priority**: 🟡 **MEDIUM**
- **Audience**: DevOps, on-call engineers
- **Common Issues Covered**:
  - 502 Bad Gateway
  - SSL certificate issues
  - DNS propagation delays
  - Demo service crashes
- **Deliverable**: Troubleshooting decision tree

### 6. How to Backup and Restore Database
- **Purpose**: Disaster recovery procedures
- **Covers**: Automated backup scheduling, restore testing, point-in-time recovery
- **Status**: Missing
- **Estimated length**: 1,000 words
- **Priority**: ⚠️ **HIGH**
- **Audience**: DevOps, database admins, incident responders
- **Steps Covered**:
  - Backup scheduling setup
  - Backup storage verification
  - Restore testing procedures
  - Point-in-time recovery
  - RPO/RTO monitoring
- **Deliverable**: Backup automation scripts + recovery procedures

---

## 📚 EXPLANATIONS (Understanding-Oriented)

Conceptual deep-dives for architecture and design decisions:

### 1. Architecture Overview: DigitalOcean VPS Setup
- **Purpose**: Understand the deployment topology
- **Covers**: VPS specs, Nginx reverse proxy flow, subdomain routing, SSL/TLS termination, demo isolation
- **Diagram**: Network topology (VPS → Nginx → Next.js app → Postgres)
- **Status**: Partial (reference `ADR-0001`)
- **Estimated length**: 1,500-2,000 words
- **Priority**: ⚠️ **HIGH**
- **Audience**: New ops team members, architects
- **Sections**:
  - VPS configuration & sizing
  - Nginx reverse proxy design
  - Demo isolation strategy
  - SSL/TLS termination
  - Database connection flow
- **Deliverable**: Architecture diagram + technical narrative

### 2. Performance & Reliability Strategy
- **Purpose**: Why we chose specific tools and KPIs
- **Covers**: LCP <1500ms targets, error budget (1%), uptime ≥99.9%, monitoring strategy
- **Status**: Guidelines exist; needs ops framing
- **Estimated length**: 1,200 words
- **Priority**: 🟡 **MEDIUM**
- **Audience**: DevOps, engineering managers, stakeholders
- **Topics Covered**:
  - Performance budget methodology
  - Error budget calculations
  - Uptime SLA rationale
  - Monitoring strategy
- **Deliverable**: Strategy document + SLA agreement template

### 3. Security & Compliance Framework
- **Purpose**: Understand security model (auth, secrets, data handling)
- **Covers**: TLS, environment variable isolation, OWASP, contact form privacy
- **Status**: Missing
- **Estimated length**: 1,500 words
- **Priority**: 🔴 **CRITICAL**
- **Audience**: Security team, DevOps, compliance officers
- **Topics Covered**:
  - Network security (firewall, TLS)
  - Secrets management
  - Data privacy & compliance
  - Vulnerability response
  - Audit logging
- **Deliverable**: Security policy document + compliance checklist

### 4. Scaling & Load Balancing Strategy
- **Purpose**: When and how to scale beyond single VPS
- **Covers**: Horizontal scaling options (multi-VPS, CDN, edge rendering), cost-benefit
- **Status**: Missing
- **Estimated length**: 1,000 words
- **Priority**: 🟡 **MEDIUM**
- **Audience**: DevOps, architects, product management
- **Scaling Paths Covered**:
  - Single VPS optimization limits
  - Multi-VPS horizontal scaling
  - CDN & edge rendering
  - Database scaling strategies
  - Cost vs. performance trade-offs
- **Deliverable**: Scaling roadmap + cost analysis

---

## 📖 REFERENCE (Information-Oriented)

Authoritative, lookup-style documentation:

### 1. Environment Variables Reference
- **Purpose**: Complete listing of all env vars
- **Covers**: Name, purpose, required/optional, default, example values
- **Status**: `.env.example` exists; **needs documented reference**
- **Format**: Structured table or schema
- **Priority**: ⚠️ **HIGH**
- **Deliverable**:
  - Comprehensive env vars table
  - Validation rules for each variable
  - Example `.env.local` for development
  - Example `.env.production` for production

### 2. Deployment Checklist & Configuration
- **Purpose**: Pre-deployment and production validation steps
- **Covers**: Database migrations, caches, DNS, SSL, health checks, smoke tests
- **Status**: Missing structured checklist
- **Estimated length**: 500 words
- **Priority**: ⚠️ **HIGH**
- **Deliverable**:
  - Pre-deployment checklist (markdown checklist)
  - Smoke test procedures
  - Health check endpoints
  - Rollback decision criteria

### 3. Nginx Configuration Reference
- **Purpose**: Reverse proxy setup details
- **Covers**: Virtual hosts, routing rules, caching headers, security headers
- **Status**: Config files exist; **needs annotated reference**
- **Estimated length**: 800 words
- **Priority**: 🟡 **MEDIUM**
- **Deliverable**:
  - Annotated nginx.conf examples
  - Virtual host templates
  - Security headers explanation
  - Performance optimization configs

### 4. Monitoring & Alerting Rules
- **Purpose**: KPI thresholds and alert configurations
- **Covers**: Alert names, thresholds, notification channels, escalation paths
- **Status**: Missing (guidelines reference KPIs)
- **Estimated length**: 600 words
- **Priority**: ⚠️ **HIGH**
- **Deliverable**:
  - Alert rule definitions (table format)
  - Threshold justifications
  - Escalation paths
  - On-call rotation guide

### 5. Troubleshooting Runbook
- **Purpose**: Common issues and solutions
- **Covers**: High 502 errors, LCP degradation, demo timeout, certificate expiry, connectivity
- **Status**: Missing
- **Estimated length**: 1,200 words
- **Priority**: ⚠️ **HIGH**
- **Deliverable**:
  - Decision tree for common issues
  - Log locations & interpretation guide
  - Debug commands reference
  - Escalation procedures

### 6. GitHub Actions Workflow Reference
- **Purpose**: CI/CD pipeline documentation
- **Covers**: Workflow files, triggers, secrets required, failure modes
- **Status**: Workflows exist; **needs reference docs**
- **Estimated length**: 800 words
- **Priority**: 🟡 **MEDIUM**
- **Deliverable**:
  - Workflow file explanations
  - Required secrets checklist
  - Common failure modes & fixes
  - Extending the pipeline guide

---

## 🎯 Recommended Documentation Order

### Phase 1: Critical Path (Days 1-2)
1. **Environment Variables Reference** (enables all other docs)
2. **Initial Server Setup & Configuration (tutorial)**
3. **Deployment Checklist & Configuration (reference)**
4. **Troubleshooting Runbook (reference)**

### Phase 2: Operational Excellence (Days 3-4)
5. **How to Deploy Updates (staging & production)**
6. **How to Backup and Restore Database**
7. **Monitoring & Alerting Rules (reference)**
8. **Security & Compliance Framework (explanation)**

### Phase 3: Scaling & Resilience (Days 5+)
9. **How to Monitor Uptime & Performance Metrics**
10. **Architecture Overview: DigitalOcean VPS (explanation)**
11. **How to Scale Database Connections & Cache**
12. **Scaling & Load Balancing Strategy (explanation)**
13. **Postgres Setup & Drizzle Migration (tutorial)**
14. **CI/CD Pipeline Configuration (tutorial)**

### Phase 4: Maintenance & Advanced (Later)
15. **Subdomain Routing & Wildcard SSL Setup (tutorial)**
16. **How to Rotate Secrets & API Keys (how-to)**
17. **How to Handle Demo Subdomain Failures (how-to)**
18. **GitHub Actions Workflow Reference (reference)**

---

## 📈 Success Metrics for Documentation

- ✅ New ops team member can deploy to production without escalation (by tutorial completion)
- ✅ Incident response time <15 minutes (with troubleshooting runbook)
- ✅ Zero unplanned downtime due to misconfiguration (with deployment checklist)
- ✅ All environment variables documented and validated (reference + CI checks)
- ✅ Monitoring alerts consistently catching issues within SLA thresholds
- ✅ 100% of team certifies via documented procedures (training via docs)

---

## 📝 Implementation Notes

### Directory Structure
```
docs/
├── OPERATIONS_DOCUMENTATION_PLAN.md (this file)
├── operations/
│   ├── TUTORIALS.md (links to all tutorials)
│   ├── setup/
│   │   ├── initial-server-setup.md
│   │   ├── postgres-setup-drizzle.md
│   │   └── github-actions-setup.md
│   ├── how-to/
│   │   ├── deploy-updates.md
│   │   ├── backup-restore.md
│   │   ├── monitor-metrics.md
│   │   ├── rotate-secrets.md
│   │   ├── handle-subdomain-failures.md
│   │   └── scale-database.md
│   ├── explanations/
│   │   ├── architecture-overview.md
│   │   ├── performance-reliability.md
│   │   ├── security-framework.md
│   │   └── scaling-strategy.md
│   └── reference/
│       ├── environment-variables.md
│       ├── deployment-checklist.md
│       ├── nginx-reference.md
│       ├── monitoring-alerts.md
│       ├── troubleshooting.md
│       └── github-actions-reference.md
```

### Ownership & Review
- **Primary Owner**: DevOps/Infrastructure team
- **Review Partners**: Security team (security docs), Release engineers (deployment), Database admins (Postgres)
- **Approval Gate**: Each doc reviewed before merging to main

### Maintenance
- **Quarterly Review**: Ensure docs match current infrastructure
- **Incident-Driven Updates**: After incidents, update relevant runbooks
- **Release Coordination**: Update docs when major infrastructure changes occur

---

## ❓ Questions for Refinement

1. **Monitoring stack**: Are you using Datadog, New Relic, or another tool? (affects monitoring docs)
2. **Backup strategy**: Do you have automated backups, and which service (AWS S3, DigitalOcean Spaces)?
3. **Incident response**: Is there an established on-call rotation or escalation path I should document?
4. **Security team**: Should security & compliance docs reference specific compliance frameworks (SOC2, GDPR)?
5. **Load testing**: Do you have load testing tools/processes to document?
6. **Database version**: What Postgres version is currently in use?
7. **Monitoring frequency**: What's the desired alert response time? (affects alert sensitivity)

---

## Next Steps

- [ ] Review and refine this plan with team
- [ ] Answer refinement questions above
- [ ] Prioritize which Phase 1 docs to create first
- [ ] Assign ownership to team members
- [ ] Establish review/approval process
- [ ] Begin Phase 1 documentation (recommended: start with Environment Variables Reference)

---

**Last Updated**: 2026-02-17  
**Plan Status**: Ready for team review
