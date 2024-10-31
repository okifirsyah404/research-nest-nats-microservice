/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AccountEntity } from '../entities/acccount.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { UserEntity } from '../entities/user.entity';
import { loadDicebearModules } from './loader/dicebear.loader';

expand(dotenv.config());

export default class InitialSeeder implements Seeder {
  track?: boolean;

  private readonly userImageDir = path.join(
    process.cwd(),
    'apps',
    'api',
    'public',
    'user',
  );

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding User Service initial data... 🌱');

    await dataSource.query('TRUNCATE "accounts" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "profiles" RESTART IDENTITY CASCADE;');

    const accountRepo = dataSource.getRepository(AccountEntity);
    const profileRepo = dataSource.getRepository(ProfileEntity);
    const userRepo = dataSource.getRepository(UserEntity);

    const bcryptSalt = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

    const account = await accountRepo.insert([
      {
        email: 'johndoe@example.com',
        password: bcrypt.hashSync('johndoe@example.com', bcryptSalt),
      },
    ]);

    const profile = await profileRepo.insert([
      {
        name: 'John Doe',
        phoneNumber: '1234567890',
        address: '123 Main St',
        bio: 'I am John Doe',
      },
    ]);

    const user = await userRepo.insert([
      {
        accountId: account.identifiers[0].id,
        profileId: profile.identifiers[0].id,
      },
    ]);

    this._removeFilesInDirectory(this.userImageDir);

    await this._generateAvatar({
      seed: 'John Doe',
      key: user.identifiers[0].id,
    }).then(async (generatedAvatar) => {
      await profileRepo.update(
        { id: profile.identifiers[0].id },
        { image: generatedAvatar.url },
      );
    });

    this._generateRawOrderSeeder(user.identifiers[0].id);

    for (let i = 0; i < 10; i++) {
      const email = faker.internet.email();
      const name = faker.person.fullName();

      const accountDummy = await accountRepo.insert([
        {
          email,
          password: bcrypt.hashSync(email, bcryptSalt),
        },
      ]);

      const profileDummy = await profileRepo.insert([
        {
          name: name,
          phoneNumber: faker.phone.number(),
          address: faker.location.streetAddress(),
          bio: faker.person.bio(),
        },
      ]);

      const userDummy = await userRepo.insert([
        {
          accountId: accountDummy.identifiers[0].id,
          profileId: profileDummy.identifiers[0].id,
        },
      ]);

      await this._generateAvatar({
        seed: name,
        key: userDummy.identifiers[0].id,
      }).then(async (generatedAvatarDummy) => {
        await profileRepo.update(
          { id: profileDummy.identifiers[0].id },
          { image: generatedAvatarDummy.url },
        );
      });
    }

    console.log('User Service initial data seeded! 🌱');
  }

  private async _generateAvatar(data: { seed: string; key: string }): Promise<{
    url: string;
    key: string;
  }> {
    const { initials, toPng, createAvatar } = await loadDicebearModules();

    const avatar = createAvatar(initials, {
      seed: data.seed,
      size: 120,
    });

    this._checkDirectory(this.userImageDir);

    const raster = toPng(avatar.toString());

    await new Promise((resolve) => setTimeout(resolve, 200));

    const buffer = Buffer.from(await raster.toArrayBuffer());
    fs.writeFileSync(path.join(this.userImageDir, `${data.key}.png`), buffer);

    return {
      url: `http://localhost:54251/public/user/${data.key}.png`,
      key: `${data.key}.png`,
    };
  }

  private _generateRawOrderSeeder(userId: string): void {
    const rawOrderSeederPath = path.join(
      process.cwd(),
      'apps',
      'order',
      'src',
      'database',
      'seeders',
      'raw',
    );

    this._checkDirectory(rawOrderSeederPath);

    fs.writeFileSync(
      path.join(rawOrderSeederPath, 'order-user-id.json'),
      JSON.stringify({
        userId: userId,
      }),
    );
  }

  private _checkDirectory(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private _removeFilesInDirectory(dir: string): void {
    fs.readdirSync(dir).forEach((file) => {
      fs.rmSync(path.join(dir, file));
    });
  }
}
