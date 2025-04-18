import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repositories/user.repository';

describe('AuthService', () => {
  let service: AuthService;

 const mockUserRepository = {
  saveOne: jest.fn(),
  findOne: jest.fn(),
 }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,JwtService,UserService,{
        provide: UserRepository,
        useValue: mockUserRepository
        ,
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
