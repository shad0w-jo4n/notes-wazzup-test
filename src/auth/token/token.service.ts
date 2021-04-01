import { Service } from 'typedi';
import { Raw, Repository } from 'typeorm';
import { Token } from './token.entity';
import { User } from '../../user/user.entity';
import * as uuid from 'uuid';
import moment from 'moment';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class TokenService {
  /**
   * TokenService constructor.
   *
   * @param tokenRepository
   * @param tokenLifetime
   */
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private readonly tokenLifetime = Number(process.env.TOKEN_LIFETIME || 24 * 60 * 60),
  ) {}

  /**
   * Get active token by value.
   *
   * @param value
   */
  public getActiveTokenByValue(value: string): Promise<Token | undefined> {
    return this.tokenRepository.findOne({
      value,
      isRevoked: false,
      dueAt: Raw(alias =>`${alias} > NOW()`)
    }, {
      relations: ['user'],
      loadEagerRelations: true,
    });
  }

  /**
   * Generate token for user.
   *
   * @param {User} user
   */
  public generateToken(user: User): Promise<Token> {
    const token = this.tokenRepository.create();

    token.value = uuid.v4().split('-').join('');
    token.user = user;
    token.isRevoked = false;
    token.dueAt = moment().add(this.tokenLifetime, 'seconds').toDate();

    return this.tokenRepository.save(token);
  }

  /**
   * Revoke user's tokens.
   *
   * @param {User} user
   */
  public async revokeTokens(user: User): Promise<void> {
    await this.tokenRepository.update({
      user,
    }, {
      isRevoked: true,
    });
  }
}
