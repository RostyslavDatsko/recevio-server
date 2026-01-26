import request from '../../request.js';

export async function createConnection(discount_id, item_id) {
    const result = await request({
        text: 'INSERT INTO item_discounts (discount_id, item_id) VALUES ($1, $2) RETURNING *',
        values: [discount_id, item_id],
    });
    return result.rows[0];
}