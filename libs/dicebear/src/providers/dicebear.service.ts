import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DICE_BEAR_OPTION } from '../constants/dicebear-di.constant';
import { loadDicebearModules } from '../esm_loader/dicebear.loader';
import {
  DiceBearOptions,
  IDiceBear,
  IDiceBearGenerateParams,
} from '../interfaces/dicebear.interface';

@Injectable()
export class DiceBearService {
  constructor(
    @Inject(DICE_BEAR_OPTION)
    private readonly options: DiceBearOptions,
  ) {}

  private readonly dirPath = path.join(process.cwd(), 'public', 'user');

  async generateAvatar(data: IDiceBearGenerateParams): Promise<IDiceBear> {
    const { initials, toPng, createAvatar } = await loadDicebearModules();

    const avatar = createAvatar(initials, {
      seed: data.seed,
      backgroundRotation: this.options.styleOptions?.backgroundRotation,
      size: this.options.styleOptions?.size || 120,
      backgroundType: this.options.styleOptions?.backgroundType,
      radius: this.options.styleOptions?.radius,
    });

    this._checkDirectory();

    const raster = toPng(avatar.toString());

    await new Promise((resolve) => setTimeout(resolve, 200));

    const buffer = Buffer.from(await raster.toArrayBuffer());
    fs.writeFileSync(path.join(this.dirPath, `${data.key}.png`), buffer);

    return {
      path: path
        .relative(process.cwd(), path.join(this.dirPath, `${data.key}.png`))
        .replace(/\\/g, '/'), // Change separator from \\ to /
      key: `${data.key}.png`,
    };
  }

  private _checkDirectory(): void {
    if (!fs.existsSync(this.dirPath)) {
      fs.mkdirSync(this.dirPath, { recursive: true });
    }
  }
}
