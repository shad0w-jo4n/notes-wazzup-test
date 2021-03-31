import { Token } from '../token/token.entity';

export class GetTokenResponse {
  public token!: string;

  public expiresAt!: Date;

  public static buildFromToken(token: Token): GetTokenResponse {
    const response = new GetTokenResponse();

    response.token = token.value;
    response.expiresAt = token.dueAt;

    return response;
  }
}
