# 📧 Gmail + n8n Certificate Email Setup Guide

Complete guide to set up automated certificate email sending using Gmail and n8n workflow automation for Romega Solutions Certificate Generator.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Gmail Setup](#gmail-setup)
3. [n8n Installation](#n8n-installation)
4. [n8n Workflow Creation](#n8n-workflow-creation)
5. [Application Configuration](#application-configuration)
6. [Testing the Flow](#testing-the-flow)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)
9. [Advanced Configuration](#advanced-configuration)
10. [Production Deployment](#production-deployment)

---

## 🔧 Prerequisites

Before starting, ensure you have:

- ✅ Gmail account (or Google Workspace account)
- ✅ n8n instance (self-hosted or n8n.cloud)
- ✅ Node.js 18+ installed (if self-hosting n8n)
- ✅ Your certificate generator app running
- ✅ Internet connection for testing
- ✅ Basic understanding of webhooks and APIs

---

## 📧 Gmail Setup

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **"2-Step Verification"**
3. Follow the setup wizard to enable it
4. Verify your phone number

> ⚠️ **Important:** 2-Step Verification is REQUIRED for app passwords to work.

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Click **"Select app"** → Choose **"Mail"**
3. Click **"Select device"** → Choose **"Other (Custom name)"**
4. Enter name: **"Certificate Generator n8n"**
5. Click **"Generate"**
6. **Copy the 16-character password** immediately
   - Example format: `abcd efgh ijkl mnop`
   - Remove spaces when using: `abcdefghijklmnop`

### Step 3: Save Your Credentials Securely

```
Gmail Address: your-email@gmail.com
App Password: abcdefghijklmnop
```

⚠️ **Security Warning:**

- Never commit app passwords to version control
- Store in password manager
- Never share publicly

---

## 🚀 n8n Installation

### Option A: n8n Cloud (Recommended for Beginners)

**Pros:** No server management, auto-updates, SSL included

1. Visit [n8n.cloud](https://n8n.cloud)
2. Click **"Start Free Trial"**
3. Create account with email
4. Verify your email address
5. Access dashboard at `https://[your-workspace].app.n8n.cloud`

**Pricing:**

- Free tier: 100 workflow executions/month
- Starter: $20/month for 2,500 executions
- Pro: Custom pricing for unlimited

### Option B: Self-Hosted with Docker (Recommended for Production)

**Pros:** Full control, unlimited executions, data privacy

```bash
# Create n8n directory
mkdir n8n-data
cd n8n-data

# Run n8n container
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v $(pwd):/home/node/.n8n \
  n8nio/n8n
```

Access at: `http://localhost:5678`

**For production with SSL:**

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 443:443 \
  -e N8N_PROTOCOL=https \
  -e N8N_HOST=n8n.yourdomain.com \
  -e N8N_PORT=443 \
  -e N8N_SSL_KEY=/certs/privkey.pem \
  -e N8N_SSL_CERT=/certs/fullchain.pem \
  -v $(pwd):/home/node/.n8n \
  -v /etc/letsencrypt/live/n8n.yourdomain.com:/certs:ro \
  n8nio/n8n
```

### Option C: Self-Hosted with npm

**Pros:** Quick setup, good for development

```bash
# Install n8n globally
npm install -g n8n

# Start n8n (development)
n8n start

# Or with custom port
n8n start --tunnel
```

Access at: `http://localhost:5678`

> 💡 **Tip:** Use `--tunnel` flag for automatic public URL (good for testing webhooks locally)

---

## 🔨 n8n Workflow Creation

### Step 1: Create New Workflow

1. Login to your n8n instance
2. Click **"+ New Workflow"** (top right)
3. Click on **"My workflow"** (top left) to rename
4. Enter name: **"Certificate Email Sender"**
5. Click **"Save"**

### Step 2: Add Webhook Node (Trigger)

1. Click the **"+"** button in the canvas
2. Search for **"Webhook"**
3. Click **"Webhook"** to add it
4. Configure the webhook:

```yaml
HTTP Method: POST
Path: send-certificate
Authentication: None # We'll add this later for security
Response Mode: When Last Node Finishes
Response Code: 200
Response Data: Last Node
```

5. Click **"Listen for Test Event"** button
6. The webhook URL will appear - **COPY THIS URL**
   - Cloud example: `https://your-workspace.app.n8n.cloud/webhook/send-certificate`
   - Self-hosted: `http://localhost:5678/webhook/send-certificate`

> 📝 **Note:** Keep this URL safe - you'll add it to your app's environment variables

### Step 3: Test Webhook Reception (Optional but Recommended)

Test that n8n can receive data:

```bash
curl -X POST "YOUR_WEBHOOK_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "test": "Hello from certificate generator"
  }'
```

You should see the data appear in n8n's execution panel.

### Step 4: Add Gmail Node

1. Click **"+"** after the Webhook node
2. Search for **"Gmail"**
3. Click **"Gmail"** to add it

#### Configure Gmail Credentials

**Method 1: OAuth2 (Recommended)**

1. Click **"Select Credential"** → **"Create New"**
2. Click **"OAuth2"**
3. You'll be redirected to Google
4. Allow n8n to access Gmail
5. You'll be redirected back to n8n

**Method 2: App Password (Alternative)**

If OAuth2 doesn't work:

1. Click **"Select Credential"** → **"Create New"**
2. Choose **"Service Account"** (if available) or configure SMTP
3. Enter your Gmail address
4. Enter the app password you generated earlier

#### Configure Gmail Node Settings

```yaml
Resource: Message
Operation: Send

# Email Configuration
To: { { $json.email } }
Subject: { { $json.subject } }
Email Type: HTML
```

**Message (HTML):**

```html
<div
  style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"
>
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">{{ $json.subject }}</h1>
  </div>

  <!-- Main Message -->
  <div
    style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;"
  >
    <p
      style="white-space: pre-line; line-height: 1.6; color: #334155; margin: 0;"
    >
      {{ $json.message }}
    </p>
  </div>

  <!-- Certificate Image -->
  <div style="text-align: center; margin: 30px 0;">
    <img
      src="{{ $json.certificateImage }}"
      alt="Certificate of Completion"
      style="max-width: 100%; height: auto; border: 2px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    />
  </div>

  <!-- Footer -->
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

  <div style="color: #64748b; font-size: 12px; text-align: center;">
    <p style="margin: 5px 0;">
      <strong>Recipient:</strong> {{ $json.recipientName }}
    </p>
    <p style="margin: 5px 0;"><strong>Sent:</strong> {{ $json.timestamp }}</p>
    <p style="margin: 15px 0 5px;">Romega Solutions - Certificate Generator</p>
  </div>
</div>
```

**Attachments (Optional - Download as file):**

If you want to attach the certificate as a downloadable file:

```yaml
Attachments:
  - Property Name: attachment
    Binary Property: image
    File Name: =certificate-{{ $json.recipientName.replace(/\s+/g, '-').toLowerCase() }}.png
```

To use attachments, add a **"Convert to File"** node before Gmail:

1. Add **"HTTP Request"** node
2. URL: `{{ $json.certificateImage }}`
3. Output format: Binary
4. Binary Property: `image`

### Step 5: Add Response Node

1. Click **"+"** after Gmail node
2. Search for **"Respond to Webhook"**
3. Click to add it
4. Configure response:

```yaml
Response Code: 200
Response Body:
```

**Response JSON:**

```json
{
  "success": true,
  "message": "Email sent successfully to {{ $('Webhook').item.json.email }}",
  "recipient": "{{ $('Webhook').item.json.recipientName }}",
  "timestamp": "={{ new Date().toISOString() }}",
  "executionId": "={{ $execution.id }}"
}
```

### Step 6: Add Error Handling

**Option A: Simple Error Handling**

1. Click on the **Gmail** node
2. Go to **"Settings"** tab (gear icon)
3. Toggle **"Continue On Fail"** to ON
4. Under **"On Error"**, select **"Continue with next node"**

**Option B: Advanced Error Handling**

Add an **IF** node after Gmail:

```yaml
Condition 1:
  Value 1: { { $json.success } }
  Operation: is not equal
  Value 2: false
```

Connect:

- **True** → Respond to Webhook (success response)
- **False** → Respond to Webhook (error response)

Error Response JSON:

```json
{
  "success": false,
  "error": "Failed to send email",
  "message": "{{ $json.error }}",
  "timestamp": "={{ new Date().toISOString() }}"
}
```

### Complete Workflow Visualization

```
┌─────────────────┐
│   Webhook       │ ◄─── Receives POST from your app
│   (Trigger)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Set Headers   │ ◄─── Optional: Add custom headers
│   (Optional)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Gmail Node    │ ◄─── Sends email with certificate
│   (Send Email)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   IF Node       │ ◄─── Check if email sent successfully
│   (Error Check) │
└────┬───────┬────┘
     │       │
     │       └────────────────┐
     ▼                        ▼
┌─────────────┐      ┌─────────────┐
│  Response   │      │  Response   │
│  (Success)  │      │  (Error)    │
└─────────────┘      └─────────────┘
```

### Step 7: Test the Workflow

1. Click **"Execute Workflow"** (top right)
2. The webhook should show "Waiting for webhook call..."
3. Use this curl command to test:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@gmail.com",
    "subject": "Test Certificate",
    "message": "Dear Test User,\n\nThis is a test email from the certificate generator.",
    "certificateImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "recipientName": "Test User",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }'
```

4. Check your email inbox for the test email
5. Verify the certificate image displays correctly

### Step 8: Activate Workflow

1. Click **"Save"** (top right)
2. Toggle the **"Active"** switch to **ON**
3. Your workflow is now live and ready to receive requests! 🎉

---

## ⚙️ Application Configuration

### Step 1: Create Environment File

In your certificate generator project root, create `.env.local`:

```bash
touch .env.local
```

### Step 2: Add n8n Configuration

Open `.env.local` and add:

```env
# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://your-workspace.app.n8n.cloud/webhook/send-certificate

# Optional: Basic Authentication (if configured in n8n)
# N8N_WEBHOOK_USERNAME=certificate_sender
# N8N_WEBHOOK_PASSWORD=your-strong-password

# Optional: Retry Configuration
# EMAIL_RETRY_ATTEMPTS=3
# EMAIL_RETRY_DELAY=2000

# Optional: Rate Limiting
# EMAIL_RATE_LIMIT=10
# EMAIL_RATE_LIMIT_WINDOW=60000
```

**Important Variables:**

| Variable               | Description                    | Example                                |
| ---------------------- | ------------------------------ | -------------------------------------- |
| `N8N_WEBHOOK_URL`      | Your n8n webhook URL           | `https://n8n.company.com/webhook/send` |
| `N8N_WEBHOOK_USERNAME` | Basic auth username (optional) | `cert_sender`                          |
| `N8N_WEBHOOK_PASSWORD` | Basic auth password (optional) | `secure_pass_123`                      |

### Step 3: Verify Configuration

Create a test file `test-env.js`:

```javascript
// test-env.js
require("dotenv").config({ path: ".env.local" });

console.log("Environment Variables Check:");
console.log(
  "✓ N8N_WEBHOOK_URL:",
  process.env.N8N_WEBHOOK_URL ? "Set" : "Missing"
);
console.log("✓ Webhook URL:", process.env.N8N_WEBHOOK_URL);
```

Run it:

```bash
node test-env.js
```

Expected output:

```
Environment Variables Check:
✓ N8N_WEBHOOK_URL: Set
✓ Webhook URL: https://your-workspace.app.n8n.cloud/webhook/send-certificate
```

### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Restart
pnpm run dev
```

Verify the environment variable is loaded:

```bash
# In browser console or server logs
console.log(process.env.N8N_WEBHOOK_URL)
```

---

## 🧪 Testing the Flow

### Test 1: Single Certificate (Quick Test)

1. **Login** to your certificate generator
2. Navigate to **Generator** page
3. Design a simple certificate
4. Click **"Add to Queue"**
5. Fill in test details:
   ```
   Email: your-email@gmail.com
   Subject: Test Certificate - Single Send
   Message: This is a test certificate email
   ```
6. Click **"Add to Queue"**
7. Navigate to **Email Queue** page
8. Select the queued email
9. Click **"Send Selected"**

**Expected Results:**

- ✅ Status changes: `pending` → `sending` → `sent`
- ✅ Email appears in your inbox within 30 seconds
- ✅ Certificate image displays correctly
- ✅ No errors in browser console or n8n logs

### Test 2: Batch Certificate Generation

1. **Create test data** file `test-batch.json`:

```json
[
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "title": "Web Development Bootcamp",
    "date": "2024-01-15",
    "instructor": "Jane Smith"
  },
  {
    "name": "Sarah Johnson",
    "email": "sarah.j@example.com",
    "title": "Advanced TypeScript",
    "date": "2024-01-16",
    "instructor": "Mike Wilson"
  },
  {
    "name": "Michael Chen",
    "email": "m.chen@example.com",
    "title": "React & Next.js Mastery",
    "date": "2024-01-17",
    "instructor": "Emily Davis"
  }
]
```

2. **Upload batch file:**

   - Go to Generator → **Batch** tab
   - Click **"Upload JSON"**
   - Select `test-batch.json`
   - Verify preview shows all 3 recipients

3. **Queue all certificates:**

   - Click **"Queue All Certificates"**
   - Wait for processing (usually 5-10 seconds)
   - Success message should appear

4. **Send batch:**
   - Navigate to **Email Queue** page
   - You should see 3 pending emails
   - Select all 3 (checkbox)
   - Click **"Send Selected"**

**Expected Results:**

- ✅ All 3 emails queue successfully
- ✅ Emails send one by one (observe status changes)
- ✅ All 3 recipients receive emails
- ✅ n8n shows 3 successful executions

### Test 3: Error Handling

**Test scenario: Invalid email address**

1. Add certificate to queue with invalid email: `invalid-email`
2. Try to send
3. Should fail gracefully with error message

**Test scenario: Network failure**

1. Stop n8n workflow (toggle Active to OFF)
2. Try to send email
3. Should show "Failed to send" status
4. Re-activate workflow
5. Retry sending - should work

### Test 4: Large Batch (Stress Test)

Create `large-batch.json` with 50+ recipients:

```javascript
// generate-test-batch.js
const fs = require("fs");

const recipients = Array.from({ length: 50 }, (_, i) => ({
  name: `Test User ${i + 1}`,
  email: `testuser${i + 1}@example.com`,
  title: `Course ${i + 1}`,
  date: new Date().toISOString().split("T")[0],
}));

fs.writeFileSync("large-batch.json", JSON.stringify(recipients, null, 2));
console.log("✓ Generated large-batch.json with 50 recipients");
```

Run: `node generate-test-batch.js`

Upload and send - monitor for:

- Memory usage
- Send time
- Success rate
- n8n execution times

---

## 🔍 Troubleshooting

### Issue 1: "Email service not configured" Error

**Symptom:** Error when trying to send emails

**Cause:** `N8N_WEBHOOK_URL` environment variable not set

**Solution:**

```bash
# 1. Check if .env.local exists
ls -la .env.local

# 2. Verify contents
cat .env.local

# 3. Should see:
# N8N_WEBHOOK_URL=https://...

# 4. If missing, create it:
echo "N8N_WEBHOOK_URL=YOUR_WEBHOOK_URL_HERE" > .env.local

# 5. Restart dev server
pnpm run dev
```

### Issue 2: "Failed to send email" / Network Error

**Symptom:** Emails stuck in "sending" or "failed" status

**Possible Causes:**

1. n8n workflow is inactive
2. Webhook URL is incorrect
3. Network/firewall blocking request
4. n8n server is down

**Solutions:**

**A. Verify n8n workflow is active:**

1. Open n8n dashboard
2. Find "Certificate Email Sender" workflow
3. Check if toggle is **ON** (green)
4. If OFF, toggle it ON

**B. Test webhook directly:**

```bash
# Test if webhook is accessible
curl -v -X POST "YOUR_N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'

# Should return 200 OK
```

**C. Check n8n execution logs:**

1. Go to n8n → **Executions** (left sidebar)
2. Look for recent failed executions
3. Click on failed execution
4. Review error message
5. Common errors:
   - "Timeout" → Gmail credentials expired
   - "Invalid JSON" → Data format issue
   - "Authentication failed" → Re-authorize Gmail

**D. Verify CORS/Network:**

```javascript
// In browser console (on your app)
fetch(process.env.N8N_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ test: "cors-check" }),
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### Issue 3: Gmail Authentication Failed

**Symptom:** n8n Gmail node shows authentication error

**Solutions:**

**A. Re-generate app password:**

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Find "Certificate Generator n8n"
3. Click **"Remove"**
4. Generate new password
5. Update in n8n credentials

**B. Re-authorize OAuth2:**

1. In n8n, go to **Credentials**
2. Find your Gmail credential
3. Click **"Reconnect"**
4. Complete Google authorization flow
5. Test connection

**C. Check Gmail settings:**

1. Ensure IMAP is enabled: [Gmail Settings](https://mail.google.com/mail/u/0/#settings/fwdandpop)
2. Check for "Less secure app" warnings
3. Review recent security activity

### Issue 4: Certificate Image Not Displaying

**Symptom:** Email received but image doesn't show

**Cause:** Base64 image too large or improperly formatted

**Solutions:**

**A. Verify image format:**

```javascript
// Should start with:
data:image/png;base64,iVBORw0KGgo...

// Not:
iVBORw0KGgo... (missing data URL prefix)
```

**B. Check image size:**

```javascript
// In your app's download button component
const imageSize = certificateImage.length;
console.log("Image size:", (imageSize / 1024 / 1024).toFixed(2), "MB");

// Gmail limit: 25MB
// Recommended: < 2MB for fast loading
```

**C. Compress image before sending:**

```javascript
// In html2canvas options
await html2canvas(canvas, {
  scale: 2, // Reduce from 3 to 2
  quality: 0.8, // Add quality reduction
});
```

**D. Test with smaller image:**

1. Generate simple certificate (no complex graphics)
2. Try sending
3. If works, issue is image size

### Issue 5: Emails Sending Very Slowly

**Symptom:** Batch sends take too long

**Causes:**

1. n8n server location far from your location
2. Gmail rate limiting
3. Large image sizes
4. No rate limiting configured

**Solutions:**

**A. Add delay between sends (in n8n):**

1. Add **"Wait"** node after Gmail
2. Set wait time: `2 seconds`
3. This prevents Gmail spam detection

**B. Optimize images:**

```javascript
// Reduce image resolution
scale: 1.5; // instead of 2

// Compress more
quality: 0.7;
```

**C. Use queue chunking:**

```javascript
// In batch send, process 10 at a time
const CHUNK_SIZE = 10;
for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
  const chunk = ids.slice(i, i + CHUNK_SIZE);
  await sendChunk(chunk);
  await delay(5000); // 5s between chunks
}
```

### Issue 6: Workflow Executions Failing Randomly

**Symptom:** Some emails send, some fail unpredictably

**Cause:** Timeout or resource limits

**Solutions:**

**A. Increase n8n timeout:**

```bash
# For self-hosted Docker
docker run -d \
  --name n8n \
  -e EXECUTIONS_TIMEOUT=300 \
  -e EXECUTIONS_TIMEOUT_MAX=600 \
  ...other options...
  n8nio/n8n
```

**B. Add retry logic in n8n:**

1. Click Gmail node → Settings
2. Set **"Retry On Fail"**: `3 times`
3. Set **"Wait Between Retries"**: `5 seconds`

**C. Monitor n8n resources:**

```bash
# Check Docker stats
docker stats n8n

# Look for:
# - High memory usage (> 80%)
# - High CPU usage (> 90%)
# - If yes, upgrade server or n8n.cloud plan
```

---

## 🔐 Security Best Practices

### 1. Enable Webhook Authentication

**Why:** Prevent unauthorized access to your webhook

**How to implement:**

**In n8n (Webhook node):**

```yaml
Authentication: Basic Auth
User: certificate_sender
Password: <generate-strong-random-password>
```

**In your app's `.env.local`:**

```env
N8N_WEBHOOK_URL=https://certificate_sender:YOUR_STRONG_PASSWORD@your-n8n.app.n8n.cloud/webhook/send-certificate
```

**Generate strong password:**

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use online generator
# https://passwordsgenerator.net/
```

### 2. Use HTTPS Only

**For production, NEVER use HTTP webhooks:**

```env
# ❌ Bad - Insecure
N8N_WEBHOOK_URL=http://n8n.example.com/webhook/send

# ✅ Good - Secure
N8N_WEBHOOK_URL=https://n8n.example.com/webhook/send
```

**For self-hosted n8n with SSL:**

```bash
# Use Let's Encrypt for free SSL
certbot certonly --standalone -d n8n.yourdomain.com

# Configure n8n with SSL
docker run -d \
  --name n8n \
  -e N8N_PROTOCOL=https \
  -e N8N_HOST=n8n.yourdomain.com \
  -e N8N_SSL_KEY=/certs/privkey.pem \
  -e N8N_SSL_CERT=/certs/fullchain.pem \
  -v /etc/letsencrypt/live/n8n.yourdomain.com:/certs:ro \
  n8nio/n8n
```

### 3. Implement Rate Limiting

**Prevent abuse and spam:**

**Option A: In your app (recommended):**

```typescript
// src/app/api/batch-send/route.ts
const RATE_LIMIT = 50; // max 50 emails per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

let sendHistory: number[] = [];

export async function POST(request: NextRequest) {
  // Clean old entries
  const now = Date.now();
  sendHistory = sendHistory.filter((time) => now - time < RATE_WINDOW);

  // Check limit
  if (sendHistory.length >= RATE_LIMIT) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  // Add current send
  sendHistory.push(now);

  // Continue with sending...
}
```

**Option B: In n8n workflow:**

Add **"Rate Limit"** node or custom function:

```javascript
// In Function node before Gmail
const storage = $node["Rate Limit"].context;
const now = Date.now();
const window = 60 * 60 * 1000; // 1 hour
const limit = 100;

if (!storage.sends) storage.sends = [];

// Clean old
storage.sends = storage.sends.filter((t) => now - t < window);

// Check
if (storage.sends.length >= limit) {
  throw new Error("Rate limit exceeded");
}

storage.sends.push(now);
return items;
```

### 4. Sanitize Input Data

**Prevent injection attacks:**

```typescript
// src/app/api/email-queue/route.ts
import { sanitize } from "validator";

export async function POST(request: NextRequest) {
  const { recipientEmail, subject, message } = await request.json();

  // Validate email
  if (!isEmail(recipientEmail)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  // Sanitize HTML in message
  const cleanMessage = sanitize(message);

  // Limit subject length
  const cleanSubject = subject.slice(0, 200);

  // Continue...
}
```

### 5. Monitor and Log Access

**Track who's using the system:**

```typescript
// src/middleware/logging.ts
import { NextRequest } from "next/server";

export async function logEmailSend(
  email: string,
  status: "success" | "failed",
  userId?: string
) {
  const log = {
    timestamp: new Date().toISOString(),
    email,
    status,
    userId,
    ip: request.headers.get("x-forwarded-for") || "unknown",
  };

  // Save to database or file
  await db.logs.insert(log);

  // Alert on suspicious activity
  if (status === "failed") {
    await alertAdmin(log);
  }
}
```

### 6. Secure Your Environment Variables

**Never commit secrets to Git:**

```bash
# .gitignore (should already have this)
.env
.env.local
.env.*.local
```

**Use different variables per environment:**

```env
# .env.development
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/send-certificate

# .env.production (on server only)
N8N_WEBHOOK_URL=https://n8n.romegasolutions.com/webhook/send-certificate
N8N_WEBHOOK_USERNAME=prod_sender
N8N_WEBHOOK_PASSWORD=<strong-production-password>
```

### 7. Regularly Rotate Credentials

**Schedule credential rotation:**

1. **Monthly:** Rotate n8n webhook passwords
2. **Quarterly:** Regenerate Gmail app passwords
3. **Annually:** Review and update all API keys

```bash
# Create a reminder script
# rotate-credentials.sh
#!/bin/bash
echo "🔄 Time to rotate credentials!"
echo "1. Generate new Gmail app password"
echo "2. Update n8n webhook authentication"
echo "3. Update .env.production on server"
echo "4. Test email sending"
echo "5. Document changes"
```

### 8. Implement Audit Trail

**Track all email sends:**

```typescript
// src/lib/audit.ts
export async function auditEmailSend(data: {
  recipientEmail: string;
  recipientName: string;
  sentBy: string;
  status: "success" | "failed";
  errorMessage?: string;
}) {
  await db.audit_log.insert({
    ...data,
    timestamp: new Date(),
    ipAddress: getClientIP(),
    userAgent: getUserAgent(),
  });
}
```

---

## 📊 Advanced Configuration

### A. Email Templates with Dynamic Content

**Create reusable email templates:**

**1. In n8n, use template variables:**

```html
<!-- Store this in n8n Set node -->
<div style="font-family: Arial, sans-serif;">
  <header>
    <img
      src="https://yourcompany.com/logo.png"
      alt="Logo"
      style="width: 150px;"
    />
  </header>

  <h1>Congratulations, {{ $json.recipientName }}! 🎉</h1>

  <p>You have successfully completed <strong>{{ $json.title }}</strong></p>

  <div class="certificate-container">
    <img src="{{ $json.certificateImage }}" alt="Certificate" />
  </div>

  <footer>
    <p>Issued on: {{ $json.date }}</p>
    <p>Certificate ID: {{ $json.certificateId || 'N/A' }}</p>
  </footer>
</div>
```

**2. Add custom fields to your batch JSON:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "title": "Web Development",
  "certificateId": "CERT-2024-001",
  "instructor": "Jane Smith",
  "duration": "40 hours",
  "grade": "A+"
}
```

### B. Send Certificate as PDF Attachment

**Convert base64 image to PDF:**

**1. Add HTTP Request node before Gmail:**

```yaml
Method: POST
URL: https://api.cloudconvert.com/v2/convert
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
Body:
{
  "tasks": {
    "import": {
      "operation": "import/base64",
      "file": "{{ $json.certificateImage }}"
    },
    "convert": {
      "operation": "convert",
      "input": "import",
      "output_format": "pdf"
    },
    "export": {
      "operation": "export/url",
      "input": "convert"
    }
  }
}
```

**2. Or use Puppeteer in function node:**

```javascript
// Function node
const puppeteer = require("puppeteer");

async function convertToPDF(base64Image) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <body style="margin:0">
        <img src="${base64Image}" style="width:100%">
      </body>
    </html>
  `);

  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
  });

  await browser.close();
  return pdf.toString("base64");
}

const pdfBase64 = await convertToPDF($json.certificateImage);
return [{ json: { ...input.json, pdfAttachment: pdfBase64 } }];
```

### C. Email Open Tracking

**Track when recipients open emails:**

**1. Add tracking pixel to email:**

```html
<!-- In Gmail node message -->
<img
  src="https://your-tracking-service.com/track?id={{ $json.certificateId }}&email={{ $json.email }}"
  width="1"
  height="1"
  style="display:none;"
  alt=""
/>
```

**2. Create tracking endpoint (separate n8n workflow):**

```yaml
Webhook: /track
↓
Function: Extract params
↓
Database: Update opened_at timestamp
↓
Respond: 1x1 transparent pixel
```

### D. Scheduled Batch Sending

**Instead of manual sending, schedule automatic sends:**

**1. Replace Webhook trigger with Cron:**

```yaml
Cron: 0 9 * * * (Every day at 9 AM)
↓
Database Query: SELECT * FROM email_queue WHERE status='pending'
↓
Loop: For each pending email
  ↓
  Gmail: Send email
  ↓
  Database: Update status to 'sent'
```

**2. Or use Webhook + Queue system:**

```
Add to Queue (Webhook) → Store in DB
                          ↓
                    Cron Job (runs every 10 min)
                          ↓
                    Process pending emails
```

### E. Multiple Email Providers

**Add fallback email providers:**

```
Gmail Node
  ↓
IF: Success? → Continue
  ↓
IF: Failed? → Try SendGrid
  ↓
IF: SendGrid Failed? → Try Mailgun
  ↓
IF: All Failed? → Log error
```

**Implementation:**

```javascript
// Function node
const providers = ["gmail", "sendgrid", "mailgun"];
let sent = false;
let lastError;

for (const provider of providers) {
  try {
    await sendVia(provider, $json);
    sent = true;
    break;
  } catch (error) {
    lastError = error;
    continue;
  }
}

if (!sent) {
  throw new Error(`All providers failed. Last error: ${lastError}`);
}
```

### F. Bulk Email Optimization

**For large batches (100+ emails):**

**1. Use batch endpoints:**

```javascript
// Instead of 100 individual sends
// Send in batches of 10
const BATCH_SIZE = 10;

for (let i = 0; i < emails.length; i += BATCH_SIZE) {
  const batch = emails.slice(i, i + BATCH_SIZE);
  await sendBatch(batch);
  await sleep(2000); // 2s delay between batches
}
```

**2. Use dedicated email service:**

Consider switching from Gmail to:

- **SendGrid** (up to 40,000 emails/month free)
- **Mailgun** (5,000 emails/month free)
- **Amazon SES** (62,000 emails/month free first year)

**3. Implement queue worker:**

```
Main App → Add to Queue → Database
                            ↓
                    Background Worker
                    (runs continuously)
                            ↓
                    Process 1 email/second
                            ↓
                    Update status
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] **n8n workflow tested and working**
- [ ] **Gmail credentials secure (OAuth2 preferred)**
- [ ] **Webhook authentication enabled**
- [ ] **HTTPS configured for webhook URL**
- [ ] **Environment variables set in production**
- [ ] **Rate limiting implemented**
- [ ] **Error handling tested**
- [ ] **Monitoring/logging configured**
- [ ] **Backup workflow exported (JSON)**
- [ ] **Documentation updated**
- [ ] **Team trained on troubleshooting**

### Deployment Steps

**1. Production n8n Setup**

```bash
# For self-hosted
docker run -d \
  --name n8n-prod \
  --restart always \
  -p 443:443 \
  -e N8N_PROTOCOL=https \
  -e N8N_HOST=n8n.romegasolutions.com \
  -e N8N_PORT=443 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=<secure-password> \
  -e EXECUTIONS_DATA_SAVE_ON_SUCCESS=all \
  -e EXECUTIONS_DATA_SAVE_ON_ERROR=all \
  -v /etc/letsencrypt/live/n8n.romegasolutions.com:/certs:ro \
  -v /var/n8n-data:/home/node/.n8n \
  n8nio/n8n
```

**2. Configure Production Environment**

```env
# .env.production
N8N_WEBHOOK_URL=https://webhook_user:STRONG_PASSWORD@n8n.romegasolutions.com/webhook/send-certificate
NODE_ENV=production
ENABLE_EMAIL_LOGGING=true
ALERT_EMAIL=admin@romegasolutions.com
```

**3. Deploy Application**

```bash
# Build production bundle
pnpm run build

# Deploy to Vercel/Netlify/Custom Server
vercel --prod

# Or for custom server:
pm2 start npm --name "certificate-generator" -- start
```

**4. Set Environment Variables on Host**

**Vercel:**

```bash
vercel env add N8N_WEBHOOK_URL production
# Paste your webhook URL when prompted
```

**Custom Server:**

```bash
# Add to /etc/environment or systemd service file
echo 'N8N_WEBHOOK_URL=https://...' >> /etc/environment
```

**5. Test Production Flow**

```bash
# Send test email via production
curl -X POST https://your-app.com/api/batch-send \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "ids": [TEST_ID]
  }'
```

**6. Monitor First 24 Hours**

- Watch n8n execution logs
- Check error rates
- Monitor email delivery
- Review server resources
- Test backup/recovery

### Scaling Considerations

**For 1,000+ emails/day:**

1. **Upgrade Gmail to Google Workspace** (higher sending limits)
2. **Use dedicated email service** (SendGrid, Mailgun)
3. **Implement queue workers** (background processing)
4. **Add database indexes** on email_queue table
5. **Enable caching** for template data
6. **Monitor and optimize** n8n execution times

**For 10,000+ emails/day:**

1. **Switch to transactional email service** (SES, Postmark)
2. **Implement Redis queue** (Bull, BullMQ)
3. **Use CDN for images** (upload certificates to Cloudflare/S3)
4. **Add load balancing** for n8n instances
5. **Implement sharding** for database

---

## 📈 Monitoring & Analytics

### 1. n8n Execution Dashboard

**Track metrics:**

- Total executions (last 24h, 7d, 30d)
- Success rate (%)
- Average execution time
- Failed executions
- Error patterns

**Access:** n8n → Executions → Filter by workflow

### 2. Application Metrics

**Track in your app:**

```typescript
// src/lib/metrics.ts
export const emailMetrics = {
  totalSent: 0,
  totalFailed: 0,
  averageTime: 0,

  async log(status: "success" | "failed", duration: number) {
    if (status === "success") this.totalSent++;
    else this.totalFailed++;

    this.averageTime = (this.averageTime + duration) / 2;

    // Save to database
    await db.metrics.insert({
      status,
      duration,
      timestamp: new Date(),
    });
  },

  getStats() {
    return {
      total: this.totalSent + this.totalFailed,
      successRate: (this.totalSent / (this.totalSent + this.totalFailed)) * 100,
      avgTime: this.averageTime,
    };
  },
};
```

### 3. Gmail Sent Folder

**Verify delivery:**

- Check sent emails folder
- Look for bounce-backs
- Review spam reports
- Monitor delivery rates

### 4. Database Queries

**Analyze email queue:**

```sql
-- Overall stats
SELECT
  status,
  COUNT(*) as count,
  MIN(created_at) as first,
  MAX(created_at) as last
FROM email_queue
GROUP BY status;

-- Average send time
SELECT
  AVG(JULIANDAY(sent_at) - JULIANDAY(created_at)) * 24 * 60 as avg_minutes
FROM email_queue
WHERE status = 'sent';

-- Hourly distribution
SELECT
  strftime('%H', created_at) as hour,
  COUNT(*) as count
FROM email_queue
GROUP BY hour
ORDER BY hour;

-- Top recipients
SELECT
  recipient_email,
  COUNT(*) as count
FROM email_queue
GROUP BY recipient_email
ORDER BY count DESC
LIMIT 10;
```

### 5. Alerting

**Set up alerts for:**

- Failed execution rate > 10%
- Queue size > 100
- Average send time > 30 seconds
- Gmail quota warnings

**Implementation:**

```typescript
// In n8n or your app
if (failureRate > 0.1) {
  await sendAlert({
    to: "admin@romegasolutions.com",
    subject: "⚠️ High Email Failure Rate",
    message: `Current failure rate: ${failureRate * 100}%`,
  });
}
```

---

## 🆘 Support & Resources

### Getting Help

**If you encounter issues:**

1. **Check n8n execution logs** for detailed errors
2. **Review Gmail sent folder** for delivery confirmation
3. **Test webhook** with curl/Postman
4. **Check application logs** (`pnpm run dev` output)
5. **Verify environment variables** are set correctly

### Useful Links

- [n8n Documentation](https://docs.n8n.io/)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [n8n Community Forum](https://community.n8n.io/)
- [Webhook Testing Tool](https://webhook.site/)
- [Base64 Image Decoder](https://www.base64-image.de/)

### Contact

**Romega Solutions IT Support:**

- Email: it@romegasolutions.com
- Developer: kengarcia.romegasolutions@gmail.com

### Backup Your Workflow

**Export n8n workflow (IMPORTANT!):**

1. Open workflow in n8n
2. Click **"..."** (top right)
3. Select **"Download"**
4. Save JSON file securely
5. Commit to private Git repo (NOT public!)

---

## ✅ Quick Reference

### Environment Variables

```env
# Required
N8N_WEBHOOK_URL=https://your-n8n-url/webhook/send-certificate

# Optional (if using Basic Auth)
N8N_WEBHOOK_USERNAME=certificate_sender
N8N_WEBHOOK_PASSWORD=your-strong-password
```

### Testing Commands

```bash
# Test webhook connection
curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'

# Test email send
curl -X POST "https://your-app.com/api/batch-send" \
  -H "Content-Type: application/json" \
  -d '{"ids": [1]}'
```

### Common n8n Expressions

```javascript
// Get email from webhook
{
  {
    $json.email;
  }
}

// Format date
{
  {
    new Date().toISOString();
  }
}

// Conditional logic
{
  {
    $json.status === "sent" ? "Success" : "Failed";
  }
}

// Extract filename from name
{
  {
    $json.name.replace(/\s+/g, "-").toLowerCase();
  }
}
```

---

**🎉 You're all set! Your certificate email system is now fully automated with Gmail and n8n!**

**Next Steps:**

1. Complete the setup following this guide
2. Test with sample emails
3. Deploy to production
4. Monitor and optimize
5. Scale as needed

**Happy sending! 📧✨**

---

_Guide Version: 2.0_  
_Last Updated: November 2024_  
_Maintained by: Romega Solutions Development Team_
