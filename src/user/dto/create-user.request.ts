import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  public login!: string;

  @Length(6)
  public password!: string;
}
