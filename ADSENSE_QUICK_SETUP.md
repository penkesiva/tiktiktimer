# 🚀 Quick AdSense Setup for TikTok Timer

## ✅ **Publisher ID Updated**
Your publisher ID `ca-pub-4519820641253525` has been added to the configuration.

## 🔧 **Next Steps: Get Ad Slot IDs**

### **1. Go to AdSense Dashboard**
- Visit [Google AdSense](https://www.google.com/adsense)
- Sign in with your Google account

### **2. Create Ad Units**
Navigate to **Ads** > **By ad unit** > **Create new ad unit**

#### **Create These Ad Units:**

| Ad Unit Name | Size | Purpose | Get Slot ID |
|--------------|------|---------|-------------|
| `Banner Ad` | 728x90 | Homepage top/bottom | Copy slot ID |
| `Rectangle Ad` | 300x250 | Sidebar | Copy slot ID |
| `Workout Top Ad` | 728x90 | Workout page top | Copy slot ID |
| `Workout Bottom Ad` | 728x90 | Workout page bottom | Copy slot ID |
| `Meditation Top Ad` | 728x90 | Meditation page top | Copy slot ID |
| `Meditation Bottom Ad` | 728x90 | Meditation page bottom | Copy slot ID |

### **3. Get Slot IDs**
For each ad unit:
1. Click on the ad unit name
2. Look for **Ad unit code** section
3. Find the `data-ad-slot` value (e.g., `1234567890`)
4. Copy this number

### **4. Update Configuration**
Once you have all slot IDs, update `lib/adsense.ts`:

```typescript
AD_SLOTS: {
  BANNER: 'YOUR_BANNER_SLOT_ID',
  SIDEBAR: 'YOUR_SIDEBAR_SLOT_ID',
  INCONTENT: 'YOUR_INCONTENT_SLOT_ID',
  FOOTER: 'YOUR_FOOTER_SLOT_ID',
  WORKOUT_TOP: 'YOUR_WORKOUT_TOP_SLOT_ID',
  WORKOUT_BOTTOM: 'YOUR_WORKOUT_BOTTOM_SLOT_ID',
  MEDITATION_TOP: 'YOUR_MEDITATION_TOP_SLOT_ID',
  MEDITATION_BOTTOM: 'YOUR_MEDITATION_BOTTOM_SLOT_ID',
},
```

### **5. Test Your Ads**
After updating slot IDs:
1. Deploy to Vercel
2. Visit your live site
3. Check if ads appear (may take 24-48 hours)

## 🎯 **Current Status**
- ✅ Publisher ID configured
- ⏳ Waiting for ad slot IDs
- ⏳ Ready to deploy once IDs are added

## 💡 **Pro Tips**
- **Ad Approval**: New ad units may take 24-48 hours to start showing
- **Domain Verification**: Make sure `tiktiktimer.com` is verified in AdSense
- **Content Policy**: Ensure your app follows AdSense content guidelines
- **Mobile Optimization**: Your ads are already mobile-responsive

## 🚀 **Ready to Monetize!**
Once you add the slot IDs, your TikTok Timer app will be fully monetized with professional, unobtrusive ads that enhance rather than detract from the user experience.
