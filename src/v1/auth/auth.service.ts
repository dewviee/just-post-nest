import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dto/register.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {}
  async register(body: RegisterDTO) {
    body.password = await this.passwordService.hash(body.password, 10);

    const user = this.userRepo.create({
      ...body,
    });

    return await this.userRepo.save(user);
  }
}
