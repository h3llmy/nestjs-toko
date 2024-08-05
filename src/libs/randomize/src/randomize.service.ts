import { randomBytes, randomInt } from 'crypto';

export class RandomizeService {
  private lowercaseCharacter: string = 'abcdefghijklmnopqrstuvwxyz';

  private uppercaseCharacter: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  private numberCharacter: string = '0123456789';

  private symbolCharacter: string = '!@#$%^&*()_+[]{}|;:,.<>?';

  private mixCharacter: string = `${this.lowercaseCharacter}
    ${this.uppercaseCharacter}
    ${this.numberCharacter}
    ${this.symbolCharacter}`;

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
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, this.lowercaseCharacter.length);
      randomString += this.lowercaseCharacter.charAt(randomIndex);
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
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, this.uppercaseCharacter.length);
      randomString += this.uppercaseCharacter.charAt(randomIndex);
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
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, this.mixCharacter.length);
      randomString += this.mixCharacter.charAt(randomIndex);
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
