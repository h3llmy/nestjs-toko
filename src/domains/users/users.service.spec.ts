import { TestBed } from '@automock/jest';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IPaginationResponse } from '@libs/database';
import { Role } from '@domains/roles/entities/role.entity';
import { SocialAuthType } from '@domains/auth/social-auth.enum';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockUser: User = {
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerifiedAt: Date.now(),
    password: 'some hashed password',
    role: mockRole,
  };

  const mockUsersPagination: IPaginationResponse<User> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockUser],
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();

    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should get list user with pagination', async () => {
      userRepository.findPagination.mockResolvedValue(mockUsersPagination);

      const users = await userService.findAllPagination({
        page: 1,
        limit: 10,
      });

      expect(userRepository.findPagination).toHaveBeenCalled();
      expect(users).toEqual(mockUsersPagination);
    });
  });

  describe('findOne', () => {
    it('should get a user by id', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const user = await userService.findOne('1');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        relations: undefined,
        where: { id: '1' },
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should get a user by email', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const user = await userService.findOneByEmail(mockUser.email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        select: [
          'id',
          'email',
          'username',
          'emailVerifiedAt',
          'password',
          'role',
        ],
      });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if no user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOneByEmail(mockUser.email)).rejects.toThrow(
        NotFoundException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        select: [
          'id',
          'email',
          'username',
          'emailVerifiedAt',
          'password',
          'role',
        ],
      });
    });
  });

  describe('findOneBySocialId', () => {
    it('should get a user by social id', async () => {
      const mockUserSocial: User = {
        ...mockUser,
        socialId: '1',
        socialType: SocialAuthType.GOOGLE,
      };
      userRepository.findOne.mockResolvedValue(mockUserSocial);

      const user = await userService.findOneBySocialId(
        SocialAuthType.GOOGLE,
        '1',
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          socialId: mockUserSocial.socialId,
          socialType: mockUserSocial.socialType,
        },
      });
      expect(user).toEqual(mockUserSocial);
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      userRepository.save.mockResolvedValue(mockUser);

      const user = await userService.register({
        username: 'Test User',
        email: 'test@example.com',
        password: 'some hashed password',
        confirmPassword: 'some hashed password',
      });

      expect(userRepository.save).toHaveBeenCalledWith({
        username: 'Test User',
        email: 'test@example.com',
        password: 'some hashed password',
        confirmPassword: 'some hashed password',
      });
      expect(user).toEqual(mockUser);
    });

    it('should throw BadRequestException if user already exist', async () => {
      userRepository.save.mockRejectedValue(
        new BadRequestException('email test@example.com is already in used'),
      );

      await expect(
        userService.register({
          username: 'Test User',
          email: 'test@example.com',
          password: 'some hashed password',
          confirmPassword: 'some hashed password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerSocial', () => {
    it('should create a new user', async () => {
      userRepository.save.mockResolvedValue(mockUser);

      const user = await userService.registerSocial({
        username: 'Test User',
        email: 'test@example.com',
        socialId: '1',
        socialType: SocialAuthType.GOOGLE,
      });

      expect(userRepository.save).toHaveBeenCalledWith({
        username: 'Test User',
        email: 'test@example.com',
        socialId: '1',
        socialType: SocialAuthType.GOOGLE,
      });
      expect(user).toEqual(mockUser);
    });

    it('should throw BadRequestException if user already exist', async () => {
      userRepository.save.mockRejectedValue(
        new BadRequestException('email test@example.com is already in used'),
      );

      await expect(
        userService.registerSocial({
          username: 'Test User',
          email: 'test@example.com',
          socialId: '1',
          socialType: SocialAuthType.GOOGLE,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, username: 'Updated User' };
      userRepository.updateAndFind.mockResolvedValue(updatedUser);

      const user = await userService.update('1', { username: 'Updated User' });

      expect(userRepository.updateAndFind).toHaveBeenCalledWith(
        { id: '1' },
        { username: 'Updated User' },
      );
      expect(user).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      userRepository.softDelete.mockResolvedValue({
        raw: [],
        affected: 1,
        generatedMaps: [],
      });

      const user = await userService.deleteById('1');

      expect(userRepository.softDelete).toHaveBeenCalled();
      expect(user).toEqual({
        raw: [],
        affected: 1,
        generatedMaps: [],
      });
    });

    it("should throw not found if user doesn't exist", async () => {
      userRepository.softDelete.mockResolvedValue({
        raw: [],
        affected: 0,
        generatedMaps: [],
      });
      await expect(userService.deleteById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
