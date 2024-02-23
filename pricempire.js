waitForElement('//*[@id="__nuxt"]/div[1]/div[2]/div[3]/div[3]', 100, true).then((el) => {
  let listings = [];
  const lines = el.querySelectorAll('a');
  lines.forEach(line => {
    listings.push({
      'market': line.querySelector('.text-lg').textContent,
      'price': line.querySelector('.text-2xl').textContent,
      'priceINT': +line.querySelector('.text-2xl').textContent.replace(',', '').replace('$', ''),
      'liquidity': +line.querySelector('.text-slate-300').textContent.replace('Listings', '').replace(',', '.').trim()
    });
  });

  // sort increasing
  listings.sort((a, b) => a.priceINT - b.priceINT);
  // remove shit websites
  const blacklist = ['Clash.gg', 'CSGOEmpire', 'Lis-Skins', 'CSGO500', 'Youpin', 'Market.CSGO', 'Loot.farm'];
  listings = listings.filter(i => !blacklist.includes(i.market));

  getBrowser().runtime.sendMessage({ from: 'pricempire', data: listings });
});
