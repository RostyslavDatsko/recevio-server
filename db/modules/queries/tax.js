import request from '../../request.js';

export async function getTaxByNameAndRate(name, rate_percent) {
    const result = await request({
        text: `
            SELECT *
            FROM taxes
            WHERE name = $1
              AND rate_percent = $2
        `,
        values: [name, rate_percent],
    });

    return result.rows[0] ?? null;
}


export async function createTax(name, rate_percent) {
    const result = await request({
        text: `
            INSERT INTO taxes (name, rate_percent)
            VALUES ($1, $2)
            RETURNING *
        `,
        values: [name, rate_percent],
    });

    return result.rows[0];
}

export async function getOrCreateTax(name, rate_percent) {
    let tax = await getTaxByNameAndRate(name, rate_percent);

    if (!tax) {
        tax = await createTax(name, rate_percent);
    }

    return tax;
}
