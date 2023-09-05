import { commands, parameters, reusable } from '@circleci/circleci-config-sdk';
import { config } from '../config';

export class RestoreMavenJobCacheCommand {
  private static commandName = 'cmd-restore-maven-job-cache';

  private static customParametersList = new parameters.CustomParametersList([
    new parameters.CustomParameter('jobName', 'string', '', 'The job name'),
  ]);

  public static get(): reusable.ReusableCommand {
    return new reusable.ReusableCommand(
      RestoreMavenJobCacheCommand.commandName,
      [
        new commands.cache.Restore({
          keys: [
            `${config.cache.prefix}-<< parameters.jobName >>-{{ .Branch }}-{{ checksum "pom.xml" }}`,
            `${config.cache.prefix}-<< parameters.jobName >>-{{ .Branch }}`,
            `${config.cache.prefix}-<< parameters.jobName >>`,
          ],
        }),
      ],
      RestoreMavenJobCacheCommand.customParametersList,
      'Restore Maven cache for a dedicated job',
    );
  }
}