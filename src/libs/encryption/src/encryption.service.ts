import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class EncryptionService {
  /**
   * Hashes a password or buffer using bcrypt.
   *
   * @param password - The password or buffer to be hashed.
   * @returns The hashed password as a string.
   *
   * @example
   * ```ts
   * const hashedPassword = encryptService.hash('myPassword');
   * console.log(hashedPassword);
   * ```
   */
  hash(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Compares a password or buffer with a hashed password using bcrypt.
   *
   * @param password - The password or buffer to compare.
   * @param hashedPassword - The hashed password to compare against.
   * @returns True if the password matches the hashed password, otherwise false.
   *
   * @example
   * ```ts
   * const isMatch = encryptService.match('myPassword', hashedPassword);
   * console.log(isMatch); // true or false
   * ```
   */
  match(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
