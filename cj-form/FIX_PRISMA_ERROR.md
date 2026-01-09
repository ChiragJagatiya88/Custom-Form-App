# Fix Prisma EPERM Permission Error on Windows

## Quick Fix Steps

### Option 1: Manual Fix (Recommended)

1. **Close all Node processes:**
   ```powershell
   # In PowerShell (run as Administrator if needed)
   Get-Process node | Stop-Process -Force
   ```

2. **Close your IDE/Editor** (VS Code, Cursor, etc.) temporarily

3. **Delete the .prisma folder:**
   ```powershell
   cd cj-custom-app
   Remove-Item -Recurse -Force node_modules\.prisma
   ```

4. **Regenerate Prisma:**
   ```powershell
   npx prisma generate
   ```

5. **Try again:**
   ```powershell
   shopify app dev
   ```

### Option 2: Use the Fix Script

Run the provided PowerShell script:

```powershell
cd cj-custom-app
.\fix-prisma.ps1
```

**Note:** You may need to run PowerShell as Administrator:
- Right-click PowerShell → "Run as Administrator"
- Navigate to your project folder
- Run the script

### Option 3: Alternative Solutions

#### A. Run as Administrator
1. Close your terminal/IDE
2. Right-click PowerShell → "Run as Administrator"
3. Navigate to project: `cd "D:\2. Project\Manish\App-research\cj-custom-app"`
4. Run: `npx prisma generate`

#### B. Check Antivirus
- Temporarily disable antivirus
- Add project folder to antivirus exclusions
- Try regenerating Prisma

#### C. Use Binary Engine Type
Add to your `.env` file or set environment variable:
```powershell
$env:PRISMA_CLIENT_ENGINE_TYPE="binary"
npx prisma generate
```

#### D. Clean Install
```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
npx prisma generate
```

## Why This Happens

The error occurs because:
1. **File Lock:** Another process (Node, IDE, antivirus) has the file open
2. **Windows Permissions:** Insufficient permissions to rename the file
3. **Path with Spaces:** Windows sometimes has issues with paths containing spaces (like "2. Project")

## Prevention

1. Always close Node processes before regenerating Prisma
2. Close your IDE when running Prisma commands
3. Consider moving project to a path without spaces (e.g., `D:\Projects\App-research`)

## Still Having Issues?

If none of the above work:

1. **Restart your computer** (clears all file locks)
2. **Move project to a path without spaces**
3. **Check Windows Defender/Antivirus exclusions**
