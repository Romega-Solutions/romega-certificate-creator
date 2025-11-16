# 🏫 UMak Preset Update - CCIS Student Council

## ✅ What Was Updated

### 1. **Email Message Content** - All 3 Components

Updated the UMak preset to properly mention **"CCIS Student Council - University of Makati"** instead of just "CCIS Student Council".

**Files Updated:**

- ✅ `src/components/certificate/email-dialog.tsx` (Single email dialog)
- ✅ `src/components/certificate/batch-generator.tsx` (Batch generation)
- ✅ `src/components/certificate/add-to-queue-dialog.tsx` (Add to queue)

**New Message Format:**

```
Dear [Name],

I hope this email finds you well. On behalf of the CCIS Student Council - University of Makati,
we are pleased to inform you that your e-certificate is now ready. We sincerely appreciate your
enthusiasm, time, and effort in the previously conducted event.

Thank you once again for your active participation. As a token of appreciation, attached here
is your e-certificate.

If you have any questions or concerns, please feel free to reply in this email thread.

Warm regards,
CCIS Student Council
University of Makati
```

### 2. **n8n Integration - Customizable Email Branding**

Updated API routes to send additional branding fields to n8n webhook (matching the n8n JavaScript code format):

**Files Updated:**

- ✅ `src/app/api/send-certificate/route.ts` (Direct send)
- ✅ `src/app/api/batch-send/route.ts` (Queue send)
- ✅ `src/components/certificate/email-dialog.tsx` (Frontend payload)

**New n8n Payload Fields for UMak Preset:**

```javascript
{
  recipient_email: "student@umak.edu.ph",
  recipient_name: "Student Name",
  certificate_image: "base64...",
  subject: "Your e-certificate is now ready",
  message: "...",

  // NEW: Customizable branding fields
  email_header_title: "🎓 Certificate of Achievement",
  email_header_subtitle: "CCIS Student Council - University of Makati",
  email_footer_company: "UNIVERSITY OF MAKATI",
  email_footer_dept: "College of Computing and Information Sciences - Student Council",
  email_sender_name: "CCIS Student Council Team",
  primary_color: "#1E3A8A",  // UMak blue
  secondary_color: "#3B82F6"
}
```

### 3. **Label Update**

Changed preset label from:

- ❌ "UMak Event (InfotechnOlympics Style)"

To:

- ✅ "UMak Event (CCIS Student Council)"

---

## 🔄 How It Works Now

### Single Email Flow

1. User clicks "Send via Email" button
2. Selects **UMak** preset
3. Frontend automatically adds branding fields to payload
4. API route sends to n8n webhook with all fields
5. n8n receives data and uses branding fields in HTML template

### Batch Email Flow

1. User uploads JSON with recipients
2. Selects recipients and chooses **UMak** preset
3. Adds to queue (PostgreSQL)
4. Clicks "Send Selected"
5. Batch API detects UMak subject and adds branding fields
6. n8n receives each item with branding

---

## 📧 n8n Workflow Configuration

Your n8n workflow should use these fields like this:

```javascript
// In your n8n Code node:
const {
  recipient_email,
  recipient_name,
  certificate_image,
  subject,
  message,

  // Customizable branding (with defaults)
  email_header_title = "🎓 Certificate of Achievement",
  email_header_subtitle = "Romega Solutions Professional Development",
  email_footer_company = "ROMEGA SOLUTIONS",
  email_footer_dept = "Professional Development & Training Department",
  email_sender_name = "Romega Solutions Team",
  primary_color = "#0D74CE",
  secondary_color = "#1E88E5",
} = data;
```

**For UMak emails**, these fields will be **automatically populated** with:

- Header: "🎓 Certificate of Achievement" + "CCIS Student Council - University of Makati"
- Footer: "UNIVERSITY OF MAKATI" + "College of Computing and Information Sciences - Student Council"
- Sender: "CCIS Student Council Team"
- Colors: UMak blue (#1E3A8A) and light blue (#3B82F6)

**For other presets** (Event, KPI, Internship), the default Romega Solutions branding is used.

---

## ✅ Testing Checklist

### Test 1: Single Email with UMak Preset

- [ ] Open Generator page
- [ ] Create a certificate
- [ ] Click "Send via Email"
- [ ] Click **UMak** preset button
- [ ] Verify subject: "Your e-certificate is now ready"
- [ ] Verify message mentions "CCIS Student Council - University of Makati"
- [ ] Enter test email
- [ ] Send and check inbox
- [ ] ✅ Email should have UMak branding (blue colors, UMak header/footer)

### Test 2: Batch with UMak Preset

- [ ] Switch to "Batch Generation" tab
- [ ] Upload JSON with test recipients
- [ ] Click **UMak** preset
- [ ] Verify subject and message populated correctly
- [ ] Click "Add Selected to Queue"
- [ ] Go to Email Queue page
- [ ] Select queued items
- [ ] Click "Send Selected"
- [ ] Check emails
- [ ] ✅ All should have UMak branding

### Test 3: Verify n8n Receives Correct Data

- [ ] Send UMak email
- [ ] Check n8n execution logs
- [ ] ✅ Verify these fields are present:
  - `email_header_title`
  - `email_header_subtitle`
  - `email_footer_company`
  - `email_footer_dept`
  - `email_sender_name`
  - `primary_color`
  - `secondary_color`

---

## 🎨 UMak Color Scheme

The UMak preset uses official University of Makati colors:

- **Primary**: `#1E3A8A` (Deep blue)
- **Secondary**: `#3B82F6` (Light blue)
- **Header gradient**: Deep blue → Light blue
- **Footer**: Dark slate

---

## 📝 Sample JSON for Batch Testing

```json
{
  "recipients": [
    {
      "name": "Juan Dela Cruz",
      "email": "juan.delacruz@umak.edu.ph",
      "title": "Graphic Design Coordinator, UMak CAS"
    },
    {
      "name": "Maria Santos",
      "email": "maria.santos@umak.edu.ph",
      "title": "Event Head, CCIS Student Council"
    }
  ]
}
```

---

## 🚀 Next Steps

1. **Test the updated UMak preset** with your n8n workflow
2. **Verify the HTML email** renders correctly with UMak branding
3. **Check that n8n receives all branding fields** in webhook payload
4. **Confirm legal disclaimer** appears at bottom of email

---

## 🔍 Troubleshooting

### Issue: Email doesn't have UMak branding

**Solution:** Check n8n Code node uses the new fields (email_header_title, etc.)

### Issue: Colors are wrong

**Solution:** Verify primary_color and secondary_color are being used in HTML template

### Issue: Footer says "Romega Solutions" instead of "University of Makati"

**Solution:** Make sure n8n uses `email_footer_company` variable in HTML

---

## 📌 Summary

✅ All UMak presets now mention "CCIS Student Council - University of Makati"  
✅ All API routes send customizable branding fields to n8n  
✅ n8n can use these fields to generate branded HTML emails  
✅ UMak emails will have official UMak colors and branding  
✅ Other presets still use default Romega Solutions branding

**Everything is ready for testing!** 🎉
