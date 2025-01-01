import { IAccount } from '@contracts/entities/user/account.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'apps/user/src/database/entities/acccount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createAccount(account: IAccount): Promise<IAccount> {
    const result: IAccount = await this.repository.save(account);
    return result;
  }

  async findOneByEmail(email: string): Promise<IAccount | null> {
    const result = await this.repository.findOne({
      where: {
        email,
      },
      relations: ['user'],
    });

    return result || null;
  }
}
