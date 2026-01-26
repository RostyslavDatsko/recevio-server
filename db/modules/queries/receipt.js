import request from '../../request.js';

export async function getallReceipts() {
  const result = await request({
    text: 'SELECT * FROM receipts',
  });
  return result.rows;
}

export async function getReceiptById(id) {
  const result = await request({
    text: 'SELECT * FROM receipts WHERE id = $1',
    values: [id],
  });
  return result.rows[0];
}

export async function createReceipt(subtotal, total, date) {
  const result = await request({
    text: 'INSERT INTO receipts (subtotal, total, date) VALUES ($1, $2, $3) RETURNING *',
    values: [subtotal, total, date],
  });
  return result.rows[0];
}