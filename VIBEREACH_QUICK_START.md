# VibeReach Lead Capture - Quick Start

## ✅ What's Been Implemented

### Backend API Route
- ✅ `/api/leads` - POST endpoint for lead capture
- ✅ `/api/leads` - GET endpoint for health check
- ✅ Duplicate contact handling
- ✅ Email validation
- ✅ Development mode simulation
- ✅ Error handling and logging

### Frontend Components
- ✅ `LeadCaptureForm` - Standalone form component
- ✅ `LeadMagnetSection` - Full landing page section with benefits
- ✅ Success states and error handling
- ✅ Loading states and animations
- ✅ Analytics tracking (GA4 & Facebook Pixel ready)

### Environment Variables
- ✅ Added to `.env.local`:
  - `VIBEREACH_API_KEY`
  - `VIBEREACH_LOCATION_ID`

---

## 🚀 Next Steps (IN ORDER)

### 1. Add Your VibeReach Credentials
Open `.env.local` and replace these values:
```env
VIBEREACH_API_KEY=your_actual_api_key_here
VIBEREACH_LOCATION_ID=your_actual_location_id_here
```

**Don't have these yet?** See `VIBEREACH_SETUP.md` for detailed instructions.

---

### 2. Test Locally
```bash
# Start dev server
npm run dev

# Test the health check
# Visit: http://localhost:3000/api/leads
# Should show: "configured": true

# Test the form
# Add the component to any page and submit a test lead
```

---

### 3. Set Up VibeReach Automation
1. Log in to VibeReach/GoHighLevel
2. Go to **Automations** → **Workflows**
3. Create workflow triggered by tag: `lead-magnet-prompts`
4. Add email action with PDF attachment
5. Activate workflow

**Detailed instructions:** See `VIBEREACH_SETUP.md` Step 4

---

### 4. Host Your PDF
Upload `Top_50_AI_Music_Prompts.pdf` to:
- VibeReach Media Library, OR
- Google Drive / Dropbox / AWS S3

Get the public URL and add to your email template.

---

### 5. Add Form to Your Landing Page

#### Option A: Full Section (Recommended)
```tsx
// app/page.tsx
import { LeadMagnetSection } from '@/components/marketing';

export default function HomePage() {
  return (
    <div>
      {/* Your existing content */}
      
      <LeadMagnetSection />
      
      {/* More content */}
    </div>
  );
}
```

#### Option B: Form Only
```tsx
// Any page
import { LeadCaptureForm } from '@/components/marketing';

export default function SomePage() {
  return (
    <div className="container mx-auto py-20">
      <LeadCaptureForm 
        source="Blog Post CTA"
      />
    </div>
  );
}
```

---

### 6. Deploy to Netlify
1. Add environment variables in Netlify Dashboard:
   - `VIBEREACH_API_KEY`
   - `VIBEREACH_LOCATION_ID`
2. Push to GitHub (triggers auto-deploy)
3. Test on production

---

### 7. Add .env.local Back to .gitignore
```bash
# After you've added your credentials, protect them:
git restore .gitignore
# This will restore the original .gitignore that excludes .env.local
```

---

## 📊 Component Props

### LeadCaptureForm
```tsx
<LeadCaptureForm 
  title="Custom Title"              // Optional
  description="Custom description"  // Optional
  buttonText="Custom Button"        // Optional
  successRedirect="/thank-you"      // Optional (default: /signup)
  source="Page Name"                // Optional (for tracking)
/>
```

---

## 🧪 Testing Checklist

- [ ] Health check shows `configured: true`
- [ ] Form submits successfully
- [ ] Contact appears in VibeReach
- [ ] Tags are correctly applied
- [ ] Email automation triggers
- [ ] PDF email is received
- [ ] Success state displays correctly
- [ ] Redirect to signup works

---

## 🔍 Troubleshooting

### "Server configuration error"
→ Check environment variables are set correctly

### "Failed to create contact"
→ Verify API key and Location ID in VibeReach

### Email not received
→ Check VibeReach workflow is activated

### Form not showing
→ Make sure you imported the component correctly

**More help:** See `VIBEREACH_SETUP.md` Troubleshooting section

---

## 📁 Files Created

```
app/api/leads/route.ts                    # Backend API
components/marketing/LeadCaptureForm.tsx  # Form component
components/marketing/LeadMagnetSection.tsx # Full section
components/marketing/index.ts             # Exports
VIBEREACH_SETUP.md                        # Detailed setup guide
VIBEREACH_QUICK_START.md                  # This file
```

---

## 🎉 You're Ready!

Once you complete steps 1-7, your lead capture system will be fully operational!

**Questions?** Check `VIBEREACH_SETUP.md` for detailed documentation.
