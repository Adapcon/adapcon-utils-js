#!/usr/bin/env bash

AWS_ACCESS_KEY_ID = $(echo "$1" | jq -r ".SIMPLIFICAMAIS_PRD_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = $(echo "$1" | jq -r ".SIMPLIFICAMAIS_PRD_AWS_SECRET_ACCESS_KEY")
AWS_REGION = "sa-east-1"

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "::error ::undefined variables"
  exit 1
fi

echo "::set-output name=aws_key::${AWS_ACCESS_KEY_ID}"
echo "::set-output name=aws_secret::${AWS_SECRET_ACCESS_KEY}"
echo "::set-output name=aws_region::${AWS_REGION}"

exit 0
