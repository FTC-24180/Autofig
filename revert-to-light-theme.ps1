# Revert Dark Theme to Light Theme Script

$files = @(
    "src\App.jsx",
    "src\components\HamburgerMenu.jsx",
    "src\components\steps\Step1MatchSetup.jsx",
    "src\components\steps\Step4StartPosition.jsx",
    "src\components\steps\Step5Actions.jsx",
    "src\components\steps\Step6QRCode.jsx",
    "src\components\WizardStep.jsx",
    "src\components\WizardNavigation.jsx",
    "src\components\ManageConfigModal.jsx"
)

$replacements = @{
    # Revert text colors
    "text-slate-100" = "text-gray-800"
    "text-slate-200" = "text-gray-700"
    "text-slate-300" = "text-gray-700"
    "text-slate-400" = "text-gray-600"
    "text-slate-500" = "text-gray-500"
    
    # Revert background colors
    "bg-slate-900" = "bg-white"
    "bg-slate-800" = "bg-white"
    "bg-slate-700" = "bg-gray-100"
    "bg-slate-600" = "bg-gray-200"
    
    # Revert border colors
    "border-slate-700" = "border-gray-200"
    "border-slate-600" = "border-gray-300"
    "border-slate-500" = "border-gray-400"
    
    # Revert hover states
    "hover:bg-slate-800" = "hover:bg-gray-50"
    "hover:bg-slate-700" = "hover:bg-gray-100"
    "hover:bg-slate-600" = "hover:bg-gray-200"
    
    # Revert active states
    "active:bg-slate-700" = "active:bg-gray-100"
    "active:bg-slate-600" = "active:bg-gray-200"
    "active:bg-slate-500" = "active:bg-gray-300"
    
    # Revert info boxes
    "bg-indigo-950" = "bg-indigo-50"
    "border-indigo-900" = "border-indigo-200"
    "text-indigo-300" = "text-indigo-800"
    "text-indigo-400" = "text-indigo-600"
    
    # Revert success boxes
    "bg-green-950" = "bg-green-50"
    "border-green-900" = "border-green-200"
    "text-green-300" = "text-green-800"
    "text-green-400" = "text-green-600"
    
    # Revert blue boxes
    "bg-blue-950" = "bg-blue-50"
    "border-blue-900" = "border-blue-200"
    "text-blue-300" = "text-blue-800"
    "text-blue-400" = "text-blue-600"
    
    # Revert red boxes
    "bg-red-950" = "bg-red-50"
    "border-red-900" = "border-red-200"
    "text-red-300" = "text-red-800"
    "text-red-400" = "text-red-600"
    
    # Revert yellow boxes
    "bg-yellow-950" = "bg-yellow-50"
    "border-yellow-900" = "border-yellow-200"
    "text-yellow-300" = "text-yellow-800"
    "text-yellow-400" = "text-yellow-600"
    
    # Placeholder colors
    "placeholder-slate-500" = "placeholder-gray-400"
}

foreach ($file in $files) {
    Write-Host "Processing $file..." -ForegroundColor Cyan
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        foreach ($key in $replacements.Keys) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
        }
        
        Set-Content $file $content -NoNewline
        Write-Host "  ? Reverted $file to light theme" -ForegroundColor Green
    } else {
        Write-Host "  ? File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n? Light theme restored!" -ForegroundColor Green
Write-Host "Run 'npm run build' to compile the changes." -ForegroundColor Yellow
