# 🚀 Vercel Deployment Guide

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Vercel account (free at [vercel.com](https://vercel.com))
- ✅ MongoDB database (MongoDB Atlas recommended)

## 🎯 **Step 1: Prepare Your Code**

Your code is already ready for Vercel! We've added:
- ✅ `vercel.json` - Vercel configuration
- ✅ Proper `package.json` scripts
- ✅ Environment variable handling

## 🔗 **Step 2: Connect GitHub to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign in with GitHub** (recommended)
3. **Click "New Project"**
4. **Import your repository:**
   - Select your `mavryk-submission-bot` repository
   - Vercel will auto-detect it's a Node.js project

## ⚙️ **Step 3: Configure Environment Variables**

In Vercel dashboard, add these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `TELEGRAM_BOT_TOKEN` | `your_bot_token_here` | ✅ |
| `MONGODB_URI` | `your_mongodb_connection_string` | ✅ |
| `MONGODB_DB_NAME` | `mavryk_bot` | ✅ |
| `NODE_ENV` | `production` | ❌ |

### **How to get these values:**

#### **Telegram Bot Token:**
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Follow instructions to create bot
4. Copy the token

#### **MongoDB URI:**
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Replace `<password>` with your database password

## 🚀 **Step 4: Deploy**

1. **Click "Deploy"** in Vercel
2. **Wait for build** (usually 1-2 minutes)
3. **Your bot will be live!** 🎉

## 🌐 **Step 5: Get Your URLs**

After deployment, Vercel gives you:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each Git branch/PR

## 🔧 **Step 6: Configure Telegram Webhook (Optional)**

For better performance, you can set a webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-project.vercel.app/webhook"}'
```

## 📊 **Step 7: Monitor Your Bot**

- **Vercel Dashboard**: View deployments, logs, performance
- **Function Logs**: See bot activity and errors
- **Analytics**: Monitor usage and performance

## 🔄 **Automatic Deployments**

- **Every push to `main`** = Automatic production deployment
- **Pull requests** = Preview deployments
- **No manual deployment needed!**

## 🚨 **Important Notes**

### **MongoDB Connection:**
- Use MongoDB Atlas (free tier available)
- Ensure network access allows Vercel IPs
- Use connection string with username/password

### **Telegram Bot:**
- Bot will use polling by default (works fine)
- Webhook setup is optional but recommended
- Keep your bot token secret!

### **Environment Variables:**
- Never commit `.env` file to Git
- Set all variables in Vercel dashboard
- Restart deployment after changing env vars

## 🐛 **Troubleshooting**

### **Bot Not Responding:**
1. Check Vercel function logs
2. Verify environment variables
3. Ensure MongoDB is accessible
4. Check Telegram bot token

### **Build Errors:**
1. Check `package.json` dependencies
2. Ensure `server.js` is the main file
3. Verify Node.js version compatibility

### **Database Connection Issues:**
1. Check MongoDB connection string
2. Verify network access
3. Ensure database exists
4. Check username/password

## 📱 **Testing Your Deployed Bot**

1. **Send `/start`** to your bot
2. **Check `/status`** command
3. **Test submission** with `/SubmitMavryk`
4. **Monitor Vercel logs** for activity

## 🔗 **Useful Links**

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://mongodb.com/atlas)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Vercel Documentation](https://vercel.com/docs)

---

**Your bot will be live and automatically updated with every code push! 🚀**
