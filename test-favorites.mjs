import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const EMAIL = 'test@example.com';
const PASSWORD = 'Test@1234';

let browser, context, page;
const results = [];

function log(label, pass, detail = '') {
    const status = pass ? 'PASS' : 'FAIL';
    results.push({ label, status, detail });
    console.log(`  [${status}] ${label}${detail ? ' - ' + detail : ''}`);
}

async function screenshot(name) {
    await page.screenshot({ path: `D:/Projects/criclyst/test-screenshots/${name}.png`, fullPage: false });
}

async function login() {
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(u => u.toString().endsWith('/') || u.toString().endsWith('/'), { timeout: 10000 });
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getButtonTexts() {
    return page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
    });
}

async function waitForFavButton(timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const texts = await getButtonTexts();
        if (texts.some(t => t.includes('Add to Favorites'))) return 'Add to Favorites';
        if (texts.some(t => t.includes('Favorited'))) return 'Favorited';
        if (texts.some(t => t.includes('Login to add'))) return 'Login to add';
        await wait(500);
    }
    return null;
}

async function clickFavButton() {
    const btn = page.locator('button').filter({ hasText: /Add to Favorites|Favorited/ }).first();
    await btn.click();
}

async function testEntity(type, id, name) {
    const plural = type === 'match' ? 'matches' : `${type}s`;
    console.log(`\n=== ${type.toUpperCase()} DETAILS (${name}) ===`);
    await page.goto(`${BASE}/${plural}/${id}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('h1, h2, main, section', { timeout: 10000 });
        await wait(type === 'match' ? 4000 : 2000);

        // Check button visible
        let btnText = await waitForFavButton(15000);
        log(`${type}: Button visible on page`, !!btnText, btnText || 'none found');
        if (!btnText) {
            const allBtns = await getButtonTexts();
            console.log(`    DEBUG - All buttons: ${JSON.stringify(allBtns)}`);
            const bodyText = await page.textContent('body');
            console.log(`    DEBUG - Has "Loading": ${bodyText.includes('Loading')}`);
            console.log(`    DEBUG - Has "Match Not Found": ${bodyText.includes('Match Not Found')}`);
            console.log(`    DEBUG - Page URL: ${page.url()}`);
        }
        await screenshot(`${type}-initial`);

    if (!btnText) return;

    // If already favorited, remove first
    if (btnText === 'Favorited') {
        console.log(`    ${type} already favorited, removing first...`);
        await clickFavButton();
        await wait(2000);
        btnText = await waitForFavButton(5000);
    }

    // Add favorite
    if (btnText === 'Add to Favorites') {
        console.log(`    Adding ${type} to favorites...`);
        await clickFavButton();
        await wait(2500);
        btnText = await waitForFavButton(5000);
        log(`${type}: Shows "Favorited" after adding`, btnText === 'Favorited', btnText);
        await screenshot(`${type}-favorited`);

        // Refresh and check persistence
        console.log(`    Refreshing page...`);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('h1, h2, main, section', { timeout: 10000 });
        await wait(2500);
        btnText = await waitForFavButton(10000);
        log(`${type}: Still favorited after refresh`, btnText === 'Favorited', btnText);
        await screenshot(`${type}-after-refresh`);

        // Remove favorite
        console.log(`    Removing ${type} from favorites...`);
        if (btnText === 'Favorited') {
            await clickFavButton();
            await wait(2500);
            btnText = await waitForFavButton(5000);
            log(`${type}: Shows "Add to Favorites" after removing`, btnText === 'Add to Favorites', btnText);
            await screenshot(`${type}-removed`);

            // Refresh and verify removal persists
            console.log(`    Refreshing page after removal...`);
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector('h1, h2, main, section', { timeout: 10000 });
            await wait(2500);
            btnText = await waitForFavButton(10000);
            log(`${type}: Still unfavored after refresh`, btnText === 'Add to Favorites', btnText);
            await screenshot(`${type}-after-refresh-removed`);
        }
    } else {
        log(`${type}: Could not find "Add to Favorites" button`, false, btnText);
    }
}

async function testFavoritesPage() {
    console.log('\n=== FAVORITES PAGE ===');
    await page.goto(`${BASE}/favorites`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1, h2, main, section', { timeout: 10000 });
    await wait(3000);
    const content = await page.textContent('body');
    log('Favorites page loads', true);
    log('Favorites page: has "Favorite Players" or player names',
        content.includes('Player') || content.includes('player'));
    log('Favorites page: has "Favorite Teams" or team names',
        content.includes('Team') || content.includes('team'));
    log('Favorites page: has "Favorite Matches" or match references',
        content.includes('Match') || content.includes('match'));
    await screenshot('favorites-page-final');
}

(async () => {
    const fs = await import('fs');
    fs.mkdirSync('D:/Projects/criclyst/test-screenshots', { recursive: true });

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    page = await context.newPage();

    try {
        await login();
        console.log('Logged in successfully\n');

        await testEntity('player', '6a8efd3b58dda0752282fabf', 'andre russell');
        await testEntity('team', '6a57982573af921fa339fbbe', 'afghanistan');
        await testEntity('match', '6a678fe8ab7b24238307cfae', 'match');
        await testFavoritesPage();
    } catch (e) {
        console.error('FATAL:', e.message);
        await screenshot('error-state');
    }

    console.log('\n=== FINAL RESULTS ===');
    let allPass = true;
    for (const r of results) {
        const icon = r.status === 'PASS' ? 'PASS' : 'FAIL';
        console.log(`  ${icon}: ${r.label}${r.detail ? ' - ' + r.detail : ''}`);
        if (r.status === 'FAIL') allPass = false;
    }
    console.log(`\nOverall: ${allPass ? 'ALL PASSED' : 'SOME FAILED'}`);

    await browser.close();
})();
