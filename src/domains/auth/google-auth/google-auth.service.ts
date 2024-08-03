import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthLoginDto } from './dto/google-auth-login.dto';
import { GoogleAuthLoginResponseDto } from './dto/google-auth-login-response.dto';

@Injectable()
export class GoogleAuthService {
  private google: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.google = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    );
  }

  /**
   * Retrieves the profile information of a user by verifying their Google authentication token.
   *
   * @param {GoogleAuthLoginDto} loginDto - The DTO containing the Google authentication token.
   * @return {Promise<GoogleAuthLoginResponseDto>} A promise that resolves to the user's profile information.
   * @throws {UnauthorizedException} If the authentication token is invalid or expired.
   * @throws {BadRequestException} If there is an error verifying the authentication token.
   */
  async getProfile(
    loginDto: GoogleAuthLoginDto,
  ): Promise<GoogleAuthLoginResponseDto> {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: loginDto.token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const profile = ticket.getPayload();

      if (!profile) throw new UnauthorizedException('Unauthorized');

      return {
        id: profile.sub,
        email: profile.email,
        username: profile.name,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Invalid Google token');
    }
  }
}
