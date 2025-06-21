import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsObjectIdPipe } from 'src/common/pipe/is-object-id.pipe';

@ApiBearerAuth()
@ApiTags('user-v1')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    isArray: true,
    type: [User],
    example: [
      {
        _id: '60f1b6b5b3f3b3b3b3f3b3b3',
        firstName: 'John Doe',
        lastName: 'Doe',
        email: 'example@hello.world',
      },
    ],
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: User,
    example: {
      _id: '60f1b6b5b3f3b3b3b3f3b3b3',
      firstName: 'John Doe',
      lastName: 'Doe',
      email: 'example@hello.world',
    },
  })
  @Get(':id')
  async findOne(@Param('id', IsObjectIdPipe) id: string): Promise<User> {
    return this.usersService.findOne(id) as unknown as Promise<User>;
  }
}
