# 🚀 QUICK REFERENCE - Email Presets & n8n Integration

## ⚡ TL;DR - What Changed

1. ✅ **n8n webhook** configured: `https://n8n.kenbuilds.tech/webhook/certificate-email-api`
2. ✅ **4 email presets** now available everywhere (including new **UMak** preset)
3. ✅ All API routes use **PostgreSQL** + **n8n webhook**
4. ✅ Email Queue has **auto-refresh** every 5 seconds
5. ✅ **Complete documentation** in `docs/` folder

---

## 📧 Email Presets Quick Reference

### 1. EVENT 📅

**Use**: Workshops, seminars, webinars  
**Subject**: Certificate of Attendance  
**Tone**: Professional, appreciative

### 2. KPI 🏆

**Use**: Performance awards, achievements  
**Subject**: KPI Achievement Certificate  
**Tone**: Congratulatory

### 3. INTERNSHIP 🎓

**Use**: OJT, practicum, internships  
**Subject**: Certificate of Completion - Internship  
**Tone**: Career-focused

### 4. UMAK 🏫 ⭐ NEW!

**Use**: University events, academic competitions  
**Subject**: Your e-certificate is now ready  
**Tone**: Formal academic with legal disclaimer  
**Special**: Based on UMak CCIS InfotechnOlympics format

---

## 🎯 Where to Find Presets

| Location            | Button Text                   | When to Use            |
| ------------------- | ----------------------------- | ---------------------- |
| Batch Generator     | "Queue Selected Certificates" | Multiple recipients    |
| Send Email Dialog   | "Send via Email"              | Single, instant send   |
| Add to Queue Dialog | "Add to Queue"                | Single, save for later |

**All 3 have the same 4 presets!**

---

## 🔧 Environment Variables

```env
# .env.local
DATABASE_URL=postgresql://cert_admin:certificate123@66.181.46.58:5432/certificate_queue
N8N_WEBHOOK_URL=https://n8n.kenbuilds.tech/webhook/certificate-email-api
```

---

## 🔄 Placeholder Syntax

| Placeholder | Replaced With                           |
| ----------- | --------------------------------------- |
| `{{name}}`  | Recipient's name                        |
| `{{email}}` | Recipient's email                       |
| `{{title}}` | Certificate title or organizer position |
| `{{date}}`  | Current date                            |

**Example**:

```
Input JSON:
{
  "name": "Juan Dela Cruz",
  "title": "Android App Category Head"
}

Template:
"Dear {{name}}, Warm regards, {{title}}"

Output:
"Dear Juan Dela Cruz, Warm regards, Android App Category Head"
```

---

## 🧪 Quick Test

```bash
# 1. Start server
pnpm run dev

# 2. Go to http://localhost:3000/generator

# 3. Click "Send via Email"

# 4. Click "UMak" preset

# 5. Enter your email and send

# 6. Check inbox ✅
```

---

## 📊 API Endpoints

| Endpoint                | Method | Purpose             |
| ----------------------- | ------ | ------------------- |
| `/api/send-certificate` | POST   | Direct send via n8n |
| `/api/email-queue`      | GET    | Get queued items    |
| `/api/email-queue`      | POST   | Add to queue        |
| `/api/email-queue`      | PATCH  | Update status       |
| `/api/batch-send`       | POST   | Send multiple       |
| `/api/update-status`    | POST   | n8n callback        |

---

## 🎓 UMak Preset in Action

**Perfect for**:

- InfotechnOlympics (all categories)
- CCIS Student Council events
- Academic competitions
- University activities

**Signature Format**:

```
Warm regards,
{{title}}

[Legal disclaimer...]
```

**Example Title Values**:

- "Android Application Category Head, InfotechOlympics 2025"
- "Web Development Category Head, CCIS Student Council"
- "Graphic Design Coordinator, UMak CAS"

---

## 🐛 Troubleshooting One-Liners

| Problem                          | Solution                                  |
| -------------------------------- | ----------------------------------------- |
| "N8N_WEBHOOK_URL not configured" | Add to `.env.local`, restart server       |
| Preset button missing            | Hard reload: `Ctrl+Shift+R`               |
| Email not sending                | Check n8n workflow is active              |
| Status not updating              | Verify n8n can reach `/api/update-status` |
| PostgreSQL error                 | Check DATABASE_URL, verify server running |

---

## 📚 Full Documentation

1. **UPDATE-SUMMARY.md** - What changed, how to test
2. **n8n-setup.md** - Complete n8n workflow guide
3. **email-presets-guide.md** - All 4 presets detailed
4. **testing-checklist.md** - 10 test scenarios
5. **system-flow-diagram.md** - Visual architecture

All in `docs/` folder!

---

## ✅ Test Checklist (Ultra Quick)

- [ ] UMak preset loads correctly
- [ ] Email sends via n8n
- [ ] Status updates in Email Queue
- [ ] Auto-refresh works (5s)
- [ ] Batch generation works
- [ ] Placeholders replace correctly

---

## 🎉 You're Ready!

Everything is configured. Just start testing with the UMak preset!

**First Test**: Send yourself a certificate with UMak preset and see the professional formatting in your inbox.

Need detailed help? Check `docs/UPDATE-SUMMARY.md`

Happy certificate sending! 📧🎓
