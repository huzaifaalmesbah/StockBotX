# 🤖 Stock Monitor Bot - GitHub Actions

Automated product stock monitoring with Telegram notifications. Runs every 5 minutes on GitHub Actions (free) with reliability optimizations. ⚡ **Currently in testing mode!**

## 🚀 Features

- ✅ **Auto-monitoring** every 5 minutes (testing mode - with reliability improvements)
- 📱 **Telegram notifications** with availability alerts
- 🤖 **GitHub Actions** - runs free without your own server
- 🌐 **Playwright web scraping** - reliable product detection
- 🔄 **Smart retries** and error handling
- 📊 **Run tracking** to monitor scheduling reliability
- 🔧 **Configurable** product URLs via environment variables

## ⚡ Quick Start (5 minutes)

### 1. Create Telegram Bot
1. Message `@BotFather` on Telegram → Send `/newbot`
2. Follow instructions and save the **bot token**
3. Get your **Chat ID**: Send a message to your bot, then visit:
   ```
   https://api.telegram.org/bot{YOUR_TOKEN}/getUpdates
   ```
   Copy the `"id"` number from the response

### 2. Setup GitHub Repository
1. **Fork this repository** to your GitHub account
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Add repository secrets:
   - `TELEGRAM_TOKEN`: Your bot token
   - `CHAT_ID`: Your chat ID (number)
4. **Optional**: Add variable `PRODUCT_URL` for custom product
5. Go to **Actions** tab → Enable workflows → **Run workflow** to test

✅ **Done!** The bot will now monitor automatically every 5 minutes.

## 🔧 Configuration Options

### Change Product URL
**Option A: GitHub Variables (Recommended)**
```
Settings → Secrets and variables → Actions → Variables
Add: PRODUCT_URL = https://your-store.com/product
```

**Option B: Edit Code**
```javascript
// Edit monitor.js line 8:
const DEFAULT_PRODUCT_URL = 'https://your-store.com/product';
```

### Change Schedule Frequency
Edit `.github/workflows/stock-monitor.yml`:
```yaml
schedule:
  - cron: '1,6,11,16,21,26,31,36,41,46,51,56 * * * *'  # Every 5 minutes
  - cron: '3,18,33,48 * * * *'                          # Every 15 minutes
  - cron: '2,12,22,32,42,52 9-18 * * 1-5'               # Business hours only
```

### Add Multiple Products
Modify `monitor.js` to check multiple products:
```javascript
const PRODUCTS = [
    { url: 'https://store1.com/product1', name: 'Product 1' },
    { url: 'https://store2.com/product2', name: 'Product 2' }
];
```

## 📱 Notifications & Monitoring

### Telegram Message Examples

**✅ When Available:**
```
🎉 GREAT NEWS! RobiWifi Pro Router is AVAILABLE! 🎉
🔗 Buy now: https://robishop.com.bd/robiwifi-pro-router.html
⚡ Hurry up before it's gone!
📡 Server: GitHub Actions
🤖 Run: #42 (ID: 123456789)
⏰ Checked: 12/20/2024, 2:32:45 PM
```

**❌ When Out of Stock:**
```
😞 RobiWifi Pro Router - Still Not Available
📊 Status: OUT OF STOCK
📡 Server: GitHub Actions  
🤖 Run: #43 (ID: 123456790)
⏰ Checked: 12/20/2024, 2:06:45 PM
🔄 Next check in ~5 minutes...
```

### Monitor Reliability
**Track Run Numbers** - Each message shows **Run #X** to monitor consistency:
- **Expected**: Run #1 → #2 → #3 → #4 (every 5 minutes at :01, :06, :11, :16, :21, etc.)
- **Missing**: Run #1 → #3 means #2 was missed by GitHub Actions
- **Normal**: 90-95% reliability for scheduled workflows
- **Backup**: Use **"Run workflow"** button for manual triggers (always work)

## 🛠 Testing & Monitoring

### Manual Testing
1. **GitHub Actions**: Go to **Actions** → **Stock Monitor Bot** → **Run workflow**
2. **Local testing**:
   ```bash
   npm install
   export TELEGRAM_TOKEN="your_token"
   export CHAT_ID="your_chat_id"
   export PRODUCT_URL="https://your-store.com/product"  # Optional
   node monitor.js
   ```

### Check Workflow Status
- **Actions tab**: View execution logs and run history
- **Telegram messages**: Track Run #X sequence for missed runs
- **Status indicators**: ✅ Success | ❌ Failed | 🟡 Running

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| No notifications | Check TELEGRAM_TOKEN and CHAT_ID secrets are set |
| Workflow not running | Enable Actions in repository settings |
| Missing scheduled runs | Normal (90-95% reliability) - use manual triggers |
| Browser/website errors | Check Actions logs for details |

**Reliability Issues?**
- GitHub Actions scheduling has 90-95% reliability
- Manual triggers always work: **Actions** → **Run workflow**
- Change schedule timing or reduce frequency if needed
- Consider different cron times (avoid :00, :15, :30, :45 minutes)

## 📝 Project Structure

```
├── .github/workflows/stock-monitor.yml  # GitHub Actions workflow
├── monitor.js                           # Main monitoring script  
├── package.json                         # Dependencies (axios, cheerio, playwright)
├── README.md                            # Complete documentation
└── .gitignore                           # Git ignore patterns
```

## 💡 Key Benefits & Tips

**✅ Benefits:**
- **Free**: 2000 minutes/month on GitHub Actions
- **No server needed**: Runs automatically in the cloud
- **Reliable monitoring**: 90-95% uptime with smart retry logic
- **Easy setup**: 5-minute configuration

**⚡ Pro Tips:**
- **Watch Run #** in Telegram messages to track consistency
- **Use manual triggers** when automatic runs are missed
- **Multiple products**: Modify monitor.js for additional URLs
- **Custom schedules**: Edit cron patterns for different timing
- **Private repos**: Get higher priority with GitHub Pro

**🔒 Security:**
- Use GitHub Secrets for tokens (never commit in code)
- Consider dedicated Telegram bot for monitoring
- Keep bot tokens private

---

**🎯 Your automated stock monitoring solution is ready! Watch for availability alerts in Telegram.** 