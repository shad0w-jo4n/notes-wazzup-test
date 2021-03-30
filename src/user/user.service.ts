import { Service } from 'typedi';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { HttpError } from 'routing-controllers';
import { HttpCode } from '../infrastructure/http-code.enum';

@Service()
export class UserService {
  /**
   * UserService constructor.
   *
   * @param userRepository
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get user by his login.
   *
   * @param {string} login
   */
  public getUserByLogin(login: string): Promise<User | undefined> {
    return this.userRepository.findOne({ login });
  }

  /**
   * Register user.
   *
   * @param {string} login
   * @param {string} password
   *
   * @throws HttpError CONFLICT
   */
  public async register(login: string, password: string): Promise<User> {
    if (await this.getUserByLogin(login)) {
      /*
      MARK: Holy war about exception layer ownership.
      This implemented this way because the terms of
      reference  doesn't specify the  possibility of
      using business logic outside  of HTTP context.
       */
      throw new HttpError(HttpCode.CONFLICT, `Login '${login}' is reserved.`);
    }

    const user = this.userRepository.create();

    user.login = login;
    user.password = await bcrypt.hash(password, 16);

    return this.userRepository.save(user);
  }
}
