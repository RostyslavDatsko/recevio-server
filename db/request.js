import pool from './connection.js';

export default async function request({ text, values = [] }) {
  return pool.query(text, values);
}
