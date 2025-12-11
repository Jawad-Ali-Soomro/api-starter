# Publishing Guide

## Option 1: Enable 2FA on npm (Recommended)

1. Go to https://www.npmjs.com/settings/jawad-dakhan/tokens
2. Click "Enable 2FA" and follow the setup
3. Once enabled, you can publish with:
   ```bash
   npm publish --access public
   ```

## Option 2: Create Granular Access Token

1. Go to https://www.npmjs.com/settings/jawad-dakhan/tokens
2. Click "Generate New Token"
3. Select "Granular Access Token"
4. Choose "Publish" permissions
5. Enable "Bypass 2FA" option
6. Copy the token
7. Use it to authenticate:
   ```bash
   npm login --auth-type=legacy
   # When prompted for password, paste your token
   ```
8. Then publish:
   ```bash
   npm publish --access public
   ```

## After Publishing

Users can install and use your package with:
```bash
npx @jawad-dakhan/api-starter@latest init
```
