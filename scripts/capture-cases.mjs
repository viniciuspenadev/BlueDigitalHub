// Captura screenshots dos sites dos cases em formato retrato (800x1250)
// para os cards do coverflow. Uso: node scripts/capture-cases.mjs
// Requer Chrome ou Edge instalado (usa playwright-core, sem download de browser).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/assets/cases');
mkdirSync(OUT, { recursive: true });

const sites = [
  ['kora', 'https://omnikora.com.br/'],
  ['blueduca', 'https://www.blueduca.com.br/'],
  ['python-logistics', 'https://pythonlogistics.com/'],
  ['funchal-pescados', 'https://funchalpescados.com.br/'],
  ['panobianco', 'https://www.panobiancoacademia.com.br/'],
  ['lumira', 'https://colegiolumira.com/'],
];

// Remove overlays de cookies/pop-ups apenas do DOM local, para a captura.
// Nada é clicado nem aceito.
const cleanOverlays = () => {
  const KEY = /cookie|consent|lgpd|privacid|modal|popup|backdrop/i;
  document.querySelectorAll('body *').forEach((el) => {
    const pos = getComputedStyle(el).position;
    if (pos !== 'fixed' && pos !== 'absolute') return;
    const label = `${el.className} ${el.id}`;
    if (KEY.test(label) || el.getAttribute('role') === 'dialog') {
      el.remove();
      return;
    }
    // Fallback por texto (banners sem classe identificável)
    if (pos === 'fixed') {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < innerHeight * 0.7 && /privacidade|cookies|aceitar tudo/i.test(el.textContent || '')) {
        el.remove();
      }
    }
  });
  document.documentElement.style.overflow = 'visible';
  document.body.style.overflow = 'visible';
  window.scrollTo(0, 0);
};

let browser = null;
for (const channel of ['chrome', 'msedge']) {
  try {
    browser = await chromium.launch({ channel });
    console.log('usando navegador:', channel);
    break;
  } catch {
    /* tenta o próximo */
  }
}
if (!browser) {
  console.error('Nenhum Chrome/Edge encontrado');
  process.exit(1);
}

for (const [name, url] of sites) {
  const page = await browser.newPage({
    viewport: { width: 800, height: 1250 },
    deviceScaleFactor: 1,
  });
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.keyboard.press('Escape');
    await page.evaluate(cleanOverlays);
    await page.waitForTimeout(1200);
    await page.evaluate(cleanOverlays); // pega banners que aparecem com atraso
    await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 82 });
    console.log('ok:', name);
  } catch (e) {
    console.error('FALHOU:', name, e.message);
  }
  await page.close();
}
await browser.close();
console.log('fim');
