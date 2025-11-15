# 📧 Email Preset Reference Guide

## Available Email Presets

All certificate sending dialogs now include **4 professional email presets** to save you time.

---

## 1️⃣ **Event Preset**

**Best for**: General event attendance, workshops, seminars, conferences

**Subject**:

```
Certificate of Attendance
```

**Message Template**:

```
Dear {{name}},

Thank you for attending our event. Please find your Certificate of
Attendance attached. We appreciate your participation!

Best regards,
Romega Solutions
```

**Example Use Cases**:

- Workshop completion
- Webinar attendance
- Conference participation
- Training sessions

---

## 2️⃣ **KPI Preset**

**Best for**: Performance recognition, achievement awards, goal completion

**Subject**:

```
KPI Achievement Certificate
```

**Message Template**:

```
Dear {{name}},

Congratulations on achieving your KPI milestones. Please find your
KPI Achievement Certificate attached as recognition of your performance.

Best regards,
Romega Solutions
```

**Example Use Cases**:

- Sales targets met
- Performance milestones
- Team achievements
- Monthly/quarterly awards

---

## 3️⃣ **Internship Preset**

**Best for**: Internship programs, OJT completion, work experience

**Subject**:

```
Certificate of Completion - Internship
```

**Message Template**:

```
Dear {{name}},

Congratulations on completing your internship. Please find your
Certificate of Completion attached. Wishing you continued success
in your career.

Best regards,
Romega Solutions
```

**Example Use Cases**:

- Internship completion
- OJT programs
- Work immersion
- Practicum completion

---

## 4️⃣ **UMak Preset** 🆕

**Best for**: Academic institutions, university events, student council activities

**Subject**:

```
Your e-certificate is now ready
```

**Message Template**:

```
Dear {{name}},

I hope this email finds you well. On behalf of the CCIS Student Council,
we are pleased to inform you that your e-certificate is now ready. We
sincerely appreciate your enthusiasm, time, and effort in the previously
conducted event.

Thank you once again for your active participation. As a token of
appreciation, attached here is your e-certificate.

If you have any questions or concerns, please feel free to reply in
this email thread.

Warm regards,
{{title}}

This message contains confidential information and is intended only for
the individual named. If you are not the named addressee you should not
disseminate, distribute or copy this e-mail. Please notify the sender
immediately by e-mail if you have received this e-mail by mistake and
delete this e-mail from your system. E-mail transmission cannot be
guaranteed to be secure or error-free as information could be intercepted,
corrupted, lost, destroyed, arrive late or incomplete, or contain viruses.
The sender therefore does not accept liability for any errors or omissions
in the contents of this message, which arise as a result of e-mail
transmission.
```

**Example Use Cases**:

- InfotechnOlympics competitions
- Academic competitions
- Student council events
- University-sponsored activities
- Department events (CCIS, CAS, etc.)

**Special Notes**:

- Professional academic tone
- Includes legal disclaimer
- Uses `{{title}}` placeholder for organizer's position
- Follows university email standards
- Based on actual UMak/CCIS email format

---

## 🔧 Placeholder Support

All presets support dynamic placeholders that get replaced automatically:

| Placeholder | Replaced With                 | Example                             |
| ----------- | ----------------------------- | ----------------------------------- |
| `{{name}}`  | Recipient's full name         | "John Doe"                          |
| `{{email}}` | Recipient's email address     | "john@example.com"                  |
| `{{title}}` | Certificate title or position | "Android Application Category Head" |
| `{{date}}`  | Current date                  | "November 16, 2024"                 |

### Example with Placeholders:

**Input**:

```json
{
  "name": "Maria Santos",
  "email": "maria.santos@umak.edu.ph",
  "title": "Web Development Category Head, InfotechnOlympics 2025"
}
```

**Output** (UMak preset):

```
Dear Maria Santos,

I hope this email finds you well...

Warm regards,
Web Development Category Head, InfotechnOlympics 2025
```

---

## 📍 Where to Find Presets

### 1. **Batch Generator** (`/generator` page)

- Click "Queue Selected Certificates"
- Dialog appears with preset buttons
- Choose preset → Auto-fills subject & message
- Supports placeholders for all recipients

### 2. **Send Email Dialog** (Single certificate)

- Click "Send via Email" button
- Choose from 4 preset buttons
- Instantly fills email content

### 3. **Add to Queue Dialog** (Single certificate)

- Click "Add to Queue" button
- Choose from 4 preset buttons
- Save for sending later

---

## ✏️ Customization Tips

### After Selecting a Preset:

1. **Edit the subject** - Make it more specific to your event

   ```
   Before: "Certificate of Attendance"
   After:  "Certificate of Attendance - Web Dev Workshop 2024"
   ```

2. **Personalize the message** - Add event details

   ```
   Dear {{name}},

   Thank you for attending our Web Development Workshop on November 16, 2024.
   Your participation and engagement made the event a success!

   [Rest of preset message...]
   ```

3. **Adjust placeholders** - Use `{{title}}` creatively
   ```
   Warm regards,
   {{title}}
   Web Development Team
   Romega Solutions
   ```

---

## 🎯 Preset Selection Guide

| Your Scenario                 | Recommended Preset |
| ----------------------------- | ------------------ |
| Corporate training workshop   | **Event**          |
| Employee performance award    | **KPI**            |
| Student OJT completion        | **Internship**     |
| University competition (UMak) | **UMak**           |
| Generic event                 | **Event**          |
| Academic achievement          | **UMak**           |
| Business seminar              | **Event**          |
| Coding bootcamp               | **Internship**     |

---

## 💡 Pro Tips

1. **For Academic Events**: Use UMak preset and replace "CCIS Student Council" with your department
2. **For Batch Emails**: Presets work perfectly with batch generation - placeholders auto-replace
3. **Test First**: Send yourself a test email to see how it looks
4. **Consistent Branding**: Stick to one preset per event type for consistency
5. **Save Custom Templates**: If you modify a preset, save it as a note for future events

---

## 🆕 Adding Your Own Presets

Want to add custom presets for your organization? Contact your developer to add them to:

- `src/components/certificate/batch-generator.tsx`
- `src/components/certificate/email-dialog.tsx`
- `src/components/certificate/add-to-queue-dialog.tsx`

---

## 📞 Support

Having trouble with presets? Check:

- Are placeholders in the right format? (`{{name}}` not `{name}`)
- Did you select recipients before choosing a preset?
- Is the email queue page showing your queued items?

Need help? The presets are ready to use - just click and send! 🚀
