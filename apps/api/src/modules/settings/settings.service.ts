import { prisma } from '../../lib/prisma.js';
import { settingDefinitions, type SettingDefinition, type SettingGroup, type SettingValue } from './settings.definitions.js';

type SettingRecord = SettingDefinition & { value: SettingValue; source: 'database' | 'default' };

function maskValue(value: SettingValue, isSecret?: boolean): SettingValue {
  if (!isSecret) return value;
  if (value === null || value === undefined || value === '') return '';
  return '********';
}

export async function ensureSystemSettings() {
  for (const setting of settingDefinitions) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        group: setting.group,
        label: setting.label,
        description: setting.description,
        valueJson: setting.defaultValue as never,
        isSecret: Boolean(setting.isSecret),
        isEditable: setting.isEditable !== false
      }
    });
  }
}

export async function listSettings(group?: SettingGroup): Promise<SettingRecord[]> {
  const dbRows = await prisma.systemSetting.findMany({
    where: group ? { group } : undefined,
    orderBy: [{ group: 'asc' }, { label: 'asc' }]
  });
  const rowByKey = new Map(dbRows.map((row) => [row.key, row]));

  return settingDefinitions
    .filter((setting) => !group || setting.group === group)
    .map((definition) => {
      const row = rowByKey.get(definition.key);
      const value = row ? row.valueJson as SettingValue : definition.defaultValue;
      return {
        ...definition,
        value: maskValue(value, row?.isSecret ?? definition.isSecret),
        source: row ? 'database' : 'default',
        isSecret: row?.isSecret ?? definition.isSecret,
        isEditable: row?.isEditable ?? definition.isEditable
      };
    });
}

export async function getSettingValue<T extends SettingValue = SettingValue>(key: string, fallback?: T): Promise<T> {
  try {
    const row = await prisma.systemSetting.findUnique({ where: { key } });
    if (row) return row.valueJson as T;
  } catch {
    // Database may not be migrated yet. Use fallback or definition default.
  }

  const definition = settingDefinitions.find((item) => item.key === key);
  return (definition?.defaultValue ?? fallback ?? null) as T;
}

export async function updateSetting(input: { key: string; value: SettingValue; updatedBy?: string }) {
  const definition = settingDefinitions.find((item) => item.key === input.key);
  if (!definition) throw new Error(`Unknown setting key: ${input.key}`);
  if (definition.isEditable === false) throw new Error(`Setting is not editable: ${input.key}`);

  return prisma.systemSetting.upsert({
    where: { key: input.key },
    update: { valueJson: input.value as never, updatedBy: input.updatedBy },
    create: {
      key: definition.key,
      group: definition.group,
      label: definition.label,
      description: definition.description,
      valueJson: input.value as never,
      isSecret: Boolean(definition.isSecret),
      isEditable: definition.isEditable !== false,
      updatedBy: input.updatedBy
    }
  });
}
