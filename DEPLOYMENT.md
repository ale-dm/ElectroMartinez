# Production Deployment Checklist

## ✅ Pre-Deployment

### 1. Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Generate secure JWT_SECRET (32+ chars)
- [ ] Configure MongoDB Atlas with production cluster
- [ ] Set up Cloudinary credentials
- [ ] Configure Stripe live keys (not test)
- [ ] Set up Resend with verified domain
- [ ] Configure webhook URLs

### 2. Security
- [ ] Restrict MongoDB Network Access to server IPs only
- [ ] Update CORS origins in server.js for production domain
- [ ] Verify rate limiting is enabled
- [ ] Check all API keys are in environment variables (not hardcoded)
- [ ] Enable HTTPS/SSL
- [ ] Configure security headers

### 3. Database
- [ ] Backup production database
- [ ] Create admin user with `node make-admin.js`
- [ ] Verify indexes are created
- [ ] Test database connection

### 4. Testing
- [ ] Run all tests: `npm test`
- [ ] Test payment flows with Stripe test mode
- [ ] Verify email sending works
- [ ] Test file uploads to Cloudinary
- [ ] Check PDF generation

## 🚀 Deployment Steps

### Backend (Node.js/Express)

**Recommended Platforms:**
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS EC2/Elastic Beanstalk

**Steps:**
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Configure build command: `npm install`
5. Configure start command: `npm start`
6. Deploy

### Frontend (React/Vite)

**Recommended Platforms:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages

**Steps:**
1. Build frontend: `npm run build`
2. Deploy `dist/` folder
3. Configure redirects for SPA routing
4. Set API URL environment variable

### Environment Variables by Service

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_secure_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```

**Frontend:**
```env
VITE_API_URL=https://your-api.com
```

## 📊 Post-Deployment

### Monitoring
- [ ] Set up error monitoring (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Monitor API response times

### Stripe Configuration
- [ ] Add webhook endpoint in Stripe Dashboard
- [ ] Webhook URL: `https://your-api.com/api/stripe/webhook`
- [ ] Select events: payment_intent.succeeded, payment_intent.payment_failed
- [ ] Copy webhook secret to environment variables

### Email Configuration (Resend)
- [ ] Verify domain in Resend dashboard
- [ ] Update `from` email addresses in emailService.js
- [ ] Test email delivery

### Testing in Production
- [ ] Register new user
- [ ] Complete purchase flow
- [ ] Test payment processing
- [ ] Verify emails are received
- [ ] Download invoice PDF
- [ ] Request return/refund
- [ ] Admin panel access

## 🔧 Common Issues

### MongoDB Connection
- Verify IP whitelist includes server IP
- Check connection string format
- Ensure database user has correct permissions

### Stripe Webhook
- Verify webhook secret matches
- Check webhook endpoint is accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:5000/api/stripe/webhook`

### CORS Errors
- Update CORS origins in server.js
- Verify frontend URL is allowed

### File Upload Issues
- Check Cloudinary credentials
- Verify API rate limits

## 📱 Scaling

### Performance Optimization
- Enable gzip compression
- Configure CDN for static assets
- Implement Redis for session storage
- Add database indexing
- Enable MongoDB Atlas autoscaling

### Backup Strategy
- Schedule automated database backups
- Export environment variables
- Version control for all code
- Document deployment process

## 🛡️ Security Best Practices

1. **Never commit** `.env` files
2. **Use** environment-specific configurations
3. **Enable** rate limiting on all routes
4. **Implement** input validation
5. **Sanitize** user inputs (already configured)
6. **Use** HTTPS only
7. **Set** secure cookie options
8. **Monitor** for suspicious activity

---

**Ready to deploy?** Follow the checklist above step by step.
