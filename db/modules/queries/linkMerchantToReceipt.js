import request from '../../request.js';

export async function createConnection(merchant_id, receipt_id) {
    const result = await request({
        text: 'INSERT INTO merchant_receipts(merchant_id, receipt_id) VALUES ($1, $2) RETURNING *',
        values: [merchant_id, receipt_id],
    });
    return result.rows[0];
}