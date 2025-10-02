# Preview Deployment Links for Pull Requests

- Status: proposed
- Deciders: Development Team
- Date: 2025-01-27
- Tags: deployment, preview, pull-requests, github-actions

Technical Story: Need to provide preview deployment links for pull requests to enable stakeholders to review changes before merging to main branch.

## Context and Problem Statement

The Justice40 CEJST Tool is an open-source project that receives contributions from both internal team members and external contributors via fork pull requests. Currently, there is no way to preview changes before they are merged to the main branch, making it difficult for reviewers to test functionality and for stakeholders to provide feedback on UI/UX changes. We need a solution that provides live preview deployments for pull requests while considering the constraints of an open-source project with fork contributions.

## Decision Drivers

- **Cost**: Must be free or very low cost for an open-source project
- **Fork PR support**: Must work with external contributors who create PRs from forks
- **Storage limits**: Current Gatsby build is ~34MB, need to support multiple concurrent deployments
- **Automatic cleanup**: Should automatically remove preview deployments when PRs are closed
- **Ease of maintenance**: Should integrate well with existing GitHub Actions workflow
- **Performance**: Preview deployments should load quickly for reviewers
- **Security**: Should not expose sensitive data or require excessive permissions

## Considered Options

- GitHub Actions with `actions/deploy-pages@v4`
- GitHub Actions with `peaceiris/actions-gh-pages@v3`
- Netlify integration
- PullPreview with AWS Lightsail
- Custom AWS S3 solution

## Decision Outcome

Chosen option: "Custom AWS S3 solution", because it provides the best balance of cost-effectiveness, fork PR support, unlimited storage, and automatic cleanup capabilities while maintaining full control over the deployment process.

### Positive Consequences

- Unlimited storage capacity for preview deployments
- Automatic cleanup when PRs are closed
- Works with fork PRs from external contributors
- Very low cost (~$0.01/month per active PR)
- Full control over deployment process and URLs
- Better performance with S3 + CloudFront
- No GitHub Pages 1GB storage limitation

### Negative Consequences

- Requires AWS setup and credentials management
- Additional complexity compared to GitHub Pages
- Small ongoing cost (though minimal)
- Different URL structure from main GitHub Pages site
- Need to maintain AWS infrastructure

## Pros and Cons of the Options

### GitHub Actions with `actions/deploy-pages@v4`

Current approach using official GitHub Pages deployment action.

- Good, because it's the official GitHub action with full support
- Good, because it integrates seamlessly with GitHub Pages
- Good, because it's free to use
- Bad, because it has limited flexibility for subdirectory deployments
- Bad, because it cannot deploy from fork PRs due to security restrictions
- Bad, because it's constrained by GitHub Pages 1GB storage limit
- Bad, because cleanup of old deployments is complex

### GitHub Actions with `peaceiris/actions-gh-pages@v3`

Third-party action that provides more deployment flexibility.

- Good, because it supports subdirectory deployments easily
- Good, because it's well-maintained and widely used
- Good, because it provides more deployment options
- Bad, because it still cannot deploy from fork PRs
- Bad, because it's still constrained by GitHub Pages storage limits
- Bad, because cleanup requires additional implementation
- Bad, because it creates a `gh-pages` branch (less clean than direct deployment)

### Netlify Integration

Third-party service that specializes in preview deployments.

- Good, because it has excellent preview deployment features
- Good, because it works with fork PRs automatically
- Good, because it provides automatic cleanup
- Good, because it has a generous free tier
- Bad, because it's a third-party dependency
- Bad, because it requires OAuth setup and permissions
- Bad, because it changes the deployment workflow significantly
- Bad, because it may have different performance characteristics

### PullPreview with AWS Lightsail

Docker-based preview deployments on AWS infrastructure.

- Good, because it works with fork PRs
- Good, because it provides full server environments
- Good, because it has automatic cleanup
- Bad, because it's overkill for a static Gatsby site
- Bad, because it costs ~$10/month per active PR
- Bad, because it requires Docker setup and AWS credentials
- Bad, because it adds significant complexity for a static site

### Custom AWS S3 Solution

Self-managed S3 bucket with static website hosting for preview deployments.

- Good, because it provides unlimited storage capacity
- Good, because it works with fork PRs
- Good, because it enables automatic cleanup
- Good, because it's very cost-effective (~$0.01/month per PR)
- Good, because it provides full control over the deployment process
- Good, because it can be enhanced with CloudFront for better performance
- Good, because it supports custom domains if needed and address issue [#9](https://github.com/Public-Environmental-Data-Partners/j40-cejst-2/issues/9)
- Bad, because it requires AWS setup and credentials
- Bad, because it adds some complexity to the deployment process
- Bad, because it's a small ongoing cost (though minimal)

## Links

- [GitHub Pages Limits Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [PullPreview Action](https://github.com/pullpreview/action)
- [Peaceiris GitHub Pages Action](https://github.com/peaceiris/actions-gh-pages)
