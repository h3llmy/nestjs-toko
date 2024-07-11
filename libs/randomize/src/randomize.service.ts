import { randomBytes, randomInt } from 'crypto';

export class RandomizeService {
  /**
   * Generates a random string of numbers with a specified length.
   *
   * @param {number} length - The length of the generated string. Defaults to 6.
   * @return {string} The random string of numbers.
   */
  public stringNumber(length: number = 6): string {
    const max = Math.pow(10, length);
    const randomNumber =
      parseInt(
        randomBytes(Math.ceil(Math.log10(max) / 2)).toString('hex'),
        16,
      ) % max;

    return randomNumber.toString().padStart(length, '0');
  }

  /**
   * Generates a random lowercase string of specified length.
   *
   * @param {number} length - The length of the generated string. Defaults to 6.
   * @return {string} The random lowercase string.
   */
  public lowercaseString(length: number = 6): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  /**
   * Generates a random uppercase string of specified length.
   *
   * @param {number} length - The length of the generated string. Defaults to 6.
   * @return {string} The random uppercase string.
   */
  public uppercaseString(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  /**
   * Generates a random string of specified length.
   *
   * @param {number} length - The length of the generated string. Defaults to 10.
   * @return {string} The random string.
   */
  public random(length: number = 10): string {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';

    let randomString = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, charactersLength);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  /**
   * Generates a random number of the specified length.
   *
   * @param {number} length - The length of the generated number. Defaults to 6.
   * @return {number} The random number.
   */
  public number(length: number = 6): number {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length);

    const randomNumber = randomInt(min, max);

    return randomNumber;
  }
}
