# AWS Infrastructure Setup for CEJST2

This document provides step-by-step instructions for setting up AWS infrastructure required for CEJST2 deployments, including S3 buckets, CloudFront distributions, and IAM configurations.

## Prerequisites

- AWS account with appropriate permissions
- Access to AWS Console
- Basic understanding of AWS services (S3, CloudFront, IAM)
- AWS CLI installed (see installation instructions below)

## AWS CLI Installation

### macOS (using Homebrew)

```bash
brew install awscli
```

### Other platforms

- **Windows**: Download from [AWS CLI installer](https://aws.amazon.com/cli/)
- **Linux**: Follow [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### Verify installation

```bash
aws --version
```

## S3 Bucket Setup

### Creating the Staging Bucket

To set up an S3 bucket for staging deployments, follow these steps:

1. **Navigate to AWS S3 Console**

   - Go to the AWS S3 service in your AWS console

2. **Create New Bucket**

   - Click "Create bucket"

3. **Configure General Settings**

   - **Bucket type**: General Purpose
   - **Bucket name**: `pedp-cejst2-staging`

4. **Object Ownership**

   - **ACL disabled**: Leave this setting as is

5. **Block Public Access Settings**

   - **Uncheck "Block all public access"** (this is required for static website hosting)

6. **Bucket Versioning**

   - **Disabled**: Leave versioning disabled

7. **Tags**

   - **Default**: Use default tag settings

8. **Default Encryption**

   - **Leave to defaults**: Use the default encryption settings

9. **Create Bucket**
   - Click "Create bucket" to complete the setup

### Configuring the Bucket for Static Website Hosting

After creating the bucket, you need to configure it for static website hosting:

1. **Navigate to the bucket** you just created (`pedp-cejst2-staging`)

2. **Enable Static Website Hosting**

   - Go to the **Properties** tab
   - Scroll down to **Static website hosting**
   - Click **Edit**
   - Select **Enable**
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for Gatsby SPA routing)
   - Click **Save changes**

3. **Configure Bucket Policy for Public Read Access**

   - Go to the **Permissions** tab
   - Scroll down to **Bucket policy**
   - Click **Edit**
   - Add the following policy (replace `pedp-cejst2-staging` with your actual bucket name):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::pedp-cejst2-staging/*"
       }
     ]
   }
   ```

4. **Verify Public Access Settings**
   - In the **Permissions** tab, under **Block public access (bucket settings)**
   - Ensure **Block all public access** is **unchecked**
   - If it's checked, click **Edit** and uncheck it

## CloudFront Distribution Setup

### Creating a CloudFront Distribution

1. **Navigate to CloudFront Console**

   - Go to the AWS CloudFront service in your AWS console

2. **Create Distribution**

   - Click **Create distribution**

3. **Get Started**

   **Distribution options**:

   - **Name**: `cejst2-staging-distribution`
   - **Description**: `CloudFront distribution for CEJST2 preview deployments and staging environment`
   - **Distribution type**: **Single website or app**

   **Custom domain**:

   - **Custom domain**: Leave as **none** (unless you have a specific domain to use)

4. **Specify Origin**

   **Origin type**:

   - **Amazon S3**

   **Origin**:

   - **S3 origin**: URL (use the S3 website endpoint, e.g., `<bucket-name>.s3-website.<region>.amazonaws.com`)
   - **Important**: Use the S3 website endpoint, not the REST endpoint
   - **Origin path**: Leave empty (critical - do not set to any path)

   **Settings**:

   - **Origin settings**: Use recommended origin settings
   - **Cache settings**: Customize cache settings
     - **Viewer protocol policy**: Redirect HTTP to HTTPS
     - **Allowed HTTP methods**: GET, HEAD
     - **Cache policy**: (leave as default or choose appropriate policy)
     - **Origin request policy**: (leave as default or choose appropriate policy)
     - **Response headers policy**: CORS-With-Preflight (essential for map tiles)

5. **Configure Distribution Settings**

   - **Default root object**: `index.html`
   - **Price class**: Choose based on your needs
   - **Alternate domain names**: Leave empty unless you have a custom domain

6. **WAF**

   **WAF**:

   - **Do not enable security protections** (correct for this setup)

7. **Review and Create**

   - Click **Create distribution**
   - **Wait 10-15 minutes** for deployment to complete
   - Note the **Distribution ID** for later use

## IAM User and Policies Setup

### Creating IAM User for GitHub Actions

1. **Navigate to IAM Console**

   - Go to the AWS IAM service in your AWS console

2. **Step 1 - Specify User Details**

   - Click **Create user**
   - **User name**: `pedp-cejst2-github-actions-programmatic`
   - **Provide user access to the AWS Management Console**: **NO**
   - Click **Next**

3. **Step 2 - Set Permissions**

   - **Permission options**: Attach policies directly
   - **Permission policies**: Click **Create policy** (this will open a new tab)

4. **Create Custom Policy - Step 1 - Specify Permissions**

   - **Policy editor**: Select **JSON**
   - Add the combined policy (S3 + CloudFront):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::pedp-cejst2-staging",
           "arn:aws:s3:::pedp-cejst2-staging/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation",
           "cloudfront:GetInvalidation"
         ],
         "Resource": "arn:aws:cloudfront::*:distribution/YOUR_DISTRIBUTION_ID"
       }
     ]
   }
   ```

   - Click **Next**

5. **Create Custom Policy - Step 2 - Review and Create**

   **Policy details**:

   - **Policy name**: `pedp-cejst2-s3-cloudfront-policy`
   - **Description**: `Policy for GitHub Actions to deploy to S3 and invalidate CloudFront cache for CEJST2 preview deployments`

   **Permission defined in this policy**:

   - **CloudFront**: Access Level = None
   - **S3**: Access Level = Limited, List, Read, Write

   - Click **Create policy**

6. **Back to Step 2 - Set Permissions (Previous Tab)**

   - Return to the user creation tab
   - **Permission policies**:
     - Click the **refresh icon**
     - Search for the recently created policy (`pedp-cejst2-s3-cloudfront-policy`)
     - **Check off the policy**
     - Click **Next**

7. **Step 3 - Review / Create**

   - Click **Create user**

8. **Generate Access Keys**

   - Click on the newly created user **pedp-cejst2-github-actions-programmatic**
   - Go to the user's **Security credentials** tab
   - Click **Create access key**
   - Choose **Application running outside AWS**
   - Save the **Access Key ID** and **Secret Access Key** securely

## GitHub Repository Configuration

### Adding GitHub Secrets

**Note**: You must have **admin rights** to the repository to access Settings and manage secrets.

Navigate to your repository's **Settings** → **Secrets and variables** → **Actions**, and add the following **repository secrets** (not environment secrets):

- `STAGING_AWS_ACCESS_KEY_ID`: IAM access key ID
- `STAGING_AWS_SECRET_ACCESS_KEY`: IAM secret access key
- `STAGING_S3_BUCKET`: `pedp-cejst2-staging`
- `STAGING_CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

### Adding GitHub Variables (Optional)

- `STAGING_AWS_REGION`: `us-east-1` (or your preferred region)

## Testing Your Setup

### Manual Testing

1. **Configure AWS CLI**:

   ```bash
   aws configure
   # Enter your access key ID and secret access key from the IAM user
   # Set default region to match your S3 bucket region (e.g., us-east-1)
   # Set default output format to json
   ```

2. **Build the Gatsby site locally**:

   ```bash
   cd client
   npm run build
   ```

3. **Upload to S3**:

   ```bash
   aws s3 sync ./client/public s3://pedp-cejst2-staging/j40-cejst-2/ --region us-east-1 --delete
   ```

4. **Verify upload**:

   ```bash
   aws s3 ls s3://pedp-cejst2-staging/j40-cejst-2/ --recursive
   ```

5. **Test via CloudFront URL**:
   - Use your CloudFront distribution URL: `https://your-cloudfront-domain/j40-cejst-2/`
   - Expected: Site loads in ~4 seconds, map tiles work, no CORS errors

### Verification Checklist

- [ ] S3 bucket created with correct name
- [ ] Static website hosting enabled
- [ ] Bucket policy allows public read access
- [ ] Block public access is disabled
- [ ] CloudFront distribution created
- [ ] CloudFront origin uses S3 website endpoint
- [ ] CloudFront origin path is empty
- [ ] IAM user created with correct policies
- [ ] GitHub secrets added
- [ ] Manual test deployment successful

## Troubleshooting

### Common Issues

1. **403 Forbidden errors**

   - **Cause**: Block public access is enabled or bucket policy is incorrect
   - **Solution**: Disable block public access and verify bucket policy

2. **404 Not Found with doubled paths**

   - **Cause**: CloudFront origin path is set incorrectly
   - **Solution**: Ensure CloudFront origin path is empty

3. **CORS errors with map tiles**

   - **Cause**: Missing CORS headers
   - **Solution**: Use CloudFront with CORS-With-Preflight response headers policy

4. **Slow loading times**
   - **Cause**: Using S3 directly instead of CloudFront
   - **Solution**: Always use CloudFront for production deployments

## Additional Resources and Best Practices

### Multi-Account Strategy

For organizations planning to scale their AWS infrastructure, consider implementing a multi-account strategy as outlined in [You should have lots of AWS accounts](https://src-bin.com/substrate/blog/you-should-have-lots-of-aws-accounts/). This approach provides enhanced security through isolation boundaries, improved reliability, better compliance, simplified IAM management, and automatic cost categorization.

### Cloud Security Best Practices

The [Datadog State of Cloud Security 2025](https://www.datadoghq.com/state-of-cloud-security/) report highlights critical security considerations, including that 84% of organizations use multiple AWS accounts, 40% implement data perimeters, and 15% of S3 buckets remain publicly accessible. Key recommendations include eliminating long-lived credentials, implementing data perimeters, and following the principle of least privilege.

### Security Considerations for This Setup

The current single-account setup is appropriate for initial development and staging. Consider implementing IAM role assumption, resource tagging, VPC endpoints, and monitoring as you scale.

## Related Documentation

- [Main README](../../README.md) - Project overview and quick start
- [Installation Guide](../../INSTALLATION.md) - Complete setup instructions
