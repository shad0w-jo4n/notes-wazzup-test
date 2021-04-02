import { Body, JsonController, Post } from 'routing-controllers';
import { CreateUserRequest } from './dto/create-user.request';
import { UserService } from './user.service';
import { Service } from 'typedi';
import { CreateUserResponse } from './dto/create-user.response';
import { UserAuthorizationService } from './user-authorization.service';

@Service()
@JsonController('/user')
export class UserController {
  /**
   * UserController constructor.
   *
   * @param userService
   * @param userAuthorizationService
   */
  constructor(
    private readonly userService: UserService,
    private readonly userAuthorizationService: UserAuthorizationService,
  ) {}

  /**
   * Register user.
   *
   * @param createUserRequest
   */
  @Post()
  public async create(@Body() createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
    await this.userAuthorizationService.validateForRegister(createUserRequest.login);

    const user = await this.userService.register(createUserRequest.login, createUserRequest.password);

    return CreateUserResponse.buildFromUser(user);
  }
}
