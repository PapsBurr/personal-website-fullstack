terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }
  # # Potentially have to run terraform apply before uncommenting this remote backend
  # backend = {
  #   bucket         = var.state_bucket
  #   key            = "terraform.tfstate"
  #   region         = var.aws_region
  #   dynamodb_table = var.state_lock_table
  #   encrypt        = true
  # }

  required_version = ">= 1.2"
}

# Resources
# ---------------------------------------------------------------

# ## State bucket
# resource "aws_s3_bucket" "terraform_state_bucket" {
#   bucket        = "${local.prefix}-terraform-state-bucket"
#   force_destroy = true

#   tags = local.common_tags
# }

# resource "aws_s3_bucket_versioning" "terraform_state_bucket_versioning" {
#   bucket = aws_s3_bucket.terraform_state_bucket.id

#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# ## DynamoDB Table for State Locking
# resource "aws_dynamodb_table" "terraform_state_lock_table" {
#   name         = "${local.prefix}-terraform-state-lock-table"
#   billing_mode = "PAY_PER_REQUEST"
#   hash_key     = "LockID"

#   attribute {
#     name = "LockID"
#     type = "S"
#   }

#   tags = local.common_tags
# }

## Frontend S3 Bucket
resource "aws_s3_bucket" "frontend_bucket" {
  bucket        = "${local.prefix}-frontend-bucket"
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
resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id
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
  bucket = var.static_files_bucket_name
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
resource "aws_s3_bucket_policy" "static_files_bucket_policy" {
  bucket = data.aws_s3_bucket.static_files_bucket.id
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
          Resource : "${data.aws_s3_bucket.static_files_bucket.arn}/*"
        },
        {
          Effect : "Allow",
          Principal : {
            Service : "cloudfront.amazonaws.com"
          },
          Action : "s3:GetObject",
          Resource : "${data.aws_s3_bucket.static_files_bucket.arn}/*",
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

  assume_role_policy = jsonencode(
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
  origin_access_control_origin_type = "s3"
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

resource "aws_ecr_lifecycle_policy" "lambda_edge_repository_lifecycle_policy" {
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
  origin {
    origin_id                = "frontend-origin"
    domain_name              = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  origin {
    origin_id   = "backend-origin"
    domain_name = local.host_name
    origin_path = var.environment

    custom_origin_config {
      http_port              = 443
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = "TLSv1.2"
    }
  }

  aliases = [var.domain_name, "www.${var.domain_name}"]

  default_root_object = "index.html"

  depends_on = [aws_cloudfront_origin_access_control.oac]
  enabled    = true

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  default_cache_behavior {
    allowed_methods        = ["GET, HEAD, OPTIONS"]
    target_origin_id       = "frontend-origin"
    cached_methods         = ["GET, HEAD"]
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    lambda_function_association {
      event_type   = "viewer-request"
      include_body = false
      lambda_arn   = aws_lambda_alias.www_redirect_function_alias.qualified_arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# Unclear if I want this custom error response or not
# resource "customer_error_response" "cdn_404_response" {
#   distribution_id = aws_cloudfront_distribution.cdn.id
#   error_code      = 404
#   response_code   = 200
#   response_page_path = "/index.html"
# }

resource "custom_error_response" "cdn_403_response" {
  distribution_id    = aws_cloudfront_distribution.cdn.id
  error_code         = 403
  response_code      = 200
  response_page_path = "/index.html"
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
  function_name = "${local.prefix}-backend-function"
  package_type  = "Image"
  image_uri     = var.backend_function_image_uri
  timeout       = 30
  role          = aws_iam_role.lambda_edge_role.arn

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
      NODE_ENV                            = var.environment
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

resource "aws_lambda_permission" "apigateway_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend_function.function_name
  principal     = "apigateway.amazonaws.com"
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
  source_file = "lambda_functions/www-redirect-function.js"
  output_path = "lambda_functions/www-redirect-function.zip"
}

resource "aws_lambda_function" "www_redirect_function" {
  provider      = aws.us_east_1
  function_name = "${local.prefix}-www-redirect-function"
  role          = aws_iam_role.lambda_edge_role.arn
  runtime       = "nodejs24.x"
  handler       = "index.handler"
  timeout       = 5
  filename      = "lambda_functions/www-redirect-function.zip"
  publish       = true

  environment {
    variables = {
      TARGET_DOMAIN = var.domain_name
    }
  }

  depends_on = [
    aws_iam_role.lambda_edge_role,
    data.archive_file.www_redirect_function_zip
  ]

  tags = local.common_tags
}

resource "aws_lambda_alias" "www_redirect_function_alias" {
  name             = "live"
  function_name    = aws_lambda_function.www_redirect_function.function_name
  function_version = aws_lambda_function.www_redirect_function.version
}

## API Gateway
resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "${local.prefix}-api-gateway"
  protocol_type = "HTTP"

  tags = local.common_tags
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.api_gateway.id
  integration_type = "AWS_PROXY"

  integration_method = "GET" # I may want to change this to ANY later, but I will keep it as GET for security until I need more.
  integration_uri    = aws_lambda_function.backend_function.invoke_arn
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default"
  auto_deploy = true
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

  raw_url   = aws_apigatewayv2_stage.default_stage.invoke_url
  host_name = replace(raw_url, "https://", "")
}
