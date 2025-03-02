param (
    [string]$projectName,
    [string]$shortDescription,
    [string]$longDescription,
    [string]$author = "Walter Hjelmar",
    [string]$authorEmail = "walter@hjelmar.com",
    [string]$currentDate = (Get-Date -Format "yyyy-MM-dd"),
    [string]$timestamp = (Get-Date -Format "o"),
    [string]$currentYear = (Get-Date -Format "yyyy")
)

function PromptForArgument {
    param (
        [string]$promptText,
        [string]$defaultValue
    )

    $response = Read-Host "$promptText [$defaultValue]"
    if ([string]::IsNullOrEmpty($response)) {
        return $defaultValue
    }
    return $response
}

# Prompt for missing arguments
if (-not $projectName) {
    $projectName = PromptForArgument "Enter the project name" $null
}
if (-not $shortDescription) {
    $shortDescription = PromptForArgument "Enter the short description" $null
}
if (-not $longDescription) {
    $longDescription = PromptForArgument "Enter the long description" $null
}

# Error out if required arguments are still missing
if (-not $projectName -or -not $shortDescription -or -not $longDescription) {
    Write-Host "Error: Missing required arguments. Project name, short description, and long description are required." -ForegroundColor Red
    exit 1
}

# Function to replace placeholders in a file
function Replace-Placeholders {
    param (
        [string]$filePath,
        [string]$projectName,
        [string]$shortDescription,
        [string]$longDescription,
        [string]$currentDate,
        [string]$timestamp,
        [string]$currentYear,
        [string]$author,
        [string]$authorEmail
    )

    (Get-Content $filePath) -replace "{{PROJECT_NAME}}", $projectName `
                            -replace "{{SHORT_DESCRIPTION}}", $shortDescription `
                            -replace "{{LONG_DESCRIPTION}}", $longDescription `
                            -replace "{{CURRENT_DATE}}", $currentDate `
                            -replace "{{TIMESTAMP}}", $timestamp `
                            -replace "{{CURRENT_YEAR}}", $currentYear `
                            -replace "{{AUTHOR}}", $author `
                            -replace "{{AUTHOR_EMAIL}}", $authorEmail | Set-Content $filePath
}

# Generate date and timestamp
$currentDate = (Get-Date -Format "yyyy-MM-dd")
$timestamp = (Get-Date -Format "o")
$currentYear = (Get-Date -Format "yyyy")

# Function to walk the file system and replace placeholders
function Process-Files {
    param (
        [string]$path
    )

    Get-ChildItem -Path $path -Recurse -File | ForEach-Object {
        Replace-Placeholders -filePath $_.FullName `
                             -projectName $projectName `
                             -shortDescription $shortDescription `
                             -longDescription $longDescription `
                             -currentDate $currentDate `
                             -timestamp $timestamp `
                             -currentYear $currentYear `
                             -author $author `
                             -authorEmail $authorEmail
    }
}

# Process all files in the repository
Process-Files -path ".."

Write-Host "Placeholders replaced successfully."

# Add all changes and commit
git add --all
git commit --message "fix: replace placeholders with actual values"

Remove-Item setup-templates.ps1
Remove-Item setup-templates.sh

cd ..

Remove-Item POST_REPO_CLONING_STEPS.md
Write-Host "Removed setup scripts successfully."


Write-Host "Setup completed successfully."
