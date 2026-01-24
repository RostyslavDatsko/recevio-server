import 'dotenv/config';
import fs from 'fs/promises';
import { createReceiptAction } from './modules/action/createReceipt.js';

export async function seed(){
	const raw = await fs.readFile(
		new URL('./seed.json', import.meta.url),
		'utf-8'
	);

	const data = JSON.parse(raw);

	data.receipts.forEach((receipt, i) => {
		createReceiptAction(receipt);
	});
}



