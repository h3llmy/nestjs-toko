import { TestBed } from '@automock/jest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role, User } from './entities/user.entity';
import { IPaginationResponse, SortDirection } from '@app/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser: User = {
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerifiedAt: Date.now(),
    password: 'some hashed password',
    role: Role.USER,
  };

  const mockUsersPagination: IPaginationResponse<User> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockUser],
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    usersController = unit;
    usersService = unitRef.get(UsersService);
  });
  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('findAllPagination', () => {
    it('should be defined', () => {
      expect(usersController.findAllPagination).toBeDefined();
    });
    it('should get list user with pagination', async () => {
      usersService.findAllPagination.mockResolvedValue(mockUsersPagination);
      const users = await usersController.findAllPagination({
        page: 1,
        limit: 10,
        order: {
          createdAt: SortDirection.ASC,
        },
        search: 'test',
      });
      expect(users).toEqual(mockUsersPagination);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(usersController.findOne).toBeDefined();
    });
    it('should get a user by id', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      const user = await usersController.findOne(mockUser.id);
      expect(user).toEqual(mockUser);
    });
    it('should throw NotFoundException when user not found', async () => {
      usersService.findOne.mockResolvedValue(null);
      await expect(usersController.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('detailProfile', () => {
    it('should be defined', () => {
      expect(usersController.detailProfile).toBeDefined();
    });
    it('should get a user by id', () => {
      const user = usersController.detailProfile(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(usersController.update).toBeDefined();
    });
    it('should update a user', async () => {
      usersService.update.mockResolvedValue(mockUser);
      const user = await usersController.update(mockUser, mockUser);
      expect(user.message).toBeDefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      usersService.update.mockResolvedValue(null);
      await expect(usersController.update(mockUser, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(usersController.delete).toBeDefined();
    });
    it('should delete a user', async () => {
      usersService.deleteById.mockResolvedValue({ raw: [], affected: 1 });
      const user = await usersController.delete(mockUser.id);
      expect(user.message).toBeDefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      usersService.deleteById.mockRejectedValue(new NotFoundException());
      await expect(usersController.delete(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
