/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Config } from '@circleci/circleci-config-sdk';
import { BridgeCompatibilityTestsWorkflow } from '../workflows';
import { CircleCIEnvironment } from './circleci-environment';

export function generateBridgeCompatibilityTestsConfig(environment: CircleCIEnvironment): Config {
  const dynamicConfig = new Config();
  const workflow = BridgeCompatibilityTestsWorkflow.create(dynamicConfig, environment);
  dynamicConfig.addWorkflow(workflow);
  return dynamicConfig;
}