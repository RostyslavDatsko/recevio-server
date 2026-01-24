import { createReceiptAction } from "../action/createReceipt";

export function createReceipt(receiptData) {
  return createReceiptAction(receiptData);
}