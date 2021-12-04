import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { buildForge } from 'app-builder-lib';
import type { ForgePlatform } from '@electron-forge/shared-types';
import type {
  Configuration,
  PackagerOptions,
  TargetConfigType,
} from 'app-builder-lib';

function handlerTarget(targets: TargetConfigType, defaultArch: string) {
  if (!targets) return [];
  const target = Array.isArray(targets) ? targets : [targets];
  return [
    ...new Set(
      target.map((t) =>
        typeof t === 'string'
          ? `${t}:${defaultArch}`
          : `${t.target}:${t.arch || defaultArch}`
      )
    ),
  ];
}

export default class MakerBuilder extends MakerBase<Configuration> {
  name = 'builder';

  defaultPlatforms: ForgePlatform[] = ['darwin', 'linux', 'win32'];

  isSupportedOnCurrentPlatform() {
    return true;
  }

  async make(forgeOptions: MakerOptions): Promise<string[]> {
    const { targetPlatform, targetArch } = forgeOptions;

    const { win, mac, linux } = this.config;
    const options: PackagerOptions = { config: this.config };

    if (targetPlatform === 'darwin' && mac && mac.target) {
      options.mac = handlerTarget(mac.target, targetArch);
    }
    if (targetPlatform === 'linux' && linux && linux.target) {
      options.linux = handlerTarget(linux.target, targetArch);
    }
    if (targetPlatform === 'win32' && win && win.target) {
      options.win = handlerTarget(win.target, targetArch);
    }

    return buildForge(forgeOptions, { ...options });
  }
}
