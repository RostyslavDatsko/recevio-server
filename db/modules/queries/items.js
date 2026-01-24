import request from '../../request.js';

export async function createItem(name, quantity, unit_price, original_unit_price, total_price){
    const result = await request({
        text: 'INSERT INTO items (name, quantity, unit_price, original_unit_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: [name, quantity, unit_price, original_unit_price, total_price],
    });
    return result.rows[0];
}