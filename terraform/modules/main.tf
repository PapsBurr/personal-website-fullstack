terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
    backend = {
      bucket         = var.state_bucket
      key            = "terraform.tfstate"
      region         = var.aws_region
      dynamodb_table = var.state_lock_table
      encrypt        = true
    }
  }

  required_version = ">= 1.2"
}


provider "aws" {
  region = var.aws_region
}

# Resources
# ---------------------------------------------------------------

## State bucket
resource "aws_s3_bucket" "state_bucket" {
  bucket = "${local.prefix}-state-bucket"

  tags = local.common_tags
}

## DynamoDB Table for State Locking
resource "aws_dynamodb_table" "state_lock_table" {
  name         = "${local.prefix}-state-lock-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = local.common_tags
}

## AWS Lambda Backend

## Frontend S3 Bucket
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.s3_bucket_name

  tags = local.common_tags
}

## Frontend S3 Bucket Policy
resource "aws_s3control_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3control_bucket.frontend_bucket.arn
  policy = <<EOT
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "cloudfront.amazonaws.com"
          },
          "Action": "s3:GetObject",
          "Resource": "${aws_s3_bucket.frontend_bucket.arn}/*"
          "Condition": {
            "StringEquals": {
              "AWS:SourceArn": "${aws_cloudfront_distribution.cdn.arn}"
            }
          }
        }
      ]
    }
  EOT
}

## Static Files Bucket Policy
### TODO: AWS inside first principle needs LambdaEdgeRole.Arn
resource "aws_s3control_bucket_policy" "static_files_bucket_policy" {
  bucket = var.static_files_bucket_arn
  policy = <<EOT
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": ""
          },
          "Action": "s3:GetObject",
          "Resource": "${var.static_files_bucket_arn}/*"
        }
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "cloudfront.amazonaws.com"
          },
          "Action": "s3:GetObject",
          "Resource": "${var.static_files_bucket_arn}/*"
          "Condition": {
            "StringEquals": {
              "AWS:SourceArn": "${aws_cloudfront_distribution.cdn.arn}"
            }
          }
        }
      ]
    }
  EOT
}

## Lambda Edge Role

## Www Redirect Function

## Cloudfront Distribution
### TODO: Add dependencies to LambdaEdgeRole and WwwRedirectFunction
resource "aws_cloudfront_distribution" "cdn" {
  depends_on = []

}

## Origin Access Control

resource "aws_cloudfront_origin_access_control" "oac" {

}

## Express API Function

# Locals Values (!Sub)
locals {
  common_tags = {
    Project     = var.stack_name
    Environment = var.environment
    managed_by  = "Terraform"
  }
  prefix = "${var.stack_name}-${var.environment}"
}
