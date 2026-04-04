$ErrorActionPreference = 'Stop'

$docsPath = Join-Path $PSScriptRoot '..\docs'
$browserPath = Join-Path $docsPath 'browser'

if (-not (Test-Path $browserPath)) {
  throw "Expected build output at '$browserPath'."
}

Get-ChildItem -LiteralPath $browserPath | ForEach-Object {
  $destination = Join-Path $docsPath $_.Name

  if (Test-Path $destination) {
    Remove-Item -LiteralPath $destination -Recurse -Force
  }

  Move-Item -LiteralPath $_.FullName -Destination $destination -Force
}

Remove-Item -LiteralPath $browserPath -Recurse -Force
New-Item -ItemType File -Path (Join-Path $docsPath '.nojekyll') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $docsPath 'index.html') -Destination (Join-Path $docsPath '404.html') -Force
