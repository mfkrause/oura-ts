import { Command } from 'commander';

import { OuraClient } from '../../client/oura-client.js';
import { decodeActivityClass, decodeMovement, decodeSleepPhases } from '../../helpers/decoders.js';
import type { DailyActivity, Sleep } from '../../types.js';
import { type GlobalOptions, getAccessToken } from '../config.js';

const RESOURCES = [
  'personal-info',
  'daily-activity',
  'daily-cardiovascular-age',
  'daily-readiness',
  'daily-resilience',
  'daily-sleep',
  'daily-spo2',
  'daily-stress',
  'enhanced-tag',
  'heartrate',
  'rest-mode-period',
  'ring-configuration',
  'session',
  'sleep',
  'sleep-time',
  'tag',
  'vo2-max',
  'workout',
] as const;

type ResourceName = (typeof RESOURCES)[number];

interface GetOptions extends GlobalOptions {
  start?: string;
  end?: string;
  decode?: boolean;
}

function resourceNameToProperty(name: ResourceName): string {
  const map: Record<ResourceName, string> = {
    'personal-info': 'personalInfo',
    'daily-activity': 'dailyActivity',
    'daily-cardiovascular-age': 'dailyCardiovascularAge',
    'daily-readiness': 'dailyReadiness',
    'daily-resilience': 'dailyResilience',
    'daily-sleep': 'dailySleep',
    'daily-spo2': 'dailySpO2',
    'daily-stress': 'dailyStress',
    'enhanced-tag': 'enhancedTag',
    'heartrate': 'heartrate',
    'rest-mode-period': 'restModePeriod',
    'ring-configuration': 'ringConfiguration',
    'session': 'session',
    'sleep': 'sleep',
    'sleep-time': 'sleepTime',
    'tag': 'tag',
    'vo2-max': 'vo2Max',
    'workout': 'workout',
  };
  return map[name];
}

function decodeData<T>(resource: ResourceName, data: T[], decode: boolean): unknown[] {
  if (!decode) {
    return data;
  }

  if (resource === 'daily-activity') {
    return (data as DailyActivity[]).map((item) => ({
      ...item,
      class_5_min_decoded: decodeActivityClass(item.class_5_min),
    }));
  }

  if (resource === 'sleep') {
    return (data as Sleep[]).map((item) => ({
      ...item,
      sleep_phase_5_min_decoded: decodeSleepPhases(item.sleep_phase_5_min),
      movement_30_sec_decoded: decodeMovement(item.movement_30_sec),
    }));
  }

  return data;
}

export function createGetCommand(): Command {
  const get = new Command('get')
    .description('Fetch data from Oura API')
    .argument('<resource>', `Resource to fetch (${RESOURCES.join(', ')})`)
    .argument('[id]', 'Document ID (for single document retrieval)')
    .option('-s, --start <date>', 'Start date (YYYY-MM-DD) or datetime for heartrate')
    .option('-e, --end <date>', 'End date (YYYY-MM-DD) or datetime for heartrate')
    .option('-d, --decode', 'Decode encoded fields (class_5_min, sleep_phase_5_min, movement_30_sec)')
    .option('--token-file <path>', 'Token file path')
    .option('--sandbox', 'Use sandbox API')
    .action(async (resource: string, id: string | undefined, options: GetOptions) => {
      if (!RESOURCES.includes(resource as ResourceName)) {
        console.error(`Unknown resource: ${resource}`);
        console.error(`Available resources: ${RESOURCES.join(', ')}`);
        process.exit(1);
      }

      const resourceName = resource as ResourceName;

      try {
        const accessToken = await getAccessToken(options);
        const client = new OuraClient({
          accessToken,
          sandbox: options.sandbox,
        });

        const propertyName = resourceNameToProperty(resourceName);
        const resourceInstance = client[propertyName as keyof OuraClient];

        let result: unknown;

        if (resourceName === 'personal-info') {
          // Personal info has only get() method
          result = await (resourceInstance as typeof client.personalInfo).get();
        } else if (id) {
          // Single document by ID
          if (resourceName === 'heartrate') {
            console.error('Heartrate resource does not support single document retrieval by ID.');
            process.exit(1);
          }
          result = await (resourceInstance as typeof client.dailyActivity).get(id);
        } else {
          // List with pagination
          if (resourceName === 'heartrate') {
            const data = await client.heartrate
              .list({
                startDatetime: options.start,
                endDatetime: options.end,
              })
              .all();
            result = data;
          } else {
            const data = await (resourceInstance as typeof client.dailyActivity)
              .list({
                startDate: options.start,
                endDate: options.end,
              })
              .all();
            result = decodeData(resourceName, data, options.decode ?? false);
          }
        }

        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return get;
}
