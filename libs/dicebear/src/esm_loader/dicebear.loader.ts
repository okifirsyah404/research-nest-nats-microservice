/**
 * Loads the required modules from the @dicebear/collection, @dicebear/converter, and @dicebear/core packages. This function is used to load the modules asynchronously in the DiceBearService due to incompatibility with the CommonJS module system.
 */
export async function loadDicebearModules() {
    const [initialsModule, toPngModule, coreModule] = await Promise.all([
      (await eval(`import('@dicebear/collection')`)) as Promise<
        typeof import('@dicebear/collection')
      >,
      (await eval(`import('@dicebear/converter')`)) as Promise<
        typeof import('@dicebear/converter')
      >,
      (await eval(`import('@dicebear/core')`)) as Promise<
        typeof import('@dicebear/core')
      >,
    ]);
  
    return {
      initials: initialsModule.initials,
      toPng: toPngModule.toPng,
      createAvatar: coreModule.createAvatar,
    };
  }
  