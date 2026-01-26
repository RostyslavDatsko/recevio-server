import { createReceipt } from '../queries/receipt.js';
import { createItem } from '../queries/items.js';
import { createOrGetMerchant } from '../queries/merchant.js';
import { createPhoto } from '../queries/photo.js';
import { createTransaction } from '../queries/transactions.js';
import { createOrGetDiscount } from '../queries/discount.js';
import { getOrCreateTax } from '../queries/tax.js';

import { createConnection as linkMerchantToReceipt } from '../queries/linkMerchantToReceipt.js';
import { createConnection as linkItemToReceipt } from '../queries/linkItemToReceipt.js';
import { createConnection as linkDiscountToItem } from '../queries/linkDiscountToItem.js';
import { createConnection as linkDiscountToReceipt } from '../queries/linkDiscountToReceipt.js';
import { createConnection as linkTaxToReceipt } from '../queries/linkTaxToReceipt.js';

export async function createReceiptAction(receiptData) {
    const { metadata, merchant: merchantData, transaction, items, summary } = receiptData;
    
    const receipt = await createReceipt(
        summary.subtotal,
        summary.total_amount,
        transaction.purchase_date
    );

    await createPhoto(
        receipt.id,
        metadata.photo_url,
        metadata.original_filename,
        metadata.upload_timestamp
    );
    
    await createTransaction(
        receipt.id,
        transaction.purchase_date,
        transaction.payment_method,
        transaction.currency
    );
    
    const merchant = await createOrGetMerchant(merchantData.name, merchantData.address);
    await linkMerchantToReceipt(merchant.id, receipt.id);

    for (const itemData of items) {
        const item = await createItem(
            itemData.name,
            itemData.quantity,
            itemData.unit_price,
            itemData.original_unit_price,
            itemData.total_price
        );
        
        await linkItemToReceipt(item.id, receipt.id);
        
        for (const discountData of itemData.discounts ?? []) {
            const discount = await createOrGetDiscount(discountData.name, discountData.amount);
            await linkDiscountToItem(discount.id, item.id);
        }
    }

    for (const discountData of summary.discounts ?? []) {
        const discount = await createOrGetDiscount(discountData.name, discountData.amount);
        await linkDiscountToReceipt(discount.id, receipt.id);
    }
    
    for (const taxData of summary.taxes ?? []) {
        const tax = await getOrCreateTax(taxData.name, taxData.amount);
        await linkTaxToReceipt(tax.id, receipt.id);
    }
    
    return receipt;
}
