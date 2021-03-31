import { Service } from 'typedi';
import { Body, JsonController, Post } from 'routing-controllers';
import { AuthService } from './auth.service';
import { GetTokenRequest } from './dto/get-token.request';
import { GetTokenResponse } from './dto/get-token.response';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/token')
  public async getToken(@Body() getTokenRequest: GetTokenRequest): Promise<GetTokenResponse> {
    const token = await this.authService.authenticateUser(getTokenRequest.login, getTokenRequest.password);

    return GetTokenResponse.buildFromToken(token);
  }
}
