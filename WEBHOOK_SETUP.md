# 🔗 Telegram Webhook Setup Guide

## 🚨 **Why Webhooks Are Needed**

Telegram bots on Vercel **cannot use polling** because:
- ❌ Vercel functions are stateless and short-lived
- ❌ Polling requires continuous connection
- ❌ Functions timeout after each request

**Solution:** Use webhooks instead!

## 🎯 **How Webhooks Work**

1. **Telegram sends messages** to your webhook URL
2. **Vercel function processes** the message
3. **Bot responds** to the user
4. **Function ends** (stateless)

## 🚀 **Step 1: Deploy Your Bot**

1. **Push your updated code** to GitHub
2. **Deploy to Vercel** (automatic if connected)
3. **Get your Vercel URL**: `https://your-project.vercel.app`

## ⚙️ **Step 2: Set Webhook URL**

### **Method 1: Using Browser**
Visit this URL (replace with your details):
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/webhook
```

### **Method 2: Using curl**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-project.vercel.app/webhook"}'
```

### **Method 3: Using Postman**
- **URL**: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook`
- **Method**: POST
- **Body**: 
```json
{
  "url": "https://your-project.vercel.app/webhook"
}
```

## ✅ **Step 3: Verify Webhook Setup**

### **Check Webhook Status:**
Visit this URL:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

**Expected Response:**
```json
{
  "ok": true,
  "result": {
    "url": "https://your-project.vercel.app/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": 0,
    "last_error_message": "",
    "max_connections": 40
  }
}
```

## 🧪 **Step 4: Test Your Bot**

1. **Send `/start`** to your bot
2. **Check Vercel logs** for webhook activity
3. **Look for these messages:**
   ```
   Received webhook request: {...}
   Processing message: /start
   === USER MESSAGE RECEIVED ===
   ```

## 🔧 **Step 5: Monitor Logs**

### **In Vercel Dashboard:**
1. Go to **Functions** → **server.js**
2. Click **"View Function Logs"**
3. **Keep logs open** while testing
4. **Watch for webhook requests**

## 🚨 **Troubleshooting**

### **Issue 1: Webhook Not Receiving Messages**
**Check:**
- ✅ Webhook URL is correct
- ✅ Bot token is valid
- ✅ Vercel deployment is live
- ✅ `/webhook` endpoint exists

### **Issue 2: Bot Not Responding**
**Check Vercel logs for:**
- Webhook requests received
- Processing errors
- Database connection issues

### **Issue 3: 404 Errors**
**Solution:**
- Ensure `/webhook` endpoint is deployed
- Check Vercel function logs
- Verify URL is correct

### **Issue 4: Timeout Errors**
**Solution:**
- Webhook functions should complete quickly
- Always respond with 200 OK
- Handle errors gracefully

## 🔄 **Updating Webhook**

### **To Change Webhook URL:**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://new-url.vercel.app/webhook"}'
```

### **To Remove Webhook (back to polling):**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

## 📊 **Webhook vs Polling**

| Feature | Webhook | Polling |
|---------|---------|---------|
| **Vercel Compatible** | ✅ Yes | ❌ No |
| **Real-time** | ✅ Yes | ✅ Yes |
| **Resource Usage** | ✅ Low | ❌ High |
| **Setup Complexity** | ⚠️ Medium | ✅ Easy |
| **Reliability** | ✅ High | ❌ Low |

## 🎯 **Best Practices**

### **1. Always Respond with 200**
```javascript
res.status(200).json({ status: 'OK' });
```

### **2. Handle Errors Gracefully**
```javascript
try {
  // Process webhook
} catch (error) {
  console.error('Error:', error);
  res.status(200).json({ status: 'Error but OK' });
}
```

### **3. Log Everything**
```javascript
console.log('Received webhook:', JSON.stringify(req.body, null, 2));
```

### **4. Validate Updates**
```javascript
if (update.message && update.message.text) {
  // Process message
}
```

## 🔗 **Useful Commands**

### **Get Bot Info:**
```
https://api.telegram.org/bot<TOKEN>/getMe
```

### **Get Webhook Info:**
```
https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```

### **Set Webhook:**
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-url.vercel.app/webhook
```

### **Delete Webhook:**
```
https://api.telegram.org/bot<TOKEN>/deleteWebhook
```

## 🚀 **After Setup**

Your bot will now:
- ✅ **Receive messages** via webhook
- ✅ **Process commands** in Vercel functions
- ✅ **Respond to users** immediately
- ✅ **Work reliably** on Vercel

**Test it:** Send `/start` to your bot and watch the Vercel logs! 🎉

---

**Your bot is now properly configured for Vercel deployment! 🚀**
