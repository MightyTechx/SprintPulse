import { Request, Response } from 'express';

const toKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

const parseRoles = (roles: string) => {
  try {
    return JSON.parse(roles);
  } catch {
    return ['Admin'];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseFlag = (flag: any) => ({ ...flag, roles: parseRoles(flag.roles) });

export class FeatureFlagsController {
  // prisma is exported as Promise<PrismaClient> from @infygen/database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private prismaPromise: any) {}

  // Resolves the promise and returns the PrismaClient
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async db(): Promise<any> {
    return await this.prismaPromise;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const db = await this.db();
    const flags = await db.featureFlag.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: flags.map(parseFlag), message: 'Feature flags retrieved' });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, key, description, environment, status, roles, createdBy } = req.body;

    if (!name?.trim()) {
      res.status(400).json({ message: 'Flag name is required' });
      return;
    }

    const db = await this.db();
    const flag = await db.featureFlag.create({
      data: {
        name: name.trim(),
        key: (key?.trim() || toKey(name)).trim(),
        description: description?.trim() ?? '',
        environment: environment ?? 'Development',
        status: status ?? 'Disabled',
        roles: JSON.stringify(Array.isArray(roles) && roles.length ? roles : ['Admin']),
        createdBy: createdBy ?? null,
      },
    });

    res.status(201).json({ data: parseFlag(flag), message: 'Feature flag created' });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const { name, key, description, environment, status, roles, updatedBy } = req.body;

    const db = await this.db();
    const existing = await db.featureFlag.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ message: 'Feature flag not found' });
      return;
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (key !== undefined) data.key = key;
    if (description !== undefined) data.description = description;
    if (environment !== undefined) data.environment = environment;
    if (updatedBy !== undefined) data.updatedBy = updatedBy;

    // Handle status update with auto-role for nav flags
    if (status !== undefined) {
      const isEnabling = status === 'Enabled';
      let currentRoles = roles ?? parseRoles(existing.roles);

      // Auto-add Consultant role for nav-related flags when enabling
      if (isEnabling && existing.key.startsWith('nav_') && !currentRoles.includes('Consultant')) {
        currentRoles = [...currentRoles, 'Consultant'];
      }

      data.status = status;
      data.roles = JSON.stringify(currentRoles);
    } else if (roles !== undefined) {
      data.roles = JSON.stringify(roles);
    }

    const flag = await db.featureFlag.update({ where: { id }, data });
    res.json({ data: parseFlag(flag), message: 'Feature flag updated' });
  };

  toggle = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const db = await this.db();
    const existing = await db.featureFlag.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ message: 'Feature flag not found' });
      return;
    }

    const isEnabling = existing.status !== 'Enabled';
    let roles = parseRoles(existing.roles);

    // Auto-add Consultant role for nav-related flags when enabling
    if (isEnabling && existing.key.startsWith('nav_') && !roles.includes('Consultant')) {
      roles = [...roles, 'Consultant'];
    }

    const flag = await db.featureFlag.update({
      where: { id },
      data: {
        status: isEnabling ? 'Enabled' : 'Disabled',
        roles: JSON.stringify(roles),
        updatedBy: req.body.updatedBy ?? null,
      },
    });

    res.json({ data: parseFlag(flag), message: 'Feature flag toggled' });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const db = await this.db();
    await db.featureFlag.delete({ where: { id } });
    res.json({ message: 'Feature flag deleted' });
  };
}
