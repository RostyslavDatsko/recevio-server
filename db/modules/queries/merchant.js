import request from '../../request.js';

export async function getMerchantByName(name) {
	const result = await request({
		text: 'SELECT * FROM merchants WHERE name = $1',
		values: [name],
	});

	return result.rows[0];
}

export async function createMerchant(name, address){
	const result = await request({
		text: 'INSERT INTO merchants (name, address) VALUES ($1, $2) RETURNING *',
		values: [name, address],
	});
	return result.rows[0];
}

export async function createOrGetMerchant(name, address) {
	let  merchant = await getMerchantByName(name);
	if (!merchant) {
		merchant = await createMerchant(name, address);
	}
	return merchant;
}

