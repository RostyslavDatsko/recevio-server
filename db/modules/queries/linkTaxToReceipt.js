import request from '../../request.js';

export async function createConnection(tax_id, receipt_id) {
    const result = await request({
        text: `
            INSERT INTO tax_receipts (tax_id, receipt_id)
            VALUES ($1, $2)
            RETURNING *;
        `,
        values: [tax_id, receipt_id],
    });

    return result.rows[0];
}
