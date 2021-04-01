import { Service } from 'typedi';
import { Body, CurrentUser, JsonController, OnUndefined, Post } from 'routing-controllers';
import { AuthService } from './auth.service';
import { GetTokenRequest } from './dto/get-token.request';
import { GetTokenResponse } from './dto/get-token.response';
import { User } from '../user/user.entity';
import { HttpCode } from '../infrastructure/http-code.enum';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post()
  public async getToken(@Body() getTokenRequest: GetTokenRequest): Promise<GetTokenResponse> {
    const token = await this.authService.authenticateUser(getTokenRequest.login, getTokenRequest.password);

    return GetTokenResponse.buildFromToken(token);
  }

  @Post('/reset')
  @OnUndefined(HttpCode.OK)
  public async reset(@CurrentUser({ required: true }) user: User): Promise<void> {
    await this.authService.resetAllSessions(user);
  }
}
