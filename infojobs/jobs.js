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
    console.log(query);
	url += 'order=updated-desc';
	url += '&maxResults=' + (query.maxResults ? query.maxResults : 3);
	url += '&sinceDate=_7_DAYS';
	url += query.category ? '&category=' + encodeURIComponent(query.category) : '';
	url += query.keywords ? '&q=descripcion:' + encodeURIComponent(formatKeywords(query.keywords)) : '';

    if (Array.isArray(query.cities)) {
        query.cities.forEach((city) => {
            url += '&city=' + encodeURIComponent(city);
        });
    } else {
        if (query.cities !== '') {
            url += '&city=' + encodeURIComponent(query.cities);
        }
    }

    console.log(url);

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
        let offer = await getOfferById(item.id);
        offer = {
            id: offer.id,
            title: offer.title,
            city: offer.city,
            province: offer.province?.value,
            experienceMin: offer.experienceMin?.value,
            category: offer.category?.value,
            subcategory: offer.subcategory?.value,
            country: offer.country?.value,
            teleworking: offer.teleworking?.value,
            companyName: offer.profile?.name,
            companyDescription: offer.profile?.description,
            description: offer.description,
            maxPay: offer.maxPay?.amountValue,
            minPay: offer.minPay?.amountValue,
            salaryDescription: offer.salaryDescription,
            link: offer.link,
            skills: offer.skillsList?.map((skill) => skill.skill)
        }
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
    text = text.toLowerCase();
    text = text.replace(/\s/g, '*');
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    text = text.replace(/[^a-z0-9*]/g, "");
	return `*${text}*`;
}

export {
    getOffersByQuery,
    getOfferById
};
