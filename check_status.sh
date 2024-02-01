#!/bin/bash

# Replace with your actual application status endpoint
STATUS_URL="http://20.237.87.252/status"

# Call the /status endpoint and capture the HTTP status code
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" $STATUS_URL)

# Check if the HTTP status code is 200 (OK)
if [ $HTTP_STATUS -eq 200 ]; then
  echo "Application is up and running."
  exit 0
else
  echo "Application is not responding or down."
  exit 1
fi
