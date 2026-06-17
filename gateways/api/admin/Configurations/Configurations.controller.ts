import { Request, Response } from 'express';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CONFIG_ENTITIES = [
  'squad',
  'team',
  'issueType',
  'status',
  'fixVersion',
  'sprintNumber',
  'priority',
] as const;

export type ConfigEntity = (typeof CONFIG_ENTITIES)[number];

const ENTITY_LABELS: Record<ConfigEntity, string> = {
  squad: 'Squad',
  team: 'Team',
  issueType: 'Issue Type',
  status: 'Status',
  fixVersion: 'Fix Version',
  sprintNumber: 'Sprint Number',
  priority: 'Priority',
};

const isConfigEntity = (value: string): value is ConfigEntity =>
  (CONFIG_ENTITIES as readonly string[]).includes(value);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

const modelForEntity = (entity: ConfigEntity) => {
  // Maps the URL segment to the Prisma model accessor (camelCase).
  const map: Record<ConfigEntity, string> = {
    squad: 'squad',
    team: 'team',
    issueType: 'issueType',
    status: 'status',
    fixVersion: 'fixVersion',
    sprintNumber: 'sprintNumber',
    priority: 'priority',
  };
  return map[entity];
};

export const labelForEntity = (entity: ConfigEntity): string => ENTITY_LABELS[entity];

// ─── Controller ───────────────────────────────────────────────────────────────

export class ConfigurationsController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private prismaPromise: any) {}

  // Resolves the promise and returns the PrismaClient
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async db(): Promise<any> {
    return await this.prismaPromise;
  }

  private parseEntity(req: Request, res: Response): ConfigEntity | null {
    const { entity } = req.params;
    if (!entity || !isConfigEntity(entity)) {
      res.status(400).json({
        message: `Invalid entity. Must be one of: ${CONFIG_ENTITIES.join(', ')}`,
      });
      return null;
    }
    return entity;
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const entity = this.parseEntity(req, res);
    if (!entity) return;
    const db = await this.db();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (db as any)[modelForEntity(entity)].findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ data: rows, message: `${labelForEntity(entity)}s retrieved` });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const entity = this.parseEntity(req, res);
    if (!entity) return;
    const { name, key, description, color, iconKey, managerName, leadName, squadId, sortOrder, isActive, createdBy } = req.body;

    if (!name?.trim()) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    const db = await this.db();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (db as any)[modelForEntity(entity)].create({
      data: {
        name: name.trim(),
        key: (key?.trim() || toKey(name)).trim(),
        description: description?.trim() ?? '',
        color: color?.trim() || '#6366f1',
        ...((entity === 'squad' || entity === 'team') && iconKey !== undefined
          ? { iconKey: iconKey?.trim() || null }
          : {}),
        managerName: managerName?.trim() || null,
        leadName: leadName?.trim() || null,
        ...(entity === 'team'
          ? { squadId: typeof squadId === 'number' ? squadId : null }
          : {}),
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        isActive: isActive ?? true,
        createdBy: createdBy ?? null,
      },
    });

    res.status(201).json({ data: row, message: `${labelForEntity(entity)} created` });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const entity = this.parseEntity(req, res);
    if (!entity) return;
    const id = parseInt(req.params.id, 10);
    const { name, key, description, color, iconKey, managerName, leadName, squadId, sortOrder, isActive, updatedBy } = req.body;

    const db = await this.db();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbModel = (db as any)[modelForEntity(entity)];

    const existing = await dbModel.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: `${labelForEntity(entity)} not found` });
      return;
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (key !== undefined) data.key = key;
    if (description !== undefined) data.description = description;
    if (color !== undefined) data.color = color;
    if ((entity === 'squad' || entity === 'team') && iconKey !== undefined) {
      data.iconKey = iconKey?.trim() || null;
    }
    if (managerName !== undefined) data.managerName = managerName?.trim() || null;
    if (leadName !== undefined) data.leadName = leadName?.trim() || null;
    if (entity === 'team' && squadId !== undefined) {
      data.squadId = typeof squadId === 'number' ? squadId : null;
    }
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (isActive !== undefined) data.isActive = isActive;
    if (updatedBy !== undefined) data.updatedBy = updatedBy;

    const row = await dbModel.update({ where: { id }, data });
    res.json({ data: row, message: `${labelForEntity(entity)} updated` });
  };

  toggle = async (req: Request, res: Response): Promise<void> => {
    const entity = this.parseEntity(req, res);
    if (!entity) return;
    const id = parseInt(req.params.id, 10);
    const db = await this.db();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbModel = (db as any)[modelForEntity(entity)];

    const existing = await dbModel.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: `${labelForEntity(entity)} not found` });
      return;
    }

    const row = await dbModel.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
        updatedBy: req.body?.updatedBy ?? null,
      },
    });
    res.json({ data: row, message: `${labelForEntity(entity)} toggled` });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const entity = this.parseEntity(req, res);
    if (!entity) return;
    const id = parseInt(req.params.id, 10);
    const db = await this.db();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any)[modelForEntity(entity)].delete({ where: { id } });
    res.json({ message: `${labelForEntity(entity)} deleted` });
  };
}
