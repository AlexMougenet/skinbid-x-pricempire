let lastUrl = location.href;
let estimatedPrice = 0;
new MutationObserver(() => {
	const url = location.href;
	const pattern = /^https?:\/\/skinbid\.com\/(auctions|market)\/.*/;
	if (pattern.test(url) && url !== lastUrl) {
		lastUrl = url;
		estimatedPrice = 0;
		onUrlChange();
	} else if (!pattern.test(url) && url !== lastUrl) {
		lastUrl = '';
	}
}).observe(document, { subtree: true, childList: true });

function onUrlChange() {
	setup();
}

// Setting up Pricempire iFrames and placeholders
const setup = () => {
	const itemName = location.href.split('/').slice(-1)[0].replace('stattraktm', 'stattrak');

	// Item iframe
	waitForElement('.item-bids-time-info .item-detail').then(() => {
		pricempireIframe(itemName);
	});

	// Stickers iframes
	waitForElement('.stickers').then(stickersContainer => {
		const stickersNodes = stickersContainer.parentNode.querySelectorAll('.stickers > .sticker');
		stickersNodes.forEach((sticker, i) => {
			if (sticker.querySelector('img')) {
				pricempireIframe(sticker.querySelector('.sticker-info .text').textContent, { index: i });
			}
		});
	});

	waitForElement('.item-bids-time-info').then(priceInfoNode => {
		// Cheapest market
		const newPriceInfo = priceInfoNode.querySelectorAll('div.item-detail')[1].cloneNode(true);
		newPriceInfo.querySelector('.key').childNodes[0].nodeValue = 'Cheapest market';
		newPriceInfo.querySelector('.value .white').childNodes[0].nodeValue = 'Loading...';
		newPriceInfo.setAttribute('id', 'new-price-info');
		newPriceInfo.querySelector('app-market-trend-info .content >div').textContent = 'This is fetched from https://pricempire.com/ and provided to you through my extension "Skinbid x Pricempire" -Naytars';
		newPriceInfo.querySelector('app-market-trend-info .content >p').textContent = 'The format is as follows :';
		newPriceInfo.querySelector('app-market-trend-info .content >div:last-of-type').textContent = '{CHEAPEST_PRICE} ({MARKET_NAME} x{LIQUIDITY})';
		priceInfoNode.appendChild(newPriceInfo);

		// Estimated price
		const estimatedPriceInfo = priceInfoNode.querySelectorAll('div.item-detail')[1].cloneNode(true);
		estimatedPriceInfo.querySelector('.key').childNodes[0].nodeValue = 'Estimated Price';
		estimatedPriceInfo.querySelector('.value .white').childNodes[0].nodeValue = 'Loading...';
		estimatedPriceInfo.setAttribute('id', 'estimated-price-info');
		estimatedPriceInfo.querySelector('app-market-trend-info .content >div').textContent = 'This is an estimated price based on the cheapest market\'s price and 3% of the total value of applied stickers -Naytars';
		estimatedPriceInfo.querySelector('app-market-trend-info .content >p').textContent = 'The calculation goes as follows : ';
		estimatedPriceInfo.querySelector('app-market-trend-info .content >div:last-of-type').textContent = '{CHEAPEST_PRICE} + ({TOTAL_STICKERS_PRICE}/100)*3';
		priceInfoNode.appendChild(estimatedPriceInfo);
	});
};

getBrowser().runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.from === 'pricempire') {
		if (message.params) {
			addDetails(message.data, +message.params.index);
		} else {
			addDetails(message.data);
		}
	}
});
const addDetails = (listings, stickerIndex = null) => {
	if (stickerIndex || (stickerIndex === 0 && stickerIndex !== null)) {
		// Add details to sticker n°{stickerIndex}
		const pricetag = document.createElement('span');
		pricetag.textContent = listings[0].price;
		Object.assign(pricetag.style, {
			'position': 'absolute',
			'top': '-20px'
		});
		document.querySelector(`.stickers .sticker:nth-child(${stickerIndex + 1})`).appendChild(pricetag);
		estimatedPrice += (listings[0].priceINT / 100) * 3;
	} else {
		// Add details to the main item
		document.querySelector('#new-price-info .value .white').childNodes[0].nodeValue = `${listings[0].price} (${listings[0].market} x${listings[0].liquidity})`;
		estimatedPrice += listings[0].priceINT;
	}
	document.querySelector('#estimated-price-info .value .white').childNodes[0].nodeValue = `$${estimatedPrice}`;
}
const pricempireIframe = (itemName, params) => {
	let priceEmpireIframe = document.createElement('iframe');
	priceEmpireIframe.setAttribute('src', `https://pricempire.com/item/cs2/${itemName}?${serialize(params)}`);
	Object.assign(priceEmpireIframe.style, {
		'display': 'none'
	});
	document.querySelector('app-footer').appendChild(priceEmpireIframe);
}

setup();