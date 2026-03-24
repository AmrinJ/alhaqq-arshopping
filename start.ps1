$env:Path = "C:\Program Files\nodejs;" + [System.Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH','User')
# Start Backend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\haris\Documents\AR\ar-shopping-backend; node server.js`""

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\haris\Documents\AR\ar-shopping-frontend; npm run dev`""

Write-Host "AR Shopping Platform started!
Backend running at: http://localhost:5000
Frontend running at: http://localhost:5173" -ForegroundColor Green
