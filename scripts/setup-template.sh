#!/bin/bash

# Function to prompt for argument if missing
prompt_for_argument() {
  local prompt_text=$1
  local default_value=$2
  local result

  read -p "$prompt_text [$default_value]: " result
  if [ -z "$result" ]; then
    result=$default_value
  fi
  echo $result
}

# Check for required arguments and prompt if missing
projectName=${1:-$(prompt_for_argument "Enter the project name" "")}
shortDescription=${2:-$(prompt_for_argument "Enter the short description" "")}
longDescription=${3:-$(prompt_for_argument "Enter the long description" "")}
author=${4:-$(prompt_for_argument "Enter the author" "Walter Hjelmar")}
authorEmail=${5:-$(prompt_for_argument "Enter the author email" "walter@hjelmar.com")}
currentDate=${6:-$(date +"%Y-%m-%d")}
timestamp=${7:-$(date --iso-8601=seconds)}
currentYear=${8:-$(date +"%Y")}

# Error out if required arguments are still missing
if [ -z "$projectName" ] || [ -z "$shortDescription" ] || [ -z "$longDescription" ]; then
  echo "Error: Missing required arguments. Project name, short description, and long description are required." >&2
  exit 1
fi

# Function to replace placeholders in a file
replace_placeholders() {
  local filePath=$1
  local projectName=$2
  local shortDescription=$3
  local longDescription=$4
  local currentDate=$5
  local timestamp=$6
  local currentYear=$7
  local author=$8
  local authorEmail=$9

  sed -i.bak \
      -e "s/{{PROJECT_NAME}}/$projectName/g" \
      -e "s/{{SHORT_DESCRIPTION}}/$shortDescription/g" \
      -e "s/{{LONG_DESCRIPTION}}/$longDescription/g" \
      -e "s/{{CURRENT_DATE}}/$currentDate/g" \
      -e "s/{{TIMESTAMP}}/$timestamp/g" \
      -e "s/{{CURRENT_YEAR}}/$currentYear/g" \
      -e "s/{{AUTHOR}}/$author/g" \
      -e "s/{{AUTHOR_EMAIL}}/$authorEmail/g" \
      $filePath

  # Remove the backup file created by sed
  rm "${filePath}.bak"
}

# Function to walk the file system and replace placeholders
process_files() {
  local path=$1
  find "$path" -type f | while read -r file; do
    replace_placeholders "$file" "$projectName" "$shortDescription" "$longDescription" "$currentDate" "$timestamp" "$currentYear" "$author" "$authorEmail"
  done
}

# Process all files in the repository
process_files ..

echo "Placeholders replaced successfully."

rm setup-template.*
cd ..
rm POST_REPO_CLONING_STEPS.md
echo "Setup scripts removed successfully."

# Add all changes and commit
git add --all
git commit --message "fix: replace placeholders with actual values"

echo "Setup completed successfully."
