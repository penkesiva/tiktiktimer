# Vercel Deployment Guide for TikTok Timer

This guide will walk you through deploying your TikTok Timer app to Vercel and connecting it to your domain tiktiktimer.com.

## 🚀 Quick Start

### 1. GitHub Repository Setup

1. **Create a new repository on GitHub** (if you haven't already)
   ```bash
   # If you haven't already, create a repo on GitHub and push your code
   git remote add origin https://github.com/yourusername/tiktiktimer.git
   git branch -M main
   git push -u origin main
   ```

2. **Ensure your code is pushed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### 2. Vercel Deployment

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository (tiktiktimer)

2. **Configure project settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables**
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Add any other environment variables you need

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-project-name.vercel.app`

### 3. Custom Domain Setup

1. **Add your domain in Vercel**
   - Go to your project dashboard
   - Click "Settings" → "Domains"
   - Add `tiktiktimer.com`

2. **Configure DNS**
   - Vercel will provide you with DNS records
   - Go to your domain registrar (where you purchased tiktiktimer.com)
   - Update your domain's nameservers to Vercel's:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Or add the specific DNS records Vercel provides

3. **SSL Certificate**
   - Vercel automatically provides free SSL certificates
   - Your site will be accessible at `https://tiktiktimer.com`

## 🔧 Configuration Updates

### Update next.config.js for Vercel

```javascript
/** @type {import('next').Config} */
const nextConfig = {
  images: {
    domains: ['tiktiktimer.com', 'localhost'],
    unoptimized: false,
  },
  // Add any redirects or rewrites you need
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### Environment Variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 PWA Setup

Your PWA manifest is already configured. Vercel will serve it automatically.

## 🚀 Performance Features

Vercel provides:
- **Edge Network**: Global CDN for fast loading
- **Automatic Optimization**: Image and code optimization
- **Analytics**: Built-in performance monitoring
- **Preview Deployments**: Test changes before going live

## 🔄 Continuous Deployment

Your app will automatically deploy when you push to the main branch:

1. **Make changes locally**
2. **Commit and push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Vercel automatically deploys**

## 📊 Monitoring & Analytics

1. **Vercel Analytics**
   - Built-in performance monitoring
   - Real user metrics
   - Core Web Vitals tracking

2. **Google Analytics** (optional)
   - Add your GA tracking ID to environment variables
   - Implement tracking in your app

## 🎯 Launch Checklist

- [ ] App builds successfully locally (`npm run build`)
- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables configured
- [ ] Domain tiktiktimer.com added to Vercel
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] App accessible at tiktiktimer.com
- [ ] All functionality working
- [ ] Mobile responsive design tested
- [ ] PWA installation working

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies are installed
   - Check Vercel build logs

2. **Environment variables not working**
   - Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new environment variables

3. **Domain not working**
   - DNS propagation can take 24-48 hours
   - Verify nameservers are correctly set
   - Check Vercel domain configuration

4. **Audio files not loading**
   - Ensure audio files are in the correct public directory
   - Check file permissions and paths

## 💰 Vercel Pricing

- **Hobby Plan**: Free (perfect for getting started)
  - Unlimited deployments
  - Custom domains
  - SSL certificates
  - 100GB bandwidth/month
  - 100GB storage

- **Pro Plan**: $20/month (when you need more)
  - Unlimited bandwidth
  - Team collaboration
  - Advanced analytics

## 🎉 Benefits of Vercel

1. **Next.js Native**: Built specifically for Next.js
2. **Zero Configuration**: Automatic optimization
3. **Global CDN**: Fast loading worldwide
4. **Automatic Deployments**: Push to GitHub, auto-deploy
5. **Preview Deployments**: Test changes before going live
6. **Built-in Analytics**: Performance monitoring included
7. **Free SSL**: Automatic HTTPS certificates
8. **Custom Domains**: Easy domain management

## 📞 Support

- **Vercel Support**: Excellent documentation and community
- **GitHub Integration**: Seamless deployment workflow
- **Community**: Active Next.js and Vercel community

## 🚀 Next Steps After Launch

1. **Monitor performance**
   - Use Vercel's built-in analytics
   - Set up Google Analytics

2. **SEO optimization**
   - Submit sitemap to Google
   - Monitor search performance

3. **User feedback**
   - Monitor contact form submissions
   - Gather user feedback for improvements

4. **Monetization**
   - Activate Google AdSense
   - Monitor ad performance

---

**🎯 Ready to deploy?** Vercel will make this super easy and give you the best performance for your Next.js app!
