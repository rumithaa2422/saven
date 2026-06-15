import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { ok } from '../../lib/http.js';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: env.UPLOAD_DIR,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 }
});

const router = Router();
router.use(requireAuth);

const supportedModules = ['service-requests', 'inventory', 'incidents', 'access-management', 'compliance', 'vendors-licenses', 'users-teams'];

router.post('/preview', upload.single('file'), async (req, res) => {
  const module = z.enum(supportedModules as [string, ...string[]]).parse(req.body.module);
  if (!req.file) throw new Error('Excel file is required');

  const workbook = XLSX.readFile(req.file.path);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

  const previewRows = rows.slice(0, 100).map((row, index) => ({
    rowNumber: index + 2,
    rawJson: row,
    normalizedJson: normalizeRow(module, row),
    errorsJson: validateRow(module, row)
  }));

  const batch = await prisma.excelImportBatch.create({
    data: {
      module,
      fileName: path.basename(req.file.originalname),
      uploadedBy: req.user?.email,
      totalRows: rows.length,
      validRows: previewRows.filter((row) => row.errorsJson.length === 0).length,
      invalidRows: previewRows.filter((row) => row.errorsJson.length > 0).length,
      rows: {
        create: previewRows.map((row) => ({
          rowNumber: row.rowNumber,
          rawJson: row.rawJson as never,
          normalizedJson: row.normalizedJson as never,
          errorsJson: row.errorsJson as never,
          status: row.errorsJson.length ? 'INVALID' : 'VALID'
        }))
      }
    },
    include: { rows: true }
  });

  res.json(ok(batch));
});

function normalizeRow(module: string, row: Record<string, unknown>) {
  const read = (...keys: string[]) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== '');
  switch (module) {
    case 'service-requests':
      return {
        title: read('Title', 'title', 'Subject'),
        category: read('Category', 'category'),
        priority: String(read('Priority', 'priority') ?? 'MEDIUM').toUpperCase(),
        description: read('Description', 'description')
      };
    case 'inventory':
      return {
        assetTag: read('Asset Tag', 'assetTag', 'AssetTag'),
        type: read('Type', 'type'),
        make: read('Make', 'make'),
        model: read('Model', 'model'),
        serialNumber: read('Serial Number', 'serialNumber')
      };
    default:
      return row;
  }
}

function validateRow(module: string, row: Record<string, unknown>) {
  const normalized = normalizeRow(module, row) as Record<string, unknown>;
  const errors: string[] = [];
  if (module === 'service-requests') {
    if (!normalized.title) errors.push('Title is required');
    if (!normalized.category) errors.push('Category is required');
  }
  if (module === 'inventory') {
    if (!normalized.assetTag) errors.push('Asset tag is required');
    if (!normalized.type) errors.push('Asset type is required');
  }
  return errors;
}

export default router;
