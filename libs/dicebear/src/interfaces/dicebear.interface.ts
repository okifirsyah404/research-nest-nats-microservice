export type BackgroundType = 'solid' | 'gradientLinear';

export interface StyleOptions {
  size?: number;
  backgroundRotation?: number[];
  backgroundType?: BackgroundType[];
  radius?: number;
}

export interface DiceBearOptions {
  imports?: any[];
  isGlobal?: boolean;
  styleOptions?: StyleOptions;
}

export interface DiceBearAsyncOptions {
  inject?: any[];
  imports?: any[];
  isGlobal?: boolean;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<Omit<DiceBearOptions, 'isGlobal' | 'imports'>>
    | Omit<DiceBearOptions, 'isGlobal' | 'imports'>;
}

export interface IDiceBearGenerateParams {
  key: string;
  seed: string;
}

export interface IDiceBear {
  path: string;
  key: string;
}
