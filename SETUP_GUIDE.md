# 🚀 Quick Setup Guide - GitHub Actions Stock Monitor

## 📝 What's Included

✅ **GitHub Actions Workflow** (`.github/workflows/stock-monitor.yml`)
- Runs every 10 minutes automatically
- Uses Ubuntu runner with Node.js 22
- Installs Playwright browsers

✅ **Monitor Script** (`monitor.js`)
- Optimized for GitHub Actions (single run + exit)
- Sends Telegram notifications
- Environment variable support for custom URLs

✅ **Documentation** (`README.md` & `SETUP_GUIDE.md`)
- Complete setup instructions
- Troubleshooting guide
- Configuration options

✅ **Clean Dependencies** (`package.json`)
- Only necessary packages (axios, cheerio, playwright)
- Removed server dependencies (express, node-cron, etc.)

## ⚡ Quick Start (5 minutes)

### 1. Create Telegram Bot
```
1. Message @BotFather on Telegram
2. Send: /newbot
3. Choose name and username
4. Save the bot token
```

### 2. Get Your Chat ID
```
1. Send any message to your bot
2. Visit: https://api.telegram.org/bot{YOUR_TOKEN}/getUpdates
3. Copy the "id" number from the response
```

### 3. Add GitHub Secrets & Variables
```
Repository → Settings → Secrets and variables → Actions

Add these secrets:
- TELEGRAM_TOKEN: Your bot token
- CHAT_ID: Your chat ID (number)

Optional - Add variable (Variables tab):
- PRODUCT_URL: Your custom product URL
  (If not set, uses default robishop.com.bd URL)
```

### 4. Enable & Test
```
1. Go to Actions tab
2. Enable workflows
3. Click "Stock Monitor Bot"
4. Click "Run workflow" to test
```

## 🔧 Customization

### Change Product URL (Two Methods)

**Method 1: GitHub Variables (Recommended)**
```
Settings → Secrets and variables → Actions → Variables
Add: PRODUCT_URL = https://your-website.com/product
```

**Method 2: Edit Code**
```javascript
// Edit monitor.js line 8:
const DEFAULT_PRODUCT_URL = 'https://your-website.com/product';
```

### Change Schedule
Edit `.github/workflows/stock-monitor.yml`:
```yaml
schedule:
  - cron: '*/5 * * * *'  # Every 5 minutes
  - cron: '0 * * * *'    # Every hour
```

## 📱 Expected Notifications

**✅ Available:**
```
🎉 GREAT NEWS! Product is AVAILABLE! 🎉
🔗 Buy now: [link]
⚡ Hurry up before it's gone!
📡 Server: GitHub Actions
⏰ Checked: [timestamp]
```

**❌ Out of Stock:**
```
😞 Product - Still Not Available
📊 Status: OUT OF STOCK
📡 Server: GitHub Actions
🔄 Will check again in 10 minutes...
```

## 🛠 Testing

### Manual Test
```
Actions → Stock Monitor Bot → Run workflow
```

### Local Test
```bash
npm install
export TELEGRAM_TOKEN="your_token"
export CHAT_ID="your_chat_id"
npm run monitor
```

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| No messages | Check secrets are set correctly |
| Workflow not running | Enable Actions in Settings |
| Browser errors | Wait for Playwright installation |

## 💡 Pro Tips

- **Free Usage**: 2000 minutes/month on GitHub
- **Multiple Products**: Modify `monitor.js` to loop through URLs
- **Different Schedules**: Create separate workflows
- **Debug**: Check Actions logs for detailed output

---

**🎯 You're all set! The bot will now monitor your product automatically every 10 minutes and send you Telegram notifications when it becomes available.** 