import request from '../../request.js';

export async function createConnection(discount_id, receipt_id) {
    const result = await request({
        text: 'INSERT INTO discount_receipts (discount_id, receipt_id) VALUES ($1, $2) RETURNING *',
        values: [discount_id, receipt_id],
    });
    return result.rows[0];
}