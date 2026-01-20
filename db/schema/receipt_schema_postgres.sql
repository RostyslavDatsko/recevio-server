BEGIN;

CREATE TABLE receipts (
  id          SERIAL PRIMARY KEY,
  subtotal    NUMERIC(10,2),
  total       NUMERIC(10,2),
  date        TIMESTAMP
);

CREATE TABLE items (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255),
  quantity            NUMERIC(10,2),
  unit_price          NUMERIC(10,2),
  original_unit_price NUMERIC(10,2),
  total_price         NUMERIC(10,2)
);

CREATE TABLE photos (
  id                SERIAL PRIMARY KEY,
  photo_url         VARCHAR(2048),
  original_filename VARCHAR(255),
  uploaded_at       TIMESTAMP
);

CREATE TABLE merchants (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(255),
  address VARCHAR(255)
);

CREATE TABLE taxes (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255),
  rate_percent NUMERIC(5,2)
);

CREATE TABLE discounts (
  id     SERIAL PRIMARY KEY,
  type   VARCHAR(100),
  amount NUMERIC(10,2)
);

CREATE TABLE transactions (
  id             SERIAL PRIMARY KEY,
  date           TIMESTAMP,
  payment_method VARCHAR(100),
  currency       VARCHAR(10)
);

CREATE TABLE receipt_items (
  receipt_id INT NOT NULL,
  item_id    INT NOT NULL,
  CONSTRAINT receipt_items_unique UNIQUE (receipt_id, item_id),
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id)    REFERENCES items(id)    ON DELETE CASCADE
);

CREATE TABLE photo_receipts (
  photo_id   INT NOT NULL,
  receipt_id INT NOT NULL,
  CONSTRAINT photo_receipts_unique UNIQUE (photo_id, receipt_id),
  FOREIGN KEY (photo_id)   REFERENCES photos(id)   ON DELETE CASCADE,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

CREATE TABLE merchant_receipts (
  merchant_id INT NOT NULL,
  receipt_id  INT NOT NULL,
  CONSTRAINT merchant_receipts_unique UNIQUE (merchant_id, receipt_id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (receipt_id)  REFERENCES receipts(id)  ON DELETE CASCADE
);

CREATE TABLE tax_receipts (
  tax_id     INT NOT NULL,
  receipt_id INT NOT NULL,
  CONSTRAINT tax_receipts_unique UNIQUE (tax_id, receipt_id),
  FOREIGN KEY (tax_id)     REFERENCES taxes(id)     ON DELETE CASCADE,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

CREATE TABLE discount_receipts (
  discount_id INT NOT NULL,
  receipt_id  INT NOT NULL,
  CONSTRAINT discount_receipts_unique UNIQUE (discount_id, receipt_id),
  FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
  FOREIGN KEY (receipt_id)  REFERENCES receipts(id)  ON DELETE CASCADE
);

CREATE TABLE transaction_receipts (
  transaction_id INT NOT NULL,
  receipt_id     INT NOT NULL,
  CONSTRAINT transaction_receipts_unique UNIQUE (transaction_id, receipt_id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (receipt_id)     REFERENCES receipts(id)      ON DELETE CASCADE
);

CREATE TABLE item_discounts (
  item_id     INT NOT NULL,
  discount_id INT NOT NULL,
  amount      NUMERIC(10,2),
  name        VARCHAR(255),
  CONSTRAINT item_discounts_unique UNIQUE (item_id, discount_id),
  FOREIGN KEY (item_id)     REFERENCES items(id)     ON DELETE CASCADE,
  FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE
);

COMMIT;
