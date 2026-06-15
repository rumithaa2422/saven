import { Router } from 'express';
import { ok } from '../../lib/http.js';
import { requireAuth } from '../../middleware/auth.js';
import { createCrudHandlers, type CrudConfig } from './genericCrud.js';

export function crudRouter(config: CrudConfig) {
  const handlers = createCrudHandlers(config);
  const router = Router();

  router.use(requireAuth);
  router.get('/', async (req, res) => res.json(ok(await handlers.list(req))));
  router.get('/:id', async (req, res) => res.json(ok(await handlers.getById(req))));
  router.post('/', async (req, res) => res.status(201).json(ok(await handlers.create(req))));
  router.patch('/:id', async (req, res) => res.json(ok(await handlers.update(req))));
  router.delete('/:id', async (req, res) => res.json(ok(await handlers.remove(req))));

  return router;
}
