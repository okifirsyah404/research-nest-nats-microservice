import { DynamicModule, Module } from '@nestjs/common';
import { DICE_BEAR_OPTION } from './constants/dicebear-di.constant';
import { DiceBearOptions } from './interfaces/dicebear.interface';
import { DiceBearService } from './providers/dicebear.service';

@Module({})
export class DiceBearModule {
  static forRoot(options?: DiceBearOptions): DynamicModule {
    return {
      global: options?.isGlobal || false,
      module: DiceBearModule,
      imports: options?.imports || [],
      providers: [
        {
          provide: DICE_BEAR_OPTION,
          useValue: options,
        },
        DiceBearService,
      ],
      exports: [DiceBearService],
    };
  }
}
