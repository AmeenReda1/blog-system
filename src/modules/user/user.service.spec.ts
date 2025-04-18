import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserType } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    saveOne: jest.fn(),
    findOne: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,{
        provide: UserRepository,
        useValue: mockUserRepository
        ,
      }],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  afterEach(async()=>{
    
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a user', async () => {
    const mockUser:CreateUserDto = {
      email: 'test@test.com',
      password: 'passwordAbc#123',
      firstName: 'User first name',
      lastName: 'User last name',
      mobileNumber: '01234567890',
    }
    const returnUser:Partial<User> = {
      id: 1,
      email: 'test@test.com',
      password: 'passwordAbc#123',
      firstName: 'User first name',
      lastName: 'User last name',
      updated_at: new Date(),
      created_at: new Date(),
      deleted_at: null,
      userType: UserType.EDITOR,
      mobileNumber: '01234567890',
      blogs: [],
    }
    const saveOneSpy = jest.spyOn(mockUserRepository, 'saveOne').mockResolvedValue(returnUser);

    const user = await service.create(mockUser);
    
    expect(saveOneSpy).toHaveBeenCalledWith(expect.any(User)); 
    expect(user).toEqual(returnUser);

    saveOneSpy.mockRestore();
  });
});
