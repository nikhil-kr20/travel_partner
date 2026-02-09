# Network Access Guide

Your Travel Partner app is now configured to run on your local network!

## How to Access the App on Your Network

### 1. Find Your IP Address

**On Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually WiFi or Ethernet)
Example: `192.168.1.100`

**On Mac/Linux:**
```bash
ifconfig
```
or
```bash
hostname -I
```

### 2. Start the Server

```cmd
cd server
node app.js
```

The server will show:
```
Server running on http://0.0.0.0:3000
Access locally at: http://localhost:3000
Access on network at: http://<your-ip>:3000
```

### 3. Start the Client

```cmd
cd client
npm run dev
```

Vite will show:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### 4. Access from Other Devices

**On the same device:**
- Open browser: `http://localhost:5173`

**On other devices (phones, tablets, other computers):**
1. Make sure they're on the **same WiFi network**
2. Open browser and go to: `http://YOUR_IP:5173`
   - Replace `YOUR_IP` with your actual IP address
   - Example: `http://192.168.1.100:5173`

## Important Notes

### Firewall Settings
If you can't access from other devices:
1. **Check Windows Firewall:**
   - Allow Node.js through firewall
   - Allow port 3000 and 5173

2. **Add Firewall Rules:**
   ```cmd
   netsh advisedfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=3000
   netsh advisedfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
   ```

### Network Requirements
- All devices must be on the **same WiFi network**
- Router must allow device-to-device communication (some public WiFi blocks this)

## Configuration Details

### Client (Vite)
- File: `client/vite.config.js`
- Listens on: `0.0.0.0:5173`
- Dynamic API URL: Uses `window.location.hostname`

### Server (Express)
- File: `server/app.js`
- Listens on: `0.0.0.0:3000`
- CORS: Allows all origins (`*`)

### App
- File: `client/src/App.jsx`
- Automatically uses the correct hostname for API and Socket.IO connections
- Works with both `localhost` and IP addresses

## Troubleshooting

**Can't connect from other devices?**
1. Verify IP address is correct
2. Check firewall settings
3. Ensure both server and client are running
4. Try accessing from the host device first
5. Make sure you're on the same network

**API/Socket errors?**
- The app automatically detects the hostname
- Server must be running on port 3000
- Check browser console for specific errors

## Security Note

This configuration is for **local development only**. For production:
- Use HTTPS
- Implement proper CORS restrictions
- Add authentication middleware
- Use environment variables for configuration
