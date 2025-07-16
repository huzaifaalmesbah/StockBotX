const axios = require('axios');
const cheerio = require('cheerio');
const { chromium } = require('playwright');

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_IDS = (process.env.CHAT_ID || '').split(',').map(id => id.trim()).filter(id => id);
const DEFAULT_PRODUCT_URL = 'https://robishop.com.bd/robiwifi-pro-router.html';
const PRODUCT_URL = process.env.PRODUCT_URL || DEFAULT_PRODUCT_URL;
const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === 'true';
const RUN_ID = process.env.RUN_ID || 'local';
const RUN_NUMBER = process.env.RUN_NUMBER || '1';

// User agents for rotation
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
];

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

// Send Telegram message
async function sendTelegramMessage(message, isAvailabilityAlert = false) {
    if (!TELEGRAM_TOKEN || CHAT_IDS.length === 0) {
        console.log('❌ Telegram credentials not configured');
        return;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const timestamp = currentTime();
    
    let successCount = 0;
    
    // Send message to all chat IDs individually
    for (const chatId of CHAT_IDS) {
        try {
            await axios.post(url, {
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            });
            console.log(`✅ Telegram notification sent to ${chatId} at ${timestamp}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Failed to send Telegram message to ${chatId}: ${error.message}`);
        }
    }
    
    if (isAvailabilityAlert) {
        console.log('🚨 PRODUCT AVAILABLE ALERT SENT!');
    }
    
    console.log(`📊 Notification summary: ${successCount}/${CHAT_IDS.length} recipients received the message`);
}

// Main product checking function
async function checkProductDynamic(targetUrl, fallbackProductName = 'Product') {
    const maxRetries = 3;
    let browser = null;
    let page = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔍 Attempt ${attempt}/${maxRetries} - Checking: ${targetUrl}`);

            // Launch browser
            browser = await chromium.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-extensions',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding'
                ]
            });

            page = await browser.newPage();

            // Set random user agent
            await page.setExtraHTTPHeaders({
                'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
            });

            // Set viewport
            await page.setViewportSize({ width: 1280, height: 720 });

            // Navigate to page with timeout
            await page.goto(targetUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 20000
            });

            // Wait for dynamic content
            await delay(3000);

            // Get page content
            const pageContent = await page.content();
            const $ = cheerio.load(pageContent);
            const pageText = $('body').text();
            const pageTextLower = pageText.toLowerCase();

            // Extract product name dynamically
            let productName = fallbackProductName;
            const titleSelectors = ['h1', '.product-title', '.product-name', '[class*="title"]', '[class*="name"]'];

            for (const selector of titleSelectors) {
                try {
                    const titleElement = $(selector).first();
                    if (titleElement.length > 0) {
                        const extractedTitle = titleElement.text().trim();
                        if (extractedTitle && extractedTitle.length > 3 && extractedTitle.length < 100) {
                            productName = extractedTitle;
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }

            // Check button state
            let buttonDisabled = true;
            try {
                buttonDisabled = await page.evaluate(() => {
                    const buttons = document.querySelectorAll('button[data-testid="addToCart"], button');
                    for (const button of buttons) {
                        const buttonText = button.textContent?.toLowerCase()?.trim() || '';
                        if (buttonText.includes('add to cart')) {
                            return button.disabled ||
                                   button.hasAttribute('disabled') ||
                                   button.classList.contains('disabled') ||
                                   button.classList.contains('button-disabled');
                        }
                    }
                    return true;
                });
            } catch (e) {
                console.log('Button check failed:', e.message);
            }

            // Stock status detection
            const hasOutOfStock = (
                $('.stock-status:contains("Out of stock")').length > 0 ||
                $('span.text-danger:contains("Out of stock")').length > 0 ||
                $('*:contains("Availability:"):contains("Out of stock")').length > 0 ||
                pageTextLower.includes('out of stock') ||
                pageTextLower.includes('stock out') ||
                pageTextLower.includes('unavailable')
            );

            const hasInStock = (
                $('.stock-status:contains("In stock")').length > 0 ||
                $('*:contains("Availability:"):contains("In stock")').length > 0 ||
                pageTextLower.includes('in stock') ||
                pageTextLower.includes('available now')
            );

            // Determine availability
            let isAvailable = false;
            if (hasOutOfStock) {
                isAvailable = false;
            } else if (hasInStock && !buttonDisabled) {
                isAvailable = true;
            } else if (!buttonDisabled && !hasOutOfStock) {
                isAvailable = true;
            }

            // Close browser
            await browser.close();

            const timestamp = currentTime();
            const serverInfo = 'GitHub Actions';
            const isCustomUrl = targetUrl !== DEFAULT_PRODUCT_URL;
            
            if (isAvailable) {
                const message = `🎉 <b>GREAT NEWS!</b> ${productName} is <b>AVAILABLE!</b> 🎉\n\n🔗 <a href="${targetUrl}">Buy now</a>\n\n⚡ Hurry up before it's gone!\n\n📍 <b>Source:</b> ${new URL(targetUrl).hostname}\n📡 <b>Server:</b> ${serverInfo}\n🔧 <b>Custom URL:</b> ${isCustomUrl ? 'Yes' : 'Default Product'}\n🤖 <b>Run:</b> #${RUN_NUMBER} (ID: ${RUN_ID})\n⏰ <b>Checked:</b> ${timestamp}`;
                await sendTelegramMessage(message, true);
            } else {
                const message = `😞 <b>${productName}</b> - Still Not Available\n\n📊 <b>Status:</b> OUT OF STOCK\n📍 <b>Source:</b> ${new URL(targetUrl).hostname}\n📡 <b>Server:</b> ${serverInfo}\n🔧 <b>Custom URL:</b> ${isCustomUrl ? 'Yes' : 'Default Product'}\n🤖 <b>Run:</b> #${RUN_NUMBER} (ID: ${RUN_ID})\n⏰ <b>Checked:</b> ${timestamp}\n\n🔄 Next check in ~10 minutes...`;
                await sendTelegramMessage(message, false);
            }

            console.log(`${isAvailable ? '✅' : '❌'} ${productName} - ${isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'} at ${timestamp}`);

            return {
                available: isAvailable,
                timestamp: timestamp,
                attempt: attempt,
                status: 'success',
                productName: productName,
                buttonDisabled: buttonDisabled,
                hasOutOfStock: hasOutOfStock,
                hasInStock: hasInStock
            };

        } catch (error) {
            if (browser) {
                try {
                    await browser.close();
                } catch (e) {
                    // Ignore close errors
                }
            }

            console.error(`❌ Attempt ${attempt} failed:`, error.message);

            if (attempt === maxRetries) {
                const serverInfo = 'GitHub Actions';
                const isCustomUrl = targetUrl !== DEFAULT_PRODUCT_URL;
                                const errorMsg = `🚨 <b>ERROR:</b> Cannot check ${fallbackProductName} after ${maxRetries} attempts!\n\n<b>Error:</b> ${error.message}\n📍 <b>Source:</b> ${new URL(targetUrl).hostname}\n📡 <b>Server:</b> ${serverInfo}\n🔧 <b>Custom URL:</b> ${isCustomUrl ? 'Yes' : 'Default Product'}\n🤖 <b>Run:</b> #${RUN_NUMBER} (ID: ${RUN_ID})\n⏰ <b>Time:</b> ${currentTime()}\n\n🔄 Will retry in next scheduled run (~10 minutes)`;            
                await sendTelegramMessage(errorMsg, false);
                throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
            }

            // Wait before retry
            await delay(2000 + (attempt * 1000));
        }
    }
}

// Main execution
async function main() {
    console.log('🚀 GitHub Actions Stock Monitor Bot Started');
    console.log(`⏰ Execution time: ${currentTime()}`);
    console.log(`📡 Running on: GitHub Actions`);
    console.log(`🎯 Monitoring URL: ${PRODUCT_URL}`);
    console.log(`🔧 Custom URL: ${PRODUCT_URL !== DEFAULT_PRODUCT_URL ? 'Yes (from PRODUCT_URL env)' : 'No (using default)'}`);
    console.log(`👥 Notification targets: ${CHAT_IDS.length} chat IDs configured`);
    
    try {
        // Check if required environment variables are set
        if (!TELEGRAM_TOKEN || CHAT_IDS.length === 0) {
            console.error('❌ Missing required environment variables: TELEGRAM_TOKEN and/or CHAT_ID');
            process.exit(1);
        }

        const result = await checkProductDynamic(PRODUCT_URL, 'RobiWifi Pro Router');
        
        console.log('✅ Stock monitoring completed successfully');
        console.log(`📊 Result: ${result.available ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
        console.log(`🕐 Check completed at: ${result.timestamp}`);
        
        // Exit with appropriate code
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Stock monitoring failed:', error.message);
        process.exit(1);
    }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main();
}

module.exports = { checkProductDynamic, sendTelegramMessage }; 