import request from '../../request.js';

export async function getDiscountByTypeAndAmount(type, amount) {
    const result = await request({
        text: `
            SELECT *
            FROM discounts
            WHERE type = $1
              AND amount = $2
        `,
        values: [type, amount],
    });

    return result.rows[0] ?? null;
}


export async function createDiscount(type, amount) {
    const result = await request({
        text: `
            INSERT INTO discounts (type, amount)
            VALUES ($1, $2)
            RETURNING *
        `,
        values: [type, amount],
    });

    return result.rows[0];
}

export async function createOrGetDiscount(type, amount) {
    let discount = await getDiscountByTypeAndAmount(type, amount);

    if (!discount) {
        discount = await createDiscount(type, amount);
    }

    return discount;
}
