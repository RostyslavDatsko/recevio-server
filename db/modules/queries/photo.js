import request from '../../request.js';

export async function createPhoto(receipt_id, photo_url, original_filename, uploaded_at) {
    const result = await request({
        text: 'INSERT INTO photos (receipt_id, photo_url, original_filename, uploaded_at) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [receipt_id, photo_url, original_filename, uploaded_at],
    });
    return result.rows[0];
}   