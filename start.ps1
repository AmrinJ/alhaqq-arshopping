# Start Backend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\consultancy2\ar-shopping-backend; node server.js`""

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\consultancy2\ar-shopping-frontend; npm run dev`""

Write-Host "AR Shopping Platform started!
Backend running at: http://localhost:5000
Frontend running at: http://localhost:5173" -ForegroundColor Green
