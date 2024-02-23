const itemName = location.href.split('/').slice(-1)[0];
let estimatedPrice = 0;

waitForElement('.item-bids-time-info .item-detail', 100).then(() => {
	let priceEmpireIframe = document.createElement('iframe');
	priceEmpireIframe.setAttribute('src', `https://pricempire.com/item/cs2/skin/${itemName}`);
	priceEmpireIframe.setAttribute('id', `price-empire-iframe`);
	Object.assign(priceEmpireIframe.style, {
		'display': 'none'
	});
	document.querySelector('app-footer').appendChild(priceEmpireIframe);

	waitForElement('/html/body/app-root/div/div/app-auction-page/div/div[2]/div[3]/div[5]/div/div[6]', 100, true).then(priceInfoNode => {
		const newPriceInfo = priceInfoNode.querySelectorAll('div.item-detail')[1].cloneNode(true);
		newPriceInfo.querySelector('.key').childNodes[0].nodeValue = 'Cheapest market';
		newPriceInfo.querySelector('.value .white').childNodes[0].nodeValue = 'Loading...';
		newPriceInfo.setAttribute('id', 'new-price-info');
		newPriceInfo.querySelector('app-market-trend-info .content >div').textContent = 'This is fetched from https://pricempire.com/ and provided to you through my extension "Skinbid x Pricempire" -Naytars';
		newPriceInfo.querySelector('app-market-trend-info .content >p').textContent = 'The format is as follows :';
		newPriceInfo.querySelector('app-market-trend-info .content >div:last-of-type').textContent = '{CHEAPEST_PRICE} ({MARKET_NAME} x{LIQUIDITY})';
		priceInfoNode.appendChild(newPriceInfo);
	})
});

getBrowser().runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.from === 'pricempire') {
		addDetails(message.data);
	}
});

const addDetails = (listings) => {
	document.querySelector('#new-price-info .value .white').childNodes[0].nodeValue = `${listings[0].price} (${listings[0].market} x${listings[0].liquidity})`;
}



