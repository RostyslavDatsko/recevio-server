import request from '../../request.js';

export async function createConnection(item_id, receipt_id) {
    const result = await request({
        text: 'INSERT INTO receipt_items (item_id, receipt_id) VALUES ($1, $2) RETURNING *',
        values: [item_id, receipt_id],
    });
    return result.rows[0];
}