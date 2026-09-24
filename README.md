# Boshta Platform Backend

## Overview

This repository contains the REST API for the Boshta learning platform. The API is built with Node.js, Express, PostgreSQL, Joi validation, Multer file uploads, and OpenAPI 3.0 documentation.

The authoritative endpoint reference is the generated Swagger UI. It is built from the mounted Express routers and the hand-written endpoint descriptions. The project also keeps a route catalog so documentation coverage can be checked against the running application.

## Local setup

Use Node.js 22 or a compatible current LTS release. Install the locked dependencies and create an environment file from the supplied template:

```bash
npm ci
cp .env.example .env
npm run dev
```

The default server port is `3000`. The primary local documentation URLs are:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs-json`
- Health check: `http://localhost:3000/health`

The deployed server URL is configured in `src/docs/swagger.js`. Update it when the deployment domain changes.

## API areas

The application mounts the following route groups:

| Prefix | Purpose | Typical access |
|---|---|---|
| `/api/auth` | User, student, and parent authentication | Public or login-specific |
| `/api/student` | Student dashboard, exams, assignments, attendance, payments, and media | API basic auth plus client token |
| `/api/parent` | Parent access and parent-facing data | Parent access token or route-specific authentication |
| `/api/assistant` | Assistant operations for academic and platform management | API basic auth, client token, and assistant authorization |
| `/api/teacher` | Teacher operations for classes, students, exams, assignments, and media | API basic auth, client token, and teacher authorization |
| `/api/super-admin` | Platform administration and destructive management operations | API basic auth plus client or super-admin authorization |
| `/webhook/webhook` | WhatsApp verification and status callbacks | Public webhook endpoint protected by the configured verification token where applicable |

The exact methods, parameters, request bodies, upload fields, responses, and security requirements are available in Swagger UI. The route catalog is generated from the mounted Express routers rather than copied manually.

## Authentication

The OpenAPI document defines these security schemes:

- `ApiAuth` is HTTP Basic Authentication and is used by the API authentication middleware.
- `ClientToken` is the `x-client-key` header used by client-authenticated routes.
- `SuperAdminKey` is the `x-super-admin-key` header used by super-admin authorization.

Swagger UI can be authorized from its **Authorize** control. Do not commit real credentials or tokens. Keep secrets in `.env`, which is intentionally excluded from release archives.

## File uploads

Uploads are stored below the absolute `UPLOAD_ROOT` directory. If `UPLOAD_ROOT` is not set, the application uses the project `uploads` directory. Upload middleware normalizes stored paths, generates collision-resistant filenames, validates MIME type and extension, enforces multipart limits, and removes partially stored files when validation or persistence fails.

The documented multipart field names are defined by the route implementation. Common fields include `file`, `image`, and `thumbnail`; the Swagger request body for each endpoint is the authoritative reference. Clients must send `multipart/form-data` and must not send a local filesystem path as a substitute for a file.

## Documentation maintenance

Hand-written descriptions are stored in `src/docs/*.docs.js`. Routes that are present in the application but do not yet have a hand-written Swagger block are covered by `src/docs/generated-routes.docs.js`. The generated file is reproducible and should not be edited manually.

To rebuild the generated route documentation after changing routes:

```bash
node scripts/generate-route-docs.js
```

To verify that every mounted method-and-path pair is documented and that no stale Swagger operation remains:

```bash
node scripts/check-docs-operations.js
```

The check must report zero missing operations and zero stale operations. It compares the runtime-mounted routers with the final Swagger specification and normalizes Express `:parameter` syntax to OpenAPI `{parameter}` syntax.

The route inventory is stored in `src/docs/route-catalog.json`. The Swagger loader filters operations not present in that catalog, preventing old endpoints from remaining visible after a route is removed or renamed.

## Testing and quality checks

Before preparing a release, run the following checks:

```bash
find src scripts -name '*.js' -print0 | xargs -0 -n1 node --check
node scripts/check-docs-operations.js
node scripts/verify-upload-fixes.js
npm audit --omit=dev
```

The upload verification script checks absolute storage resolution, Multer wrapper availability, path-traversal rejection, and cleanup of a temporary uploaded file. `npm audit` may report dependency advisories that require a separate upgrade decision; do not apply a breaking dependency upgrade without running the application and API checks afterward.

## Security and deployment notes

Use a strong, unique `JWT_SECRET`, API credential values, and super-admin key in production. Set `NODE_ENV=production`, provide the production database configuration, and set an explicit `UPLOAD_ROOT` on persistent storage. Place the API behind HTTPS and configure the reverse proxy to preserve request bodies for multipart uploads. Restrict access to uploaded files through the application’s intended static routes and do not expose the entire project directory.

## References

[1]: https://spec.openapis.org/oas/v3.0.3 "OpenAPI Specification 3.0.3"

[2]: https://expressjs.com/en/guide/routing.html "Express Routing Guide"

[3]: https://github.com/expressjs/multer "Multer multipart/form-data middleware"
