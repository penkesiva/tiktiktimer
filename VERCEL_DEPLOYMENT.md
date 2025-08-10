# Vercel Deployment Guide for TikTok Timer

This guide will walk you through deploying your TikTok Timer app to Vercel and connecting it to your domain tiktiktimer.com.

## 🚀 **Step 1: GitHub Repository Setup**

### **Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit - TikTok Timer app"
```

### **Create GitHub Repository**
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Name it `tiktiktimer`
4. Make it **Public** (required for free Vercel tier)
5. Don't initialize with README (you already have one)
6. Click "Create repository"

### **Connect Local Repository to GitHub**
```bash
git remote add origin https://github.com/yourusername/tiktiktimer.git
git branch -M main
git push -u origin main
```

## 🎯 **Step 2: Vercel Project Setup**

### **Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Vercel will automatically detect your repositories

### **Import Project**
1. Click "New Project"
2. Import your `tiktiktimer` repository
3. Vercel will auto-detect it's a Next.js project
4. Keep default settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### **Environment Variables**
Add these in Vercel dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌐 **Step 3: Custom Domain Setup**

### **Add Domain in Vercel**
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add `tiktiktimer.com`
4. Vercel will show configuration instructions

### **Update DNS at Hostinger**
You have two options:

#### **Option A: Update Nameservers (Recommended)**
1. In Hostinger, go to your domain settings
2. Find "Nameservers" section
3. Change to Vercel nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ns5.vercel-dns.com
   ```

#### **Option B: Update DNS Records**
If you prefer to keep Hostinger nameservers:
1. In Hostinger, go to "DNS" section
2. Add these records:
   ```
   Type: A
   Name: @
   Value: 76.76.19.34
   
   Type: A
   Name: www
   Value: 76.76.19.34
   ```

### **Wait for DNS Propagation**
- DNS changes can take 24-48 hours
- Vercel will show "Invalid Configuration" until DNS propagates
- You can check propagation at [whatsmydns.net](https://whatsmydns.net)

## 🔍 **Step 4: SEO Setup (Already Complete!)**

### **What's Already Implemented**
✅ **Meta Tags**: Professional titles and descriptions for all pages  
✅ **Open Graph**: Social media optimization  
✅ **Twitter Cards**: Enhanced social sharing  
✅ **Structured Data**: Schema.org markup for rich snippets  
✅ **Sitemap**: XML sitemap for search engines  
✅ **Robots.txt**: Proper crawling instructions  
✅ **Canonical URLs**: Prevent duplicate content  

### **Post-Deployment SEO Actions**
1. **Submit Sitemap to Google**:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your domain `tiktiktimer.com`
   - Submit sitemap: `https://tiktiktimer.com/sitemap.xml`

2. **Verify Structured Data**:
   - Test at [Google's Rich Results Test](https://search.google.com/test/rich-results)
   - Enter your homepage URL

3. **Monitor Performance**:
   - Use [PageSpeed Insights](https://pagespeed.web.dev/) to check Core Web Vitals
   - Monitor in Google Search Console

## 📱 **Step 5: PWA & Mobile Optimization**

### **PWA Features (Already Implemented)**
✅ **Manifest**: app/manifest.json with app icons  
✅ **Service Worker**: Next.js PWA support  
✅ **Install Prompt**: Mobile app installation  
✅ **Offline Support**: Basic offline functionality  

### **Mobile Optimization**
✅ **Responsive Design**: Works on all screen sizes  
✅ **Touch-Friendly**: Proper touch targets  
✅ **Fast Loading**: Optimized for mobile networks  
✅ **Core Web Vitals**: Performance metrics optimized  

## 🎉 **Step 6: Launch & Monitor**

### **Deploy**
1. Push any changes to GitHub:
   ```bash
   git add .
   git commit -m "SEO optimization and PWA setup"
   git push origin main
   ```
2. Vercel will automatically deploy

### **Test Your App**
1. **Homepage**: [tiktiktimer.com](https://tiktiktimer.com)
2. **Workout Timer**: [tiktiktimer.com/workout](https://tiktiktimer.com/workout)
3. **Meditation Timer**: [tiktiktimer.com/meditation](https://tiktiktimer.com/meditation)

### **Monitor Performance**
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: Set up tracking (optional)
- **Search Console**: Monitor search performance
- **Core Web Vitals**: Track performance metrics

## 🚀 **Vercel Benefits for Your App**

### **Performance**
- **Edge Network**: Global CDN for fast loading
- **Automatic Optimization**: Image and code optimization
- **Serverless Functions**: API routes if needed later

### **SEO & Analytics**
- **Automatic HTTPS**: SSL certificates included
- **Performance Monitoring**: Built-in analytics
- **Git Integration**: Automatic deployments on push

### **Scalability**
- **Auto-scaling**: Handles traffic spikes automatically
- **Global CDN**: Fast loading worldwide
- **Zero downtime**: Seamless updates

## 📚 **Additional Resources**

### **SEO Documentation**
- [SEO_OPTIMIZATION.md](./SEO_OPTIMIZATION.md) - Complete SEO guide
- [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) - Implementation checklist

### **Deployment Scripts**
- [deploy_vercel.sh](./deploy_vercel.sh) - Automated deployment preparation
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) - Launch progress tracker

### **Vercel Documentation**
- [Vercel Next.js Guide](https://vercel.com/docs/functions/serverless-functions/runtimes/nodejs)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎯 **You're Ready to Launch!**

Your TikTok Timer app is now:
- ✅ **SEO Optimized**: Professional meta tags and structured data
- ✅ **PWA Ready**: Mobile app installation capability
- ✅ **Performance Optimized**: Fast loading and Core Web Vitals
- ✅ **Mobile First**: Responsive design for all devices
- ✅ **Search Engine Ready**: Sitemap, robots.txt, and proper markup

**Next**: Deploy to Vercel and watch your app rank in search results! 🚀
