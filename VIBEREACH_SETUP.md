# VibeReach Lead Capture Setup Guide

## 🎯 Overview
This guide walks you through setting up the VibeReach (GoHighLevel) lead capture integration for AI Music Studio.

---

## 📋 Prerequisites

1. **VibeReach/GoHighLevel Account** - You need access to a VibeReach or GoHighLevel account
2. **API Access** - Ensure your account has API access enabled
3. **Location ID** - You need to know your Location ID

---

## 🔑 Step 1: Get Your API Key

### Option A: VibeReach Dashboard
1. Log in to your VibeReach dashboard
2. Go to **Settings** → **API Keys** (or **Integrations**)
3. Click **Create New API Key** or **Generate API Key**
4. Give it a name: `AI Music Studio Lead Capture`
5. Set permissions: **Contacts** (Read & Write)
6. Copy the API key (starts with something like `eyJ...`)

### Option B: GoHighLevel Dashboard
1. Log in to GoHighLevel
2. Go to **Settings** → **Company** → **API Keys**
3. Click **Create API Key**
4. Name: `AI Music Studio`
5. Scopes: Select **contacts.write** and **contacts.readonly**
6. Copy the generated key

**⚠️ Important:** Save this key immediately - you won't be able to see it again!

---

## 🏢 Step 2: Get Your Location ID

### Method 1: From URL
1. Log in to your VibeReach/GHL dashboard
2. Look at the URL in your browser
3. You'll see something like: `https://app.gohighlevel.com/location/XXXXXXXXXX/dashboard`
4. The `XXXXXXXXXX` part is your Location ID

### Method 2: From API
1. Use this API call with your API key:
```bash
curl -X GET "https://services.leadconnectorhq.com/locations/" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Version: 2021-07-28"
```
2. Look for your location in the response and copy the `id` field

### Method 3: From Settings
1. Go to **Settings** → **Business Profile**
2. Look for **Location ID** or **Agency Location ID**
3. Copy the ID

---

## 🔧 Step 3: Configure Environment Variables

1. Open your `.env.local` file
2. Find the VibeReach section (should be at the bottom)
3. Replace the placeholder values:

```env
# -----------------------------------------------------------------------------
# VibeReach (GoHighLevel) Lead Capture Integration
# -----------------------------------------------------------------------------
VIBEREACH_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Your actual API key
VIBEREACH_LOCATION_ID=abc123xyz789  # Your actual Location ID
```

4. Save the file

---

## 📧 Step 4: Set Up Email Automation in VibeReach

### Create the Workflow

1. **Go to Automations**
   - Navigate to **Automations** → **Workflows**
   - Click **Create Workflow**

2. **Set Up Trigger**
   - Trigger Type: **Tag Added**
   - Tag: `lead-magnet-prompts`
   - Name: "AI Music Studio - Lead Magnet Delivery"

3. **Add Email Action**
   - Add Action: **Send Email**
   - Email Template: Create new or use existing
   - Subject: "🎵 Your Top 50 AI Music Prompts Are Here!"

4. **Email Content Template**
```html
Hi {{contact.first_name}},

Thanks for your interest in AI Music Studio! 🎉

As promised, here's your exclusive guide: **Top 50 AI Music Prompts**

👉 [Download Your PDF Here](YOUR_PDF_LINK)

This guide includes:
✅ 50 proven prompts for different music genres
✅ Tips for getting the best results
✅ Examples of successful AI-generated tracks

Ready to create your first AI song? Start your free trial:
👉 [Start Free Trial](https://aimusicstudio.art/signup)

Questions? Just reply to this email!

Best,
The AI Music Studio Team

---
P.S. Don't forget to check out our pricing plans for unlimited generations!
```

5. **Add Follow-Up Sequence (Optional)**
   - Wait 1 day → Send tips email
   - Wait 3 days → Send case studies
   - Wait 7 days → Send upgrade offer

6. **Activate Workflow**
   - Review all steps
   - Click **Activate**

---

## 📎 Step 5: Host Your PDF

### Option A: Use VibeReach/GHL File Storage
1. Go to **Marketing** → **Media Library**
2. Upload your PDF: `Top_50_AI_Music_Prompts.pdf`
3. Copy the public URL
4. Use this URL in your email template

### Option B: Use External Storage
1. Upload to Google Drive, Dropbox, or AWS S3
2. Make sure the file is publicly accessible
3. Copy the direct download link
4. Use this URL in your email template

**Recommended Filename:** `AI_Music_Studio_Top_50_Prompts.pdf`

---

## 🧪 Step 6: Test the Integration

### Test 1: Check API Connection
```bash
# Visit this URL in your browser (after starting your dev server)
http://localhost:3000/api/leads

# You should see:
{
  "status": "ok",
  "configured": true,
  "environment": "development",
  "message": "VibeReach integration is configured"
}
```

### Test 2: Submit Test Lead
1. Start your development server: `npm run dev`
2. Navigate to the page with the lead form
3. Fill in test data:
   - First Name: `Test`
   - Email: `test@example.com` (use your own email for testing)
4. Click "Send Me The Prompts"
5. Check for success message

### Test 3: Verify in VibeReach
1. Go to **Contacts** in VibeReach
2. Search for your test email
3. Verify the contact has:
   - ✅ Correct name and email
   - ✅ Tags: `ai-music-studio-lead`, `lead-magnet-prompts`
   - ✅ Source: `Landing Page Form`

### Test 4: Check Email Delivery
1. Wait 1-2 minutes
2. Check your email inbox
3. Verify you received the PDF email
4. Test the PDF download link

---

## 🚀 Step 7: Deploy to Production

### Update Netlify Environment Variables
1. Go to Netlify Dashboard
2. Select your site: **AI Music Studio**
3. Go to **Site Settings** → **Environment Variables**
4. Add these variables:
   ```
   VIBEREACH_API_KEY = your_actual_api_key
   VIBEREACH_LOCATION_ID = your_actual_location_id
   ```
5. Click **Save**
6. Trigger a new deployment

### Test Production
1. Visit your live site: `https://aimusicstudio.art`
2. Submit a test lead with a real email
3. Verify everything works end-to-end

---

## 🎨 Step 8: Add Form to Landing Page

### Example Usage

```tsx
// app/page.tsx or wherever you want the form
import { LeadCaptureForm } from '@/components/marketing';

export default function HomePage() {
  return (
    <div>
      {/* Your hero section */}
      
      {/* Lead Magnet Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <LeadCaptureForm 
            title="Get the Top 50 AI Music Prompts"
            description="Enter your details to get our exclusive PDF guide"
            buttonText="Send Me The Prompts"
            successRedirect="/signup"
            source="Homepage Hero"
          />
        </div>
      </section>
      
      {/* Rest of your page */}
    </div>
  );
}
```

### Customization Options

```tsx
<LeadCaptureForm 
  title="Custom Title"              // Form heading
  description="Custom description"  // Form subheading
  buttonText="Custom Button"        // Submit button text
  successRedirect="/thank-you"      // Where to redirect after success
  source="Blog Post CTA"            // For tracking in VibeReach
/>
```

---

## 📊 Analytics & Tracking

The form automatically tracks these events:

### Google Analytics 4
- `lead_form_submit_attempt` - When user clicks submit
- `lead_captured` - When lead is successfully captured
- `lead_form_error` - When an error occurs
- `lead_redirect_to_signup` - When user is redirected

### Facebook Pixel
- Same events as GA4
- Useful for retargeting campaigns

### To Enable Analytics
Add these scripts to your `app/layout.tsx`:

```tsx
// Google Analytics
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>

// Facebook Pixel
<Script id="facebook-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  `}
</Script>
```

---

## 🔍 Troubleshooting

### Issue: "Server configuration error"
**Solution:** Check that both `VIBEREACH_API_KEY` and `VIBEREACH_LOCATION_ID` are set in your environment variables.

### Issue: "Failed to create contact in VibeReach"
**Possible causes:**
1. Invalid API key - regenerate in VibeReach
2. Wrong Location ID - verify in VibeReach settings
3. API permissions - ensure contacts.write is enabled
4. Rate limiting - wait a few minutes and try again

### Issue: Email not received
**Check:**
1. Workflow is activated in VibeReach
2. Tag `lead-magnet-prompts` is correctly set
3. Email template is published
4. Check spam folder
5. Verify email address in VibeReach contact

### Issue: Duplicate contact warning
**This is normal!** The system handles duplicates gracefully. If someone submits the form twice, it updates their existing contact instead of creating a duplicate.

---

## 📈 Best Practices

### 1. **Segment Your Leads**
Use different `source` values for different pages:
```tsx
<LeadCaptureForm source="Blog Post - How to Generate Music" />
<LeadCaptureForm source="Pricing Page CTA" />
<LeadCaptureForm source="Exit Intent Popup" />
```

### 2. **A/B Test Your Copy**
Try different titles and descriptions to see what converts better.

### 3. **Follow Up Quickly**
Set up your automation to send the PDF within 1-2 minutes of signup.

### 4. **Add Value in Follow-Ups**
Don't just sell - provide tips, tutorials, and success stories.

### 5. **Monitor Your Metrics**
Track in VibeReach:
- Conversion rate
- Email open rate
- Click-through rate
- Trial signup rate

---

## 🎉 You're All Set!

Your lead capture system is now fully configured and ready to convert visitors into leads!

**Next Steps:**
1. ✅ Test everything thoroughly
2. ✅ Create compelling PDF content
3. ✅ Set up follow-up email sequence
4. ✅ Add form to your landing page
5. ✅ Monitor and optimize conversion rates

**Need Help?** Check the VibeReach documentation or contact their support team.

---

## 📚 Additional Resources

- [GoHighLevel API Documentation](https://highlevel.stoplight.io/docs/integrations/)
- [VibeReach Support](https://vibereach.com/support)
- [Lead Magnet Best Practices](https://www.hubspot.com/lead-magnets)

---

**Last Updated:** May 18, 2026
**Version:** 1.0
