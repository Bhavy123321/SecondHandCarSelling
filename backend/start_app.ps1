$backend = Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "f:\Laptop\Desktop\SecondHandCarSelling\SecondHandCarSelling\SecondHandCarSelling" -PassThru
Write-Host "Backend started with PID: $($backend.Id)"

$frontend = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "f:\Laptop\Desktop\SecondHandCarSelling\frontend" -PassThru
Write-Host "Frontend started with PID: $($frontend.Id)"

Read-Host "Press Enter to stop servers..."

Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -ErrorAction SilentlyContinue
