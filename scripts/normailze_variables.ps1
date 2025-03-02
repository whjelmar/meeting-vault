param (
    [string]$directory = (Get-Location),  # Default to current directory
    [switch]$recursive                     # Enable recursive search
)

# Define a mapping for standard variable names
$standardVariableMap = @{
    "created"       = "date_created"
    "dateCreated"   = "date_created"
    "CreateDate"    = "date_created"
    "modified"      = "date_modified"
    "lastModified"  = "date_modified"
    "updated_at"    = "date_modified"
    "userName"      = "user_name"
    "User_Name"     = "user_name"
    "fileName"      = "file_name"
    "noteTitle"     = "note_title"
    "obsidianTag"   = "obsidian_tag"
}

# Function to convert variable names to lower snake_case
function Convert-ToSnakeCase {
    param ([string]$inputString)
    if (-not $inputString) { return "" }

    # Convert PascalCase / camelCase to snake_case
    $snakeCase = $inputString -replace '([a-z0-9])([A-Z])', '$1_$2'

    # Replace dashes or spaces with underscores and normalize underscores
    $snakeCase = $snakeCase -replace '[-\s]', '_' -replace '__+', '_'
    return $snakeCase.ToLower()
}

# Process JavaScript & Markdown files
$searchOption = if ($recursive) { "-Recurse" } else { "" }
$files = Get-ChildItem -Path $directory -Filter "*.js", "*.md" -File $searchOption

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"

    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content

    # Find all variables using regex (handles common JS and Markdown variables)
    $variables = [regex]::Matches($content, '\b[a-zA-Z_][a-zA-Z0-9_]*\b') | 
                 ForEach-Object { $_.Value } | 
                 Select-Object -Unique

    foreach ($var in $variables) {
        $normalized = if ($standardVariableMap.ContainsKey($var)) {
            $standardVariableMap[$var]  # Use predefined mapping
        } else {
            Convert-ToSnakeCase $var    # Convert dynamically
        }

        if ($var -ne $normalized) {
            Write-Host "Renaming $var -> $normalized"
            $content = $content -replace "\b$var\b", $normalized
        }
    }

    # Save backup before modifying
    if ($originalContent -ne $content) {
        Copy-Item -Path $file.FullName -Destination "$($file.FullName).bak" -Force
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated: $($file.FullName) (Backup saved as .bak)"
    } else {
        Write-Host "No changes needed."
    }
}

Write-Host "Variable normalization complete."
