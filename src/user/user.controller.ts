import { Body, JsonController, Post } from 'routing-controllers';
import { CreateUserRequest } from './dto/create-user.request';
import { UserService } from './user.service';
import { Service } from 'typedi';
import { CreateUserResponse } from './dto/create-user.response';

@Service()
@JsonController('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  public async create(@Body() createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
    const user = await this.userService.register(createUserRequest.login, createUserRequest.password);

    return CreateUserResponse.buildFromUser(user);
  }
}
