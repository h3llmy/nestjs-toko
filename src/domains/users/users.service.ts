import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from '@domains/auth/basic-auth/dto/register-user.dto';
import { UserRepository } from './users.repository';
import { User } from './entities/user.entity';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { IPaginationPayload, IPaginationResponse } from '@libs/database';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  ILike,
} from 'typeorm';
import { SocialAuthType } from '@domains/auth/social-auth.enum';

/**
 * UsersService provides operations for managing user data.
 */
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Saves a new user to the database.
   *
   * @param {RegisterUserDto} createUserDto - The data for the new user.
   * @return {Promise<User>} A promise that resolves to the saved user.
   */
  async register(createUserDto: RegisterUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  /**
   * Registers a user using social authentication.
   *
   * @param {DeepPartial<User>} user - The user data to be registered.
   * @return {Promise<User>} The registered user.
   */
  async registerSocial(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   * Retrieves a paginated list of users based on the given criteria.
   *
   * @param {PaginationUserDto} paginationPayload - Data Transfer Object containing pagination and search parameters.
   * @return {Promise<IPaginationResponse<User>>} A paginated response containing the user entities.
   */
  findAllPagination(
    paginationPayload: PaginationUserDto,
  ): Promise<IPaginationResponse<User>> {
    const { search, ...paginationQuery } = paginationPayload;
    const query: IPaginationPayload<User> = {
      ...paginationQuery,
    };
    if (search) {
      query.where = {
        username: ILike(`%${search}%`),
        email: ILike(`%${search}%`),
      };
    }

    return this.userRepository.findPagination(query);
  }

  /**
   * A function to find a user by ID with optional relations.
   *
   * @param {string} id - The ID of the user to find.
   * @param {FindOptionsRelations<User>} [relations] - The relations to include in the result.
   * @return {Promise<User>} A promise that resolves to the found user.
   */
  async findOne(
    id: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: relations,
    });
    return user;
  }

  /**
   * Retrieves a user by their email.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<User>} The user entity.
   */
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'username',
        'emailVerifiedAt',
        'password',
        'role',
      ],
    });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  /**
   * Finds a user by their social ID and social type.
   *
   * @param {SocialAuthType} socialType - The social authentication type.
   * @param {string} socialId - The social ID.
   * @return {Promise<User | null>} A promise that resolves to the user object or null if not found.
   */
  findOneBySocialId(
    socialType: SocialAuthType,
    socialId: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { socialId, socialType },
    });
  }

  /**
   * Updates a user by their ID.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Partial<User>} updateUserDto - Partial user entity containing the update data.
   * @param {string} [failedMessage] - Custom error message if the update fails.
   * @returns {Promise<User>} The updated user entity.
   * @throws {BadRequestException} If the update operation fails.
   */
  async update(
    id: string,
    updateUserDto: Partial<User>,
    failedMessage?: string,
  ): Promise<User> {
    const updatedUser = await this.userRepository.updateAndFind(
      { id },
      updateUserDto,
    );
    if (!updatedUser) {
      throw new BadRequestException(
        failedMessage ?? 'Failed to update profile',
      );
    }

    return updatedUser;
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {string} id - The ID of the user to delete.
   * @return {Promise<DeleteResult>} The deleted user.
   * @throws NotFoundException if the user not found.
   */
  async deleteById(id: string): Promise<DeleteResult> {
    const deletedUser = await this.userRepository.softDelete({ id });
    if (deletedUser.affected < 1) {
      throw new NotFoundException(`user id ${id} not found`);
    }
    return deletedUser;
  }
}
