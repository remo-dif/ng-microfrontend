import { InjectionToken } from '@angular/core';

export interface PlatformConfig {
  readonly apiBaseUrl: string;
  readonly production: boolean;
}

export const PLATFORM_CONFIG = new InjectionToken<PlatformConfig>(
  'PLATFORM_CONFIG'
);

export const defaultPlatformConfig: PlatformConfig = {
  apiBaseUrl: '/api',
  production: false,
};
