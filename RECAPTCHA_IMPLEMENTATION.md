# Google reCAPTCHA v2 Checkbox Implementation Guide

This document provides complete instructions for integrating Google reCAPTCHA v2 Checkbox into your SurangaTours login and registration pages.

## Overview

The implementation includes:
- **Frontend**: reCAPTCHA widget on both login and registration forms
- **Backend**: Server-side verification using Google's siteverify API
- **Error handling**: User-friendly messages for all failure scenarios
- **Security**: Secret key stored server-side only (never exposed to frontend)
- **Token expiration handling**: Automatic reset and user notification

---

## Prerequisites

1. **Google reCAPTCHA Keys**: Obtain your keys from [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Choose **reCAPTCHA v2** → **"Checkbox"**
   - Add your domains (e.g., `localhost` for development, your production domain)
   - You'll receive:
     - **Site Key** (public, used in frontend)
     - **Secret Key** (private, used in backend only)

---

## Step 1: Backend Configuration

### 1.1 Install Required Package

The `axios` package has been added for making HTTP requests to Google's API:

```bash
cd /workspace/server
npm install axios
```

### 1.2 Configure Environment Variables

Create or update the `.env` file in the `/workspace/server` directory:

```bash
# Server .env file
RECAPTCHA_SITE_KEY=your_actual_site_key_here
RECAPTCHA_SECRET_KEY=your_actual_secret_key_here
```

⚠️ **Security Note**: 
- The `.env` file is already in `.gitignore` - never commit it!
- The secret key must **never** be exposed in frontend code
- Use different keys for development and production

### 1.3 Backend Verification Logic

The verification logic has been added to `/workspace/server/controllers/authController.js`:

```javascript
const verifyRecaptcha = async (token) => {
    // Sends token to Google's siteverify API
    // Returns success/failure with appropriate messages
};
```

Both `registerUser` and `loginUser` functions now:
1. Check if reCAPTCHA token is present
2. Verify the token with Google
3. Only proceed with authentication if verification succeeds

---

## Step 2: Frontend Configuration

### 2.1 reCAPTCHA Script Loaded

The reCAPTCHA API script has been added to `/workspace/client/public/index.html`:

```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

### 2.2 Configure Environment Variables

Create a `.env` file in the `/workspace/client` directory:

```bash
# Client .env file
REACT_APP_RECAPTCHA_SITE_KEY=your_actual_site_key_here
```

⚠️ **Note**: 
- React requires `REACT_APP_` prefix for environment variables
- The site key is public and safe to include in frontend code
- Create `.env.development` and `.env.production` for different environments

### 2.3 Frontend Components Updated

Both login and registration pages now include:

1. **State Management**:
   - `recaptchaToken` - stores the verified token
   - `isSubmitting` - tracks submission state

2. **Callback Handlers**:
   - `handleRecaptchaChange(token)` - called when user completes reCAPTCHA
   - `handleRecaptchaExpired()` - called when token expires (after ~2 minutes)
   - `handleRecaptchaError()` - called on reCAPTCHA errors

3. **Form Validation**:
   - Submit button disabled until reCAPTCHA is completed
   - Token sent with every authentication request
   - Automatic reset on failures

4. **Widget Integration**:
```jsx
<div className="g-recaptcha" 
     data-sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
     data-callback={handleRecaptchaChange}
     data-expired-callback={handleRecaptchaExpired}
     data-error-callback={handleRecaptchaError}>
</div>
```

---

## Step 3: Testing

### Development Testing

1. Start the backend server:
```bash
cd /workspace/server
npm run dev
```

2. Start the frontend:
```bash
cd /workspace/client
npm start
```

3. Test scenarios:
   - ✅ Complete reCAPTCHA and submit form (should succeed)
   - ✅ Try to submit without completing reCAPTCHA (button should be disabled)
   - ✅ Wait for reCAPTCHA to expire (~2 minutes), then submit (should show error)
   - ✅ Enter wrong credentials after completing reCAPTCHA (should reset reCAPTCHA)
   - ✅ Use Google's test keys for automated testing (see below)

### Google Test Keys

For testing purposes, Google provides these keys that always verify successfully:

- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

⚠️ These keys show a warning banner and should only be used in development!

---

## Step 4: Production Deployment

### 4.1 Update reCAPTCHA Domain Settings

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Edit your reCAPTCHA configuration
3. Add your production domain(s):
   - `yourdomain.com`
   - `www.yourdomain.com`
   - Any subdomains you use

### 4.2 Set Production Environment Variables

**Server (.env)**:
```bash
RECAPTCHA_SITE_KEY=your_production_site_key
RECAPTCHA_SECRET_KEY=your_production_secret_key
```

**Client (.env.production)**:
```bash
REACT_APP_RECAPTCHA_SITE_KEY=your_production_site_key
```

### 4.3 Build and Deploy

```bash
# Build client
cd /workspace/client
npm run build

# Deploy server
cd /workspace/server
npm start
```

---

## Error Handling

### Frontend Error Messages

| Scenario | User Message |
|----------|-------------|
| reCAPTCHA not completed | "Please complete the reCAPTCHA verification" |
| reCAPTCHA expired | "reCAPTCHA expired. Please verify again." |
| reCAPTCHA error | "reCAPTCHA verification failed. Please try again." |
| Server error | "Server Error. Please try again." |
| Invalid credentials | "Invalid credentials" (from server) |

### Backend Error Responses

| Scenario | HTTP Status | Response Message |
|----------|-------------|------------------|
| Missing token | 400 | "Please complete the reCAPTCHA verification" |
| Verification failed | 400 | "reCAPTCHA verification failed. Please try again." |
| Configuration error | 400 | "reCAPTCHA configuration error" |
| Network error | 500 | "Unable to verify reCAPTCHA. Please try again." |

---

## Security Best Practices

1. ✅ **Secret Key Protection**: Never expose `RECAPTCHA_SECRET_KEY` in frontend code
2. ✅ **HTTPS Only**: Always use HTTPS in production (reCAPTCHA requires it)
3. ✅ **Domain Validation**: Configure allowed domains in reCAPTCHA admin console
4. ✅ **Server-Side Verification**: All tokens are verified on the server before processing
5. ✅ **Token Expiration**: Tokens expire after 2 minutes, preventing replay attacks
6. ✅ **Rate Limiting**: Consider adding rate limiting to auth endpoints (future enhancement)

---

## Troubleshooting

### Common Issues

**1. "reCAPTCHA configuration error"**
- Check that `RECAPTCHA_SECRET_KEY` is set in server `.env`
- Restart the server after updating `.env`

**2. Widget not showing**
- Verify `REACT_APP_RECAPTCHA_SITE_KEY` is set in client `.env`
- Check browser console for errors
- Ensure reCAPTCHA script is loaded (check Network tab)

**3. "Invalid domain for site key"**
- Add your current domain to reCAPTCHA admin console
- For localhost, add `localhost` and `127.0.0.1`

**4. Token always invalid**
- Ensure you're using matching site/secret key pairs
- Check that keys are for reCAPTCHA v2 Checkbox (not v3)

**5. reCAPTCHA not resetting on error**
- The implementation calls `window.grecaptcha.reset()` automatically
- Check browser console for JavaScript errors

---

## File Changes Summary

### Modified Files:
1. `/workspace/server/controllers/authController.js` - Added reCAPTCHA verification
2. `/workspace/client/src/pages/auth/LoginPage.jsx` - Added reCAPTCHA widget
3. `/workspace/client/src/pages/auth/RegisterPage.jsx` - Added reCAPTCHA widget
4. `/workspace/client/public/index.html` - Added reCAPTCHA script

### New Files:
1. `/workspace/server/.env.example` - Server environment template
2. `/workspace/client/.env.example` - Client environment template

### Dependencies Added:
1. `axios` (server) - For HTTP requests to Google's API

---

## Additional Resources

- [Google reCAPTCHA v2 Documentation](https://developers.google.com/recaptcha/docs/display)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Testing reCAPTCHA](https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha-v2-what-should-i-do)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console and server logs
3. Verify your reCAPTCHA keys are correct and active
4. Ensure your domain is properly configured in the admin console
