# Google AdSense Setup Guide

## Current Status
- ✅ Publisher ID: `ca-pub-4519820641253525` (appears to be real)
- ❌ Ad Slot ID: `7848437873` (showing empty content - needs to be replaced)

## Steps to Get Real Ad Slot ID

### 1. Go to Google AdSense
- Visit: https://www.google.com/adsense/
- Sign in with your Google account

### 2. Create New Ad Unit
- Click "Ads" → "By ad unit"
- Click "Create new ad unit"
- Choose "Display ads"
- Select "Responsive" format
- Name: "TikTikTimer Homepage Banner"
- Size: Responsive (recommended)

### 3. Get Your Ad Unit ID
- After creating, you'll get an Ad unit ID like: `1234567890`
- Copy this ID

### 4. Update Your Code
Replace the dummy ID in `lib/adsense.ts`:

```typescript
AD_SLOTS: {
  BANNER: 'YOUR_REAL_AD_UNIT_ID_HERE', // Replace 7848437873
}
```

### 5. Test
- Deploy your changes
- Visit your live site
- The banner should now show real ads

## Important Notes
- AdSense approval can take 24-48 hours
- Make sure your site is live and accessible
- Ensure you have enough content on your homepage
- Follow Google's AdSense policies

## Troubleshooting
- Empty ads usually mean invalid ad unit ID
- Check browser console for AdSense errors
- Verify your site is approved for AdSense
