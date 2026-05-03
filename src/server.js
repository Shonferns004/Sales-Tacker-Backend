import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || '*';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvDirectory = path.resolve(__dirname, '../data');
const csvPath = path.join(csvDirectory, 'leads.csv');
const csvHeaders = ['name', 'phone', 'stage', 'priority', 'followUpDate', 'createdDate'];

const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '5mb' }));

function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toCsv(leads) {
  const rows = leads.map((lead) =>
    csvHeaders
      .map((header) => {
        const map = {
          name: lead.name,
          phone: lead.phone,
          stage: lead.stage,
          priority: lead.priority,
          followUpDate: lead.followUpDate,
          createdDate: lead.createdDate,
        };
        return escapeCsvValue(map[header]);
      })
      .join(',')
  );

  return `${csvHeaders.join(',')}\n${rows.join('\n')}`;
}

async function ensureCsvDirectory() {
  await fs.mkdir(csvDirectory, { recursive: true });
}

app.get('/health', (_request, response) => {
  response.json({ ok: true, service: 'sales-tracker-backend' });
});

app.get('/api/hello-neil', (_request, response) => {
  response.send('hello neil');
});

app.get('/api/csv/download', async (_request, response, next) => {
  try {
    await ensureCsvDirectory();

    let csv = '';
    try {
      csv = await fs.readFile(csvPath, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      csv = `${csvHeaders.join(',')}\n`;
      await fs.writeFile(csvPath, csv, 'utf8');
    }

    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    response.send(csv);
  } catch (error) {
    next(error);
  }
});

app.post('/api/csv/sync', async (request, response, next) => {
  try {
    const leads = Array.isArray(request.body?.leads) ? request.body.leads : [];
    const sortedLeads = [...leads].sort((a, b) => {
      const createdCompare = String(b.createdDate || '').localeCompare(String(a.createdDate || ''));
      if (createdCompare !== 0) return createdCompare;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });

    await ensureCsvDirectory();
    await fs.writeFile(csvPath, toCsv(sortedLeads), 'utf8');

    response.json({
      ok: true,
      count: sortedLeads.length,
      file: csvPath,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/', (_request, response) => {
  response.json({
    ok: true,
    service: 'sales-tracker-backend',
    endpoints: ['/health', '/api/hello-neil', '/api/csv/download', '/api/csv/sync'],
  });
});

app.use((request, response) => {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Sales Tracker backend listening on http://localhost:${port}`);
});
