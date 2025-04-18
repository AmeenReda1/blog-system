import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repositories/user.repository';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    // Add mock methods as needed
    registerUser: jest.fn(),
  };
  const mockUserRepository = {
    // Add mock methods as needed
    saveOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        UserService,
        JwtService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        // Add other necessary providers
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
