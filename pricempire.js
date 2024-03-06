waitForElement('//*[@id="__nuxt"]/div[1]/div[2]/div[3]/div[3]', 100, true).then((el) => {
  let listings = [];
  const lines = el.querySelectorAll('a');
  lines.forEach(line => {
    listings.push({
      'market': line.querySelector('.text-lg').textContent,
      'price': line.querySelector('.text-2xl').textContent,
      'priceINT': +line.querySelector('.text-2xl').textContent.replace(',', '').replace('$', ''),
      'liquidity': +line.querySelector('.text-gray-800.font-thin.text-sm').textContent.replace('Listings', '').replace(',', '.').trim()
    });
  });

  // sort by increasing
  listings.sort((a, b) => a.priceINT - b.priceINT);
  // remove shit websites
  const blacklist = ['Clash.gg', 'CSGOEmpire', 'Lis-Skins', 'CSGO500', 'Youpin', 'Market.CSGO', 'Loot.farm', 'CSGORoll'];
  listings = listings.filter(i => !blacklist.includes(i.market));

  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get('index');
  getBrowser().runtime.sendMessage({ from: 'pricempire', data: listings, params: index ? { index: index } : null });
});

// Avoid stupid extension error about having no receiving ends, in the specific case that you use Pricempire directly (and Skinbid not being there to receive anything) ~anyway
getBrowser().runtime.onMessage.addListener(() => {
});