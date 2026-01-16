# Recevio Backend

A backend server for receiving and processing receipts and documents.  
The server accepts files, extracts and normalizes data, and interacts with an external API to generate a structured response.

# Soon

In the next minor version, CRUD operations using a database are planned.

# Run

Before running the server, you need to add an API key to the `.env` file.

```env
OPENAI_API_KEY=your_api_key
```


```bash
npm install
npm run dev
```