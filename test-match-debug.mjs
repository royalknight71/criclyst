import { chromium } from 'playwright';
(async () => {
    const fs = await import('fs');
    fs.mkdirSync('D:/Projects/criclyst/test-screenshots', { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    
    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
    await page.waitForURL(u => u.toString().endsWith('/'), { timeout: 10000 });
    console.log('Logged in');
    
    // Go to match details
    await page.goto('http://localhost:5173/matches/6a678fe8ab7b24238307cfae', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 5000));
    
    await page.screenshot({ path: 'D:/Projects/criclyst/test-screenshots/match-debug.png', fullPage: true });
    
    // Get all button texts
    const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()));
    console.log('Buttons on page:', btns);
    
    // Get all text content
    const text = await page.textContent('body');
    console.log('Has "Add to Favorites":', text.includes('Add to Favorites'));
    console.log('Has "Favorited":', text.includes('Favorited'));
    console.log('Has "Login to add":', text.includes('Login to add'));
    
    // Check URL
    console.log('Current URL:', page.url());
    
    // Check page content
    const html = await page.content();
    console.log('Has FavoriteButton text:', html.includes('FavoriteButton'));
    console.log('Has "Add to Favorites" in HTML:', html.includes('Add to Favorites'));
    console.log('Has "Favorited" in HTML:', html.includes('Favorited'));
    
    // Check for errors
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await browser.close();
})();
