# Google AdSense Setup Guide

## 🎯 Overview

This guide will help you set up Google AdSense in your timer app to monetize your application.

## 📋 Prerequisites

1. **Google AdSense Account**: You need an approved Google AdSense account
2. **Publisher ID**: Your unique AdSense publisher ID (starts with `ca-pub-`)
3. **Ad Units**: Create ad units in your AdSense dashboard
4. **Domain Verification**: Your domain must be verified with AdSense

## 🔧 Setup Steps

### 1. Get Your AdSense Publisher ID

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign in with your Google account
3. Navigate to **Settings** > **Account Information**
4. Copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### 2. Create Ad Units

1. In AdSense dashboard, go to **Ads** > **By ad unit**
2. Click **Create new ad unit**
3. Create the following ad units:

#### Banner Ads
- **Name**: `Banner Ad`
- **Size**: `728x90` (Leaderboard)
- **Type**: `Display ads`
- **Copy the Ad unit code**

#### Rectangle Ads
- **Name**: `Rectangle Ad`
- **Size**: `300x250` (Medium Rectangle)
- **Type**: `Display ads`
- **Copy the Ad unit code**

#### Workout Timer Ads
- **Name**: `Workout Top Ad`
- **Size**: `728x90` (Leaderboard)
- **Type**: `Display ads`
- **Copy the Ad unit code**

- **Name**: `Workout Bottom Ad`
- **Size**: `728x90` (Leaderboard)
- **Type**: `Display ads`
- **Copy the Ad unit code**

#### Meditation Timer Ads
- **Name**: `Meditation Top Ad`
- **Size**: `728x90` (Leaderboard)
- **Type**: `Display ads`
- **Copy the Ad unit code`

- **Name**: `Meditation Bottom Ad`
- **Size**: `728x90` (Leaderboard)
- **Type**: `Display ads`
- **Copy the Ad unit code**

### 3. Update Configuration

1. Open `lib/adsense.ts`
2. Replace the placeholder values:

```typescript
export const ADSENSE_CONFIG = {
  // Replace with your actual Google AdSense publisher ID
  PUBLISHER_ID: 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID',
  
  // Replace with your actual ad slot IDs
  AD_SLOTS: {
    BANNER: 'YOUR_ACTUAL_BANNER_AD_SLOT',
    SIDEBAR: 'YOUR_ACTUAL_SIDEBAR_AD_SLOT',
    INCONTENT: 'YOUR_ACTUAL_INCONTENT_AD_SLOT',
    FOOTER: 'YOUR_ACTUAL_FOOTER_AD_SLOT',
    WORKOUT_TOP: 'YOUR_ACTUAL_WORKOUT_TOP_AD_SLOT',
    WORKOUT_BOTTOM: 'YOUR_ACTUAL_WORKOUT_BOTTOM_AD_SLOT',
    MEDITATION_TOP: 'YOUR_ACTUAL_MEDITATION_TOP_AD_SLOT',
    MEDITATION_BOTTOM: 'YOUR_ACTUAL_MEDITATION_BOTTOM_AD_SLOT',
  },
  // ... rest of config
}
```

### 4. Update AdSense Component

1. Open `components/ads/GoogleAdsense.tsx`
2. Replace the placeholder publisher ID:

```typescript
script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.PUBLISHER_ID}`
```

### 5. Test Your Implementation

1. **Development Testing**:
   - Ads are disabled in development mode by default
   - To test, temporarily change `shouldShowAds()` in `lib/adsense.ts`:

```typescript
export function shouldShowAds(): boolean {
  // Temporarily enable ads for testing
  return true
}
```

2. **Production Testing**:
   - Deploy to production
   - Check browser console for any errors
   - Verify ads are loading correctly

## 🎨 Ad Placement Strategy

### Home Page
- **Top Banner**: Above the main content
- **Bottom Banner**: Below the main content
- **Purpose**: General monetization

### Workout Timer
- **Top Ad**: Above workout presets
- **Bottom Ad**: Below timer controls
- **Purpose**: Contextual fitness-related ads

### Meditation Timer
- **Top Ad**: Above meditation settings
- **Bottom Ad**: Below timer controls
- **Purpose**: Contextual wellness-related ads

## 🔒 Privacy & Compliance

### GDPR Compliance
1. **Cookie Consent**: Implement cookie consent banner
2. **Privacy Policy**: Update privacy policy to mention AdSense
3. **User Consent**: Get user consent before showing ads

### CCPA Compliance
1. **Privacy Notice**: Include CCPA privacy notice
2. **Opt-out Mechanism**: Provide opt-out option
3. **Data Disclosure**: Disclose data collection practices

## 📊 Monitoring & Optimization

### AdSense Dashboard
1. **Performance**: Monitor CTR, RPM, and earnings
2. **Ad Units**: Track performance by ad unit
3. **Placements**: Optimize ad placements based on performance

### Analytics Integration
1. **Google Analytics**: Track user behavior
2. **Ad Performance**: Correlate ads with user engagement
3. **A/B Testing**: Test different ad placements

## 🚨 Important Notes

### AdSense Policies
1. **Content Quality**: Ensure high-quality, original content
2. **Ad Placement**: Don't place ads too close to navigation
3. **User Experience**: Don't overwhelm users with ads
4. **Mobile Optimization**: Ensure ads work well on mobile

### Technical Requirements
1. **HTTPS**: Site must be served over HTTPS
2. **Domain Verification**: Domain must be verified in AdSense
3. **Content Guidelines**: Follow AdSense content policies
4. **Loading Speed**: Optimize page loading speed

## 🎯 Best Practices

### Ad Placement
- **Above the fold**: Place important ads above the fold
- **Natural flow**: Integrate ads naturally into content
- **Mobile-first**: Optimize for mobile devices
- **User experience**: Don't interfere with core functionality

### Content Strategy
- **High-quality content**: Create valuable, engaging content
- **Regular updates**: Keep content fresh and relevant
- **User engagement**: Encourage user interaction
- **SEO optimization**: Optimize for search engines

### Revenue Optimization
- **A/B testing**: Test different ad placements
- **Performance monitoring**: Track ad performance regularly
- **User feedback**: Listen to user feedback about ads
- **Continuous improvement**: Optimize based on data

## 🔧 Troubleshooting

### Common Issues
1. **Ads not showing**: Check publisher ID and ad slot IDs
2. **Console errors**: Check browser console for errors
3. **AdSense violations**: Review AdSense policies
4. **Performance issues**: Optimize page loading speed

### Support Resources
1. **AdSense Help Center**: [support.google.com/adsense](https://support.google.com/adsense)
2. **AdSense Community**: [productforums.google.com/forum/#!forum/adsense](https://productforums.google.com/forum/#!forum/adsense)
3. **Google AdSense Blog**: [adsense.googleblog.com](https://adsense.googleblog.com)

## 📈 Revenue Optimization Tips

1. **Ad Placement**: Test different ad placements
2. **Ad Formats**: Experiment with different ad formats
3. **Content Strategy**: Create engaging, valuable content
4. **User Experience**: Balance monetization with user experience
5. **Mobile Optimization**: Ensure mobile-friendly ad experience
6. **Performance Monitoring**: Track and optimize based on data
7. **A/B Testing**: Continuously test and improve
8. **User Feedback**: Listen to user feedback and adjust accordingly
