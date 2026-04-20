$ErrorActionPreference = 'Stop'

$sourceDir = 'C:\Users\HP\Videos\NikaSource'
$destDir = 'C:\Users\HP\Projects\NIKA-APP\public\videos'
$allowed = @('*.mp4','*.mkv','*.avi','*.mov','*.webm')

if (-not (Test-Path $sourceDir)) {
  Write-Host "Source folder not found: $sourceDir" -ForegroundColor Red
  exit 1
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null

$files = foreach ($pattern in $allowed) {
  Get-ChildItem -Path $sourceDir -Filter $pattern -File -ErrorAction SilentlyContinue
}

if (-not $files) {
  Write-Host "No video files found in $sourceDir" -ForegroundColor Yellow
  Write-Host "Put cartoons there, then run this script again."
  exit 0
}

foreach ($file in $files) {
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
  $safeName = ($baseName -replace '[^a-zA-Z0-9\-_ ]', '').Trim() -replace '\s+', '-'
  if ([string]::IsNullOrWhiteSpace($safeName)) {
    $safeName = "video-$(Get-Random)"
  }
  $output = Join-Path $destDir ("$safeName.mp4")

  Write-Host "Compressing $($file.Name) -> $([System.IO.Path]::GetFileName($output))" -ForegroundColor Cyan

  ffmpeg -y -i $file.FullName `
    -vf "scale='min(1280,iw)':-2" `
    -c:v libx264 `
    -preset medium `
    -crf 25 `
    -c:a aac `
    -b:a 128k `
    -movflags +faststart `
    $output

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed on $($file.Name)" -ForegroundColor Red
    exit $LASTEXITCODE
  }
}

Write-Host "Done. Compressed cartoons are now in: $destDir" -ForegroundColor Green
Write-Host "Next: update src/data/cartoons.js if you want the app to use your exact file names." -ForegroundColor Green
