variable "aws_region" {
  description = "The AWS region containing the stack"
  type        = string
  default     = "us-west-1"
}

variable "stack_name" {
  description = "The name of the stack"
  type        = string
  default     = "personal-website-stack"
}

variable "domain_name" {
  description = "The domain name for the website"
  type        = string
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID for Terraform to use"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key for Terraform to use"
  type        = string
  sensitive   = true
}

variable "certificate_arn" {
  description = "The ARN of the SSL certificate for the website"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution to update"
  type        = string
}

variable "nasa_api_key" {
  description = "API key for NASA API access"
  type        = string
  sensitive   = true
}

variable "next_public_base_url" {
  description = "The base URL for the frontend application"
  type        = string
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket to create for hosting the frontend"
  type        = string
}

variable "static_files_bucket_arn" {
  description = "The ARN of the S3 bucket for hosting static files"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}
