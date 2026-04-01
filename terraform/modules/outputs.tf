output "website_url" {
  description = "The Website's URL"
  value       = "https://${var.domain_name}"
}

output "frontend_bucket_name" {
  description = "The name of the S3 bucket hosting the frontend"
  value       = aws_s3_bucket.frontend_bucket.bucket
}

output "cloudfront_distribution_domain" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.cdn.id
}
