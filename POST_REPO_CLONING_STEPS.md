# One Time Activity to Change Repository Name

## Post Creation

The `scripts` directory contains PowerShell and Bash scripts to set up the project by replacing placeholders with actual project details.  This will replace placeholders in the template files with the provided project details, ensuring consistency across the project.

It will also

## PowerShell Script

To run the PowerShell setup script, navigate to the `scripts` directory and run:

```powershell
cd scripts #  This is important as the script walks the directory from ..

.\setup-template.ps1 -projectName "My Project" -shortDescription "A short description of my project" -longDescription "A more detailed description of my project" -author "Jane Doe" -authorEmail "jane.doe@example.com"

```

## Bash Script

```bash
cd scripts #  This is important as the script walks the directory from ..

chmod +x scripts/setup-template.sh

./setup-template.sh "My Project" "A short description of my project" "A more detailed description of my project" "Jane Doe" "jane.doe@example.com" "2024-06-15" "2024-06-15T12:34:56Z" "2024"

```
