import { Container, Service } from 'typedi';
import { User } from '../user/user.entity';
import { Action, HttpError } from 'routing-controllers';
import { TokenService } from './token/token.service';
import { Token } from './token/token.entity';
import { UserService } from '../user/user.service';
import { HttpCode } from '../infrastructure/http-code.enum';

type AuthSettings = {
  authService: AuthService,
  tokenFromHeader: string,
};

@Service()
export class AuthService {
  /**
   * AuthService constructor.
   *
   * @param userService
   * @param tokenService
   * @param tokenLifetime
   */
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly tokenLifetime = Number(process.env.TOKEN_LIFETIME || 24 * 60 * 60),
  ) {}

  /**
   * Authenticate user and get token.
   *
   * @param {string} login
   * @param {string} password
   */
  public async authenticateUser(login: string, password: string): Promise<Token> {
    const user = await this.userService.getUserByCredentials(login, password);

    if (!user) {
      throw new HttpError(HttpCode.UNAUTHORIZED);
    }

    return this.tokenService.generateToken(user);
  }

  /**
   * Check token.
   *
   * @param {string} value
   */
  public async checkToken(value: string): Promise<boolean> {
    const token = await this.tokenService.getActiveTokenByValue(value);

    return !!token;
  }

  /**
   * Get user by active token.
   *
   * @param {string} value
   */
  public async getUserByToken(value: string): Promise<User | undefined> {
    const token = await this.tokenService.getActiveTokenByValue(value);

    if (!token) {
      return undefined;
    }

    return token.user;
  }

  /**
   * Get auth service and token from HTTP header.
   *
   * @param action
   */
  public static getAuthSettings(action: Action): AuthSettings {
    return {
      authService: Container.get(AuthService),
      tokenFromHeader: action.request.headers['authorization'],
    }
  }

  /**
   * Check authorization.
   *
   * @param action
   * @param roles
   */
  public static checkAuth(action: Action, roles: string[]): Promise<boolean> {
    const { authService, tokenFromHeader } = AuthService.getAuthSettings(action);

    return authService.checkToken(tokenFromHeader);
  }

  /**
   * Get current user.
   *
   * @param action
   */
  public static getCurrentUser(action: Action): Promise<User | undefined> {
    const { authService, tokenFromHeader } = AuthService.getAuthSettings(action);

    return authService.getUserByToken(tokenFromHeader);
  }
}
