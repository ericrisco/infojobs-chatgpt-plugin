import { config } from 'dotenv';
config();

const CLIENT_ID = process.env.INFOJOBS_CLIENT_ID;
const CLIENT_SECRET = process.env.INFOJOBS_CLIENT_SECRET;
const BASIC_TOKEN = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
);

const OFFER_LIST_URL = 'https://api.infojobs.net/api/9/offer?';
const OFFER_ID_URL = 'https://api.infojobs.net/api/7/offer/';

async function getOffersByQuery(query) {
	let url = OFFER_LIST_URL;
	url += 'order=updated-desc';
	url += '&maxResults=3';
	url += '&sinceDate=_7_DAYS';
	url += query.category !== '' ? '&category=' + encodeURIComponent(query.category) : '';
	url += query.keywords !== '' ? '&q=descripcion:' + encodeURIComponent(formatKeywords(query.keywords)) : '';

    if (Array.isArray(query.cities)) {
        query.cities.forEach((city) => {
            url += '&city=' + encodeURIComponent(city);
        });
    } else {
        if (query.cities !== '') {
            url += '&city=' + encodeURIComponent(query.cities);
        }
    }

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${BASIC_TOKEN}`
		}
	});

    const json = await res.json();

    const items = json.items;
    const offers = [];
    
    for (let item of items) {
        const offer = await getOfferById(item.id);
        offers.push(offer);
    }

	return offers;
}

async function getOfferById(offerId) {
	let url = OFFER_ID_URL + offerId;

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${BASIC_TOKEN}`
		}
	});

	return await res.json();
}

function formatKeywords(text) {
	const keywords = text.split(',').map((keyword) => keyword.trim());

	const filteredKeywords = keywords.filter((keyword) => keyword.length > 4);

	const formattedString = filteredKeywords.join('*');

	return `*${formattedString}*`;
}

export {
    getOffersByQuery,
    getOfferById
};
