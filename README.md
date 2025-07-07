# Stock Monitor Bot - GitHub Actions

This bot monitors product availability and sends Telegram notifications when products become available. It runs automatically every 10 minutes using GitHub Actions.

## 🚀 Features

- ✅ Monitors product stock status every 10 minutes
- 📱 Sends Telegram notifications
- 🤖 Runs automatically on GitHub Actions (free)
- 🌐 Uses Playwright for reliable web scraping
- 🔄 Automatic retries on failures
- 📊 Detailed logging and error reporting

## 📋 Setup Instructions

### 1. Fork/Clone This Repository

1. Fork this repository to your GitHub account
2. Clone it to your local machine (optional)

### 2. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Save the **Bot Token** (looks like: `123456789:ABCdef...`)
5. Get your **Chat ID**:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates`
   - Find your `chat.id` in the response

### 3. Configure GitHub Secrets & Variables

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `TELEGRAM_TOKEN` | Your bot token from BotFather | Used to send messages |
| `CHAT_ID` | Your chat ID | Where messages will be sent |

4. **Optional**: Add repository variable for custom product URL:
   - Click on **Variables** tab
   - Add variable: `PRODUCT_URL` with your custom product URL
   - If not set, defaults to: `https://robishop.com.bd/robiwifi-pro-router.html`

### 4. Customize Product URL (Two Ways)

**Option A: Using GitHub Variables (Recommended)**
1. Go to **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. Add variable: `PRODUCT_URL` = `https://your-store.com/your-product.html`
3. No code changes needed!

**Option B: Edit Code**
Edit the `DEFAULT_PRODUCT_URL` in `monitor.js`:
```javascript
const DEFAULT_PRODUCT_URL = 'https://your-store.com/your-product.html';
```

### 5. Enable GitHub Actions

1. Go to your repository
2. Click on **Actions** tab
3. Enable workflows if prompted
4. The bot will start running automatically every 10 minutes

## 🔧 Configuration Options

### Modify Check Frequency

Edit `.github/workflows/stock-monitor.yml` to change the schedule:

```yaml
schedule:
  # Every 5 minutes
  - cron: '*/5 * * * *'
  # Every hour
  - cron: '0 * * * *'
  # Every day at 9 AM
  - cron: '0 9 * * *'
```

### Add Multiple Products

You can modify `monitor.js` to check multiple products:

```javascript
const PRODUCTS = [
    { url: 'https://store1.com/product1', name: 'Product 1' },
    { url: 'https://store2.com/product2', name: 'Product 2' }
];
```

## 📱 Notification Examples

### When Product is Available:
```
🎉 GREAT NEWS! RobiWifi Pro Router is AVAILABLE! 🎉

🔗 Buy now: https://robishop.com.bd/robiwifi-pro-router.html

⚡ Hurry up before it's gone!

📍 Source: robishop.com.bd
📡 Server: GitHub Actions
🔧 Custom URL: Default Product
⏰ Checked: 12/20/2024, 2:30:45 PM
```

### When Product is Out of Stock:
```
😞 RobiWifi Pro Router - Still Not Available

📊 Status: OUT OF STOCK
📍 Source: robishop.com.bd
📡 Server: GitHub Actions
🔧 Custom URL: Default Product
⏰ Checked: 12/20/2024, 2:30:45 PM

🔄 Will check again in 10 minutes...
```

## 🛠 Manual Testing

### Run Workflow Manually

1. Go to **Actions** tab in your repository
2. Click on **Stock Monitor Bot** workflow
3. Click **Run workflow** → **Run workflow**

### Test Locally

```bash
# Install dependencies (clean dependencies - only what's needed)
npm install

# Set environment variables
export TELEGRAM_TOKEN="your_bot_token"
export CHAT_ID="your_chat_id"

# Optional: Set custom product URL
export PRODUCT_URL="https://your-store.com/product"

# Run the monitor
node monitor.js
```

## 📊 Monitoring & Logs

### View Execution Logs

1. Go to **Actions** tab
2. Click on any workflow run
3. Click on **monitor-stock** job
4. Expand log sections to see detailed output

### Check Workflow Status

- ✅ Green checkmark: Monitor ran successfully
- ❌ Red X: Monitor failed (check logs)
- 🟡 Yellow dot: Monitor is currently running

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| No notifications received | Check TELEGRAM_TOKEN and CHAT_ID secrets |
| Workflow not running | Enable Actions in repository settings |
| "Resource not accessible" error | Website might be blocking GitHub IPs |
| Browser launch failed | Check if Playwright installation succeeded |

### Debug Mode

Add this to your workflow for more detailed logs:

```yaml
- name: Run stock monitor
  env:
    TELEGRAM_TOKEN: ${{ secrets.TELEGRAM_TOKEN }}
    CHAT_ID: ${{ secrets.CHAT_ID }}
    GITHUB_ACTIONS: true
    DEBUG: true
  run: node monitor.js
```

## 📝 File Structure

```
├── .github/
│   └── workflows/
│       └── stock-monitor.yml    # GitHub Actions workflow
├── monitor.js                   # GitHub Actions monitoring script
├── package.json                 # Dependencies
├── README.md                    # This file
├── SETUP_GUIDE.md              # Quick setup guide
└── .gitignore                   # Git ignore patterns
```

## ⚡ GitHub Actions Benefits

- **Free**: 2000 minutes/month for public repos
- **Reliable**: Runs automatically without your server
- **Scalable**: Easy to add more products or change frequency
- **Logs**: Built-in logging and error tracking
- **No Maintenance**: No server management required

## 🔒 Security Notes

- Never commit tokens directly to code
- Use GitHub Secrets for all sensitive data
- Bot tokens should be kept private
- Consider using a dedicated Telegram bot for monitoring

## 📈 Scaling Up

For monitoring many products or higher frequency:
- Consider upgrading to GitHub Pro for more Actions minutes
- Split into multiple workflows
- Use matrix strategy for parallel monitoring
- Implement rate limiting for website protection

---

**Made with ❤️ for automated stock monitoring** 