import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { buildForge } from 'app-builder-lib';
import type { ForgePlatform } from '@electron-forge/shared-types';
import type {
  Configuration,
  PackagerOptions,
  TargetConfigType,
} from 'app-builder-lib';

function createTargets(targets: TargetConfigType, arch: string) {
  if (!targets) return [];
  const result = new Set<string>()
  const targetList = Array.isArray(targets) ? targets : [targets];

  targetList.forEach((t) => {
    if (typeof t === 'string') {
      result.add(`${t}:${arch}`);
    } else if (t.arch) {
      const list: string[] = Array.isArray(t.arch) ? t.arch : [t.arch];
      if (list.includes(arch)) {
        result.add(`${t.target}:${arch}`);
      }
    } else {
      result.add(`${t.target}:${arch}`);
    }
  })

  return [...result];
}
export default class MakerBuilder extends MakerBase<Configuration> {
  name = 'builder';

  defaultPlatforms: ForgePlatform[] = ['darwin', 'linux', 'win32'];

  isSupportedOnCurrentPlatform() {
    return ['darwin', 'linux', 'win32'].includes(process.platform);
  }

  async make(forgeOptions: MakerOptions) {
    const { targetPlatform, targetArch } = forgeOptions;

    const { win, mac, linux } = this.config;
    const options: PackagerOptions = { config: this.config };

    if (targetPlatform === 'darwin' && mac && mac.target) {
      options.mac = createTargets(mac.target, targetArch);
    }
    if (targetPlatform === 'linux' && linux && linux.target) {
      options.linux = createTargets(linux.target, targetArch);
    }
    if (targetPlatform === 'win32' && win && win.target) {
      options.win = createTargets(win.target, targetArch);
    }

    return buildForge(forgeOptions, options)
  }
}
