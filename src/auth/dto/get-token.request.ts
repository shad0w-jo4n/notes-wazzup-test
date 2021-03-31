import { IsNotEmpty } from 'class-validator';

export class GetTokenRequest {
  @IsNotEmpty()
  public login!: string;

  @IsNotEmpty()
  public password!: string;
}
