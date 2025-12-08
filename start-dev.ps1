# Kill any existing node processes to free up ports
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment for ports to be released
Start-Sleep -Seconds 1

# Start the dev server
npm run dev
