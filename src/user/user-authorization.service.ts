import { Service } from 'typedi';
import { UserService } from './user.service';
import { HttpError } from 'routing-controllers';
import { HttpCode } from '../infrastructure/http-code.enum';

@Service()
export class UserAuthorizationService {
  /**
   * UserAuthorizationService constructor.
   *
   * @param userService
   */
  constructor(
    private readonly userService: UserService,
  ) {}

  /**
   * Validate for registration.
   *
   * @param login
   */
  public async validateForRegister(login: string): Promise<void> {
    if (await this.userService.getUserByLogin(login)) {
      throw new HttpError(HttpCode.CONFLICT, `Login '${login}' is reserved.`);
    }
  }
}
