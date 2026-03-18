# Docker Quick Reference — Eventy Life

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Nginx (reverse proxy) — TLS, rate limiting, caching     │
├─────────────────────┬───────────────────────────────────┤
│ Frontend            │ Backend                           │
│ Next.js 18-alpine   │ NestJS 18-alpine                  │
│ Port: 3000          │ Port: 4000                        │
│ Size: ~150MB        │ Size: ~200MB                      │
│ Standalone mode     │ Multi-stage build                 │
├─────────────────────┴───────────────────────────────────┤
│ PostgreSQL 15 + Redis 7 (Docker network — not exposed) │
└─────────────────────────────────────────────────────────┘
```

## Quick Commands

### Development
```bash
# Start all services (dev mode)
docker compose up -d

# View logs
docker logs -f eventisite-app
docker logs -f eventisite-frontend

# Test health endpoints
curl http://localhost:4000/api/health
curl http://localhost:3000/

# Exec into container
docker exec -it eventisite-app sh
```

### Production (Scaleway)
```bash
# Build images locally
docker build -t eventy-backend:v1.0 ./backend
docker build -t eventy-frontend:v1.0 ./frontend

# Start production compose
docker compose -f docker-compose.prod.yml up -d

# Check resource usage
docker stats

# View Nginx logs
docker logs eventy-nginx

# Rollback (if needed)
docker compose down
git checkout HEAD -- docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

### Backend (.env.production)
```env
DATABASE_URL=postgresql://user:pass@hostname:5432/db
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
NODE_ENV=production
LOG_LEVEL=warn
```

### Frontend (docker-compose.prod.yml args)
```yaml
NEXT_PUBLIC_API_URL=https://api.eventy.life
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## Health Checks

| Service | Endpoint | Expected |
|---------|----------|----------|
| Backend | GET /api/health | 200 OK |
| Frontend | GET / | 200 OK (HTML) |
| PostgreSQL | pg_isready | exit 0 |
| Redis | redis-cli ping | PONG |

## Security Defaults

| Layer | Feature | Setting |
|-------|---------|---------|
| **OS** | User | UID 1001 (non-root) |
| **Network** | DB Access | Internal only (no exposed ports) |
| **TLS** | Minimum Version | TLSv1.2 |
| **TLS** | Ciphers | ECDHE-* only (modern) |
| **Headers** | HSTS | 2 years + preload |
| **Rate Limit** | API | 60 req/min, burst 20 |
| **Audit** | npm audit | Enforced (fail-fast) |
| **Scanning** | Trivy | Before registry push |

## Image Sizes

| Image | Size | Technique |
|-------|------|-----------|
| **eventy-backend** | ~200MB | Alpine + multi-stage |
| **eventy-frontend** | ~150MB | Next.js standalone |
| **postgres:15-alpine** | ~60MB | Official alpine |
| **redis:7-alpine** | ~25MB | Official alpine |
| **nginx:1.25-alpine** | ~40MB | Official alpine |

## Graceful Shutdown Flow

```
1. Docker receives SIGTERM
   ↓
2. dumb-init forwards to PID 1
   ↓
3. Node.js closes connections (30s default timeout)
   ↓
4. Application cleanup code runs
   ↓
5. Process exits cleanly
   ↓
6. Container stops
```

## Monitoring Checklist

### Daily
- [ ] Check `/api/health` responding
- [ ] Check Nginx access logs for 5xx errors
- [ ] Verify PostgreSQL connections count

### Weekly
- [ ] Run `docker system prune -a` (cleanup old images)
- [ ] Review security advisories (npm audit output)
- [ ] Check Trivy scan results on GitHub

### Monthly
- [ ] Update base images (node, postgres, redis, nginx)
- [ ] Rotate secrets if exposed
- [ ] Test rollback procedure

## Troubleshooting

### "dist/main.js not found"
```bash
# Backend build failed
docker compose logs eventisite-app | tail -20
# Check: npm run build ran successfully
# Check: tsconfig.json correct
```

### "Connection refused" to database
```bash
# PostgreSQL not healthy
docker logs eventisite-postgres
# Check: POSTGRES_PASSWORD env var set
# Check: Database initialized (first run takes ~10s)
```

### High memory usage
```bash
# Check process memory
docker stats eventisite-app

# Frontend heap too large?
# Increase --max-old-space-size in frontend/Dockerfile

# Backend heap too large?
# Add flag to backend/docker-entrypoint.sh:
# exec node --max-old-space-size=512 dist/main
```

### Nginx 502 Bad Gateway
```bash
# Frontend or backend not responding
curl http://localhost:3000/  # Frontend check
curl http://localhost:4000/api/health  # Backend check

# Check container status
docker ps | grep eventy
# Restart if needed: docker restart eventisite-app
```

## CI/CD Pipeline

```
Push to GitHub
  ↓
┌─ Run CI Tests
│  ├─ npm ci (backend + frontend)
│  ├─ npm run build
│  └─ npm run test
│
├─ Run Security Checks
│  ├─ npm audit
│  └─ Dependency check
│
└─ [if main branch]
   ├─ Build Docker images
   ├─ Trivy scan (block on CRITICAL)
   ├─ Push to ghcr.io
   └─ Deploy to production
      └─ SSH into server + docker compose up
```

## Rollback Procedure

```bash
# If production deployment fails:

1. SSH into production server
2. docker compose logs  # Check what failed
3. docker compose down  # Stop services
4. git checkout HEAD -- docker-compose.prod.yml  # Revert config
5. docker compose up -d  # Restart with previous images
6. curl http://localhost:4000/api/health  # Verify
```

## File Structure

```
eventisite/
├── Dockerfile                    # Main build config
├── docker-compose.yml            # Dev/test compose
├── docker-compose.prod.yml       # Production compose
├── docker-entrypoint.sh          # Backend startup script
│
├── backend/
│   ├── Dockerfile                # NestJS image
│   ├── .dockerignore             # Build exclusions
│   ├── docker-entrypoint.sh      # Entrypoint
│   ├── prisma/                   # Database schema
│   └── src/                      # Source code
│
├── frontend/
│   ├── Dockerfile                # Next.js image
│   ├── .dockerignore             # Build exclusions
│   ├── next.config.js            # Standalone mode
│   └── src/                      # Source code
│
├── nginx/
│   └── nginx.prod.conf           # Reverse proxy config
│
└── .github/workflows/
    ├── ci.yml                    # Test pipeline
    ├── deploy.yml                # Production deploy
    ├── security.yml              # Security scanning
    └── e2e.yml                   # E2E tests
```

## References

- [Docker Docs](https://docs.docker.com)
- [Next.js Standalone](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [NestJS Docker](https://docs.nestjs.com/deployment#docker)
- [Nginx Best Practices](https://nginx.org/en/docs/)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)
- [Node.js Memory Management](https://nodejs.org/en/docs/guides/nodejs-performance/)

---

**Last Updated**: 2026-03-15
**Maintained By**: Eventy DevOps
