# DataSync copy: source account admin

Copy two S3 buckets from the source account into new buckets in the destination account. This is a copy. Do not delete or modify the source buckets.

Replace the placeholders below with the account IDs, bucket names, and role ARN for this copy.

| | |
|---|---|
| Source account | `<SOURCE_ACCOUNT_ID>` |
| Destination account | `<DESTINATION_ACCOUNT_ID>` |
| Region | `us-east-1` |
| Source buckets | `<SOURCE_BUCKET>`, `<SOURCE_PRESERVED_BUCKET>` |
| Destination buckets | `<DESTINATION_BUCKET>`, `<DESTINATION_PRESERVED_BUCKET>` |
| Role name | `datasync-to-destination` |

The destination buckets already exist. Their encryption is SSE-S3, so no KMS key change is required.

Do part 1 now and send the role ARN back. Parts 2 and 3 run in this same account after the destination bucket policies are in place.

## Part 1. Create the DataSync role

1. Sign in to account `<SOURCE_ACCOUNT_ID>`.
2. Open IAM, then **Roles**, then **Create role**.
3. Trusted entity type: **AWS service**.
4. Use case: **DataSync**. Choose the option described as “Allows DataSync to call AWS services on your behalf.” Do not choose **DataSync - S3 Location** or **DataSync Service Role**.
5. Choose **Next**. Skip adding a managed policy.
6. Role name: `datasync-to-destination`. Create the role.
7. Open the role. Choose **Add permissions**, then **Create inline policy**.
8. Open the **JSON** tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketLocation",
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": [
        "arn:aws:s3:::<DESTINATION_BUCKET>",
        "arn:aws:s3:::<DESTINATION_PRESERVED_BUCKET>"
      ],
      "Condition": {
        "StringEquals": {
          "aws:ResourceAccount": "<DESTINATION_ACCOUNT_ID>"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:AbortMultipartUpload",
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:GetObjectTagging",
        "s3:GetObjectVersion",
        "s3:GetObjectVersionTagging",
        "s3:ListMultipartUploadParts",
        "s3:PutObject",
        "s3:PutObjectTagging"
      ],
      "Resource": [
        "arn:aws:s3:::<DESTINATION_BUCKET>/*",
        "arn:aws:s3:::<DESTINATION_PRESERVED_BUCKET>/*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:ResourceAccount": "<DESTINATION_ACCOUNT_ID>"
        }
      }
    }
  ]
}
```

9. Name the policy `datasync-to-destination-policy` and create it.
10. On the role summary page, copy the role ARN. It should be:

`arn:aws:iam::<SOURCE_ACCOUNT_ID>:role/datasync-to-destination`

Send that ARN back. Stop here until the destination account owner confirms the bucket policies on `<DESTINATION_BUCKET>` and `<DESTINATION_PRESERVED_BUCKET>` allow this role.

## Part 2. Create the DataSync locations

Stay in account `<SOURCE_ACCOUNT_ID>`, Region **us-east-1**.

### Source locations

1. Open the DataSync console.
2. Choose **Locations**, then **Create location**.
3. Location type: **Amazon S3**.
4. Bucket: `<SOURCE_BUCKET>`.
5. IAM role: **Autogenerate**.
6. Create the location.
7. Repeat for `<SOURCE_PRESERVED_BUCKET>`.

### Destination locations

The console cannot create a location for a bucket in another account. Use CloudShell in this account, in `us-east-1`.

```bash
aws datasync create-location-s3 \
  --s3-bucket-arn arn:aws:s3:::<DESTINATION_BUCKET> \
  --region us-east-1 \
  --s3-config '{"BucketAccessRoleArn":"arn:aws:iam::<SOURCE_ACCOUNT_ID>:role/datasync-to-destination"}'
```

```bash
aws datasync create-location-s3 \
  --s3-bucket-arn arn:aws:s3:::<DESTINATION_PRESERVED_BUCKET> \
  --region us-east-1 \
  --s3-config '{"BucketAccessRoleArn":"arn:aws:iam::<SOURCE_ACCOUNT_ID>:role/datasync-to-destination"}'
```

Each command returns a location ARN. Those locations appear under **DataSync**, then **Locations**.

## Part 3. Start one task per bucket

1. In DataSync, choose **Tasks**, then **Create task**. Confirm the console Region is **us-east-1**.
2. Source: the `<SOURCE_BUCKET>` location.
3. Destination: the `<DESTINATION_BUCKET>` location.
4. Task mode: **Enhanced**.
5. Create the task, then choose **Start**, then **Start with defaults**.
6. Repeat with source `<SOURCE_PRESERVED_BUCKET>` and destination `<DESTINATION_PRESERVED_BUCKET>`.

When each task shows **Success**, the destination buckets should contain the same keys as the source, including `data-versions/`. Leave the source buckets in place.
