terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
    # Potentially have to run terraform apply before uncommenting this remote backend
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

# Resources
# ---------------------------------------------------------------

## State bucket
resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket        = "${local.prefix}-terraform-state-bucket"
  force_destroy = true

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "terraform_state_bucket_versioning" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

## DynamoDB Table for State Locking
resource "aws_dynamodb_table" "terraform_state_lock_table" {
  name         = "${local.prefix}-terraform-state-lock-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = local.common_tags
}

## Frontend S3 Bucket
resource "aws_s3_bucket" "frontend_bucket" {
  bucket        = var.s3_bucket_name
  force_destroy = true

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "frontend_bucket_versioning" {
  bucket = aws_s3_bucket.frontend_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_server_side_encryption_configuration" "frontend_bucket_encryption" {
  bucket = aws_s3_bucket.frontend_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_bucket_public_access_block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "frontend_bucket_ownership_controls" {
  bucket = aws_s3_bucket.frontend_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

## Frontend S3 Bucket Policy
resource "aws_s3control_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3control_bucket.frontend_bucket.arn
  policy = jsonencode(
    {
      Version : "2012-10-17",
      Statement : [
        {
          Effect : "Allow",
          Principal : {
            Service : "cloudfront.amazonaws.com"
          },
          Action : "s3:GetObject",
          Resource : "${aws_s3_bucket.frontend_bucket.arn}/*",
          Condition : {
            StringEquals : {
              "AWS:SourceArn" : "${aws_cloudfront_distribution.cdn.arn}"
            }
          }
        }
      ]
    }
  )
}

## Static Files S3 Bucket (Already in place)
data "aws_s3_bucket" "static_files_bucket" {
  bucket = var.static_files_bucket_arn
}

resource "aws_s3_bucket_versioning" "static_files_bucket_versioning" {
  bucket = data.aws_s3_bucket.static_files_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_server_side_encryption_configuration" "static_files_bucket_encryption" {
  bucket = data.aws_s3_bucket.static_files_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "static_files_bucket_public_access_block" {
  bucket = data.aws_s3_bucket.static_files_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "static_files_bucket_ownership_controls" {
  bucket = data.aws_s3_bucket.static_files_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

## Static Files Bucket Policy
### TODO: AWS inside first principle needs LambdaEdgeRole.Arn
resource "aws_s3control_bucket_policy" "static_files_bucket_policy" {
  bucket = var.static_files_bucket_arn
  policy = jsonencode(
    {
      Version : "2012-10-17",
      Statement : [
        {
          Effect : "Allow",
          Principal : {
            AWS : aws_iam_role.lambda_edge_role.arn
          },
          Action : "s3:GetObject",
          Resource : "${var.static_files_bucket_arn}/*"
        },
        {
          Effect : "Allow",
          Principal : {
            Service : "cloudfront.amazonaws.com"
          },
          Action : "s3:GetObject",
          Resource : "${var.static_files_bucket_arn}/*",
          Condition : {
            StringEquals : {
              "AWS:SourceArn" : "${aws_cloudfront_distribution.cdn.arn}"
            }
          }
        }
      ]
    }
  )
}

## Lambda Edge Role
resource "aws_iam_role" "lambda_edge_role" {
  name = "${local.prefix}-lambda-edge-role"

  assume_role_policy = jsondecode(
    {
      Version : "2012-10-17",
      Statement : [
        {
          Effect : "Allow",
          Principal : {
            Service : [
              "lambda.amazonaws.com",
              "edgelambda.amazonaws.com"
            ]
          },
          Action : "sts:AssumeRole"
        }
      ]
  })

  tags = local.common_tags
}

## Origin Access Control
resource "aws_cloudfront_origin_access_control" "oac" {
  origin_access_control_origin_type = aws_s3_bucket.frontend_bucket.arn
  name                              = "${local.prefix}-oac"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ECR Repository for Lambda Edge Function
## TODO: Research IMMUTABLE and see if it is worth doing
resource "aws_ecr_repository" "lambda_edge_repository" {
  name                 = "${local.prefix}-lambda-edge-repository"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

resource "aws_ecr_repository_policy" "lambda_edge_repository_policy" {
  repository = aws_ecr_repository.lambda_edge_repository.name
  policy = jsonencode(
    {
      rules : [
        {
          rulePriority : 1,
          description : "Delete excess images",
          selection : {
            tagStatus : "any",
            countType : "imageCountMoreThan",
            countNumber : 2
          },
          action : {
            type : "expire"
          }
        }
      ]
    }
  )
}

## Cloudfront Distribution
### TODO: Add dependencies to LambdaEdgeRole and WwwRedirectFunction
resource "aws_cloudfront_distribution" "cdn" {
  depends_on = [aws_cloudfront_origin_access_control.oac]
  origin {
    domain_name = var.domain_name
  }
}


## AWS Lambda Backend
resource "aws_cloudwatch_log_group" "backend_function_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.backend_function.function_name}"
  retention_in_days = 14

  tags = local.common_tags
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "${local.prefix}-lambda-logging-policy"
  description = "IAM policy for Lambda function logging to CloudWatch"
  policy = jsonencode(
    {
      Version : "2012-10-17",
      Statement : [
        {
          Effect : "Allow",
          Action : [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          Resource : "arn:aws:logs:*:*:*"
        }
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_function" "backend_function" {
  provider = aws.us_east_1

  function_name = "${local.prefix}-backend-function"
  package_type  = "image"
  image_uri     = var.backend_function_image_uri
  timeout       = 30
  role          = aws_iam_role.lambda_execution_role.arn

  image_config {
    command = ["server.handler"]
  }

  logging_config {
    log_format            = "json"
    application_log_level = "INFO"
    system_log_level      = "WARN"
  }

  environment {
    variables = {
      NASA_API_KEY                        = var.nasa_api_key
      NEXT_PUBLIC_BASE_URL                = var.next_public_base_url
      NODE_ENV                            = local.environment
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
      STATIC_BUCKET_NAME                  = data.aws_s3_bucket.static_files_bucket.id
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.backend_function_log_group
  ]

  tags = local.common_tags
}

## Www Redirect Function
data "aws_iam_policy_document" "lambda_execution_assume_role_policy" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "archive_file" "www_redirect_function_zip" {
  type        = "zip"
  source_dir  = "lambda_functions/www-redirect-function"
  output_path = "lambda_functions/www-redirect-function.zip"
}

resource "aws_lambda_function" "www_redirect_function" {
  provider           = aws.us_east_1
  function_name      = "${local.prefix}-www-redirect-function"
  role               = aws_iam_role.lambda_edge_role.arn
  runtime            = "nodejs24.x"
  handler            = "index.handler"
  auto_publish_alias = "live"
  timeout            = 5
  filename           = "lambda_functions/www-redirect-function.zip"

  tags = local.common_tags
}

## API Gateway
resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "${local.prefix}-api-gateway"
  protocol_type = "HTTP"

  tags = local.common_tags
}

## Postgres Database
resource "aws_db_instance" "postgres_db" {
  allocated_storage   = 20
  storage_type        = "standard"
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t2.micro"
  db_name             = "${local.prefix}-db"
  username            = var.db_username
  password            = var.db_password
  skip_final_snapshot = true

  tags = local.common_tags
}

## VPC and Networking
resource "aws_vpc" "personal_website_vpc" {
  cidr_block = "10.0.0.0/24"

  tags = local.common_tags
}

resource "aws_subnet" "main_subnet" {
  vpc_id            = aws_vpc.personal_website_vpc.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "${var.aws_region}a"


  tags = local.common_tags
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.personal_website_vpc.id

  tags = local.common_tags
}


# Locals Values (!Sub)
# ---------------------------------------------------------------
locals {
  common_tags = {
    Project     = var.stack_name
    Environment = var.environment
    managed_by  = "Terraform"
  }
  prefix = "${var.stack_name}-${var.environment}"
}
