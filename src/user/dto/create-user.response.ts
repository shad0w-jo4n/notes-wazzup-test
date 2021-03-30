import { User } from '../user.entity';

export class CreateUserResponse {
  public id!: number;

  public login!: string;

  public createdAt!: Date;

  public static buildFromUser(user: User): CreateUserResponse {
    const response = new CreateUserResponse();

    response.id = user.id;
    response.login = user.login;
    response.createdAt = user.createdAt;

    return response;
  }
}
