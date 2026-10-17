# Permissions matrix
- CLIENT: create project requests scoped to their assigned organization; list only their organization's projects and tasks.
- TALENT: list tasks assigned to their user, submit work only for assigned tasks, upload to own submissions or other authorized workspace submissions as enforced by upload route.
- MANAGER: create/list projects and tasks, review submitted work, request revisions or approve.
- ADMIN: manager capabilities and administrative access to routes that explicitly allow ADMIN.

All API access requires a database-backed session. Unauthorized requests receive 401; disallowed roles receive 403. IDs are checked against server-loaded records before submission/review/upload. The current MVP does not yet include full organization/user administration or private-file download, so it is not a complete production authorization surface for all listed business modules.
