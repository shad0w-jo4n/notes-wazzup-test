import { Service } from 'typedi';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { HttpError } from 'routing-controllers';

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
    const user = this.userRepository.create();

    user.login = login;
    user.password = await bcrypt.hash(password, 16);

    return this.userRepository.save(user);
  }

  /**
   * Get user by credentials.
   *
   * @param {string} login
   * @param {string} password
   */
  public async getUserByCredentials(login: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByLogin(login);

    if (!user) {
      return undefined;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return undefined;
    }

    return user;
  }
}
