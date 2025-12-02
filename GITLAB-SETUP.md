# GitLab Runner / Registry quick setup

1. Configure a GitLab Runner (shell or docker) — follow GitLab docs: https://docs.gitlab.com/runner/
2. In GitLab project settings > CI/CD > Variables, add:
   - `CI_REGISTRY_USER` and `CI_REGISTRY_PASSWORD` (or use GitLab built-in registry token)
3. To publish Docker images, either use GitLab Container Registry or an external registry. Update `.gitlab-ci.yml` accordingly.