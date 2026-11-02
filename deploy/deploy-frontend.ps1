# Builds the React site and uploads it to the server. Run from your PC.
$server = Read-Host "SSH login for your server (example: root@123.45.67.89)"
Push-Location (Join-Path $PSScriptRoot "..\frontend")
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    scp -r dist "${server}:/tmp/"
    if ($LASTEXITCODE -ne 0) { throw "Upload failed" }
    ssh -t $server "sudo rsync -rlt --delete --chmod=D755,F644 /tmp/dist/ /var/www/dental-clinic/ && rm -rf /tmp/dist"
    if ($LASTEXITCODE -ne 0) { throw "Publishing on the server failed" }
    Write-Host "Frontend deployed." -ForegroundColor Green
}
finally {
    Pop-Location
}
