import request from '../../request.js';

export async function createTransaction(receipt_id, date, payment_method, currency){
    const result = await request({
        text: 'INSERT INTO transactions (receipt_id, date, payment_method, currency) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [receipt_id, date, payment_method, currency],
    });
    return result.rows[0];
}