import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password, phoneNumber }: CreateAuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new ConflictException('user already exists');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        phoneNumber,
      },
    });
  }

  async authenticate({ email, password }: AuthenticateDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET);

    return {
      accessToken,
    };
  }
}
