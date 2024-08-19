import { Injectable } from '@nestjs/common';
import dayjs, { ManipulateType } from 'dayjs';
import ejs from 'ejs';
import { UserPasswordResetEntity } from 'src/common/entities/post/user-password-reset.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { EMailerBodyType } from 'src/common/enum/mailer.enum';
import { ETemplateFileName } from 'src/common/enum/template-file.enum';
import { FileService } from 'src/common/services/file.service';
import { MailerService } from 'src/common/services/mailer.service';
import { createRandomString } from 'src/utils/random.utils';
import { EntityManager } from 'typeorm';

@Injectable()
export class ForgetPasswordService {
  private expiredIn: { value: number; unit: ManipulateType };
  private tokenLength: number;

  constructor(
    private readonly fileService: FileService,
    private readonly mailerService: MailerService,
    private readonly entityManager: EntityManager,
  ) {
    this.expiredIn = { value: 30, unit: 'minute' };
    this.tokenLength = 200;
  }

  async requestResetPassword(email: string, user: UserEntity) {
    const token = createRandomString(this.tokenLength);
    const resetLink = this.createResetPasswordLink(token);

    const html = this.createHtmlTemplate(resetLink);

    await this.entityManager.transaction(async (manager: EntityManager) => {
      const resetPasswordLink = manager.create(UserPasswordResetEntity, {
        token: token,
        expiredAt: dayjs()
          .add(this.expiredIn.value, this.expiredIn.unit)
          .toDate(),
        user: user,
      });

      await manager.save(resetPasswordLink);

      await this.mailerService.sendEmail(
        'Reset Password',
        email,
        html,
        EMailerBodyType.HTML,
      );
    });
  }

  private createResetPasswordLink(token: string) {
    const hostname = process.env.FRONTEND_HOSTNAME;
    const path = process.env.FRONTEND_RESET_PASSWORD_PATH;

    const resetLink = `${hostname}/${path}?token=${token}`;
    return resetLink;
  }

  private createHtmlTemplate(resetLink: string) {
    const template = this.fileService.readEjsTemplateFile(
      ETemplateFileName.REQUEST_RESET_PASSWORD,
    );

    const html = ejs.render(template, {
      link: resetLink,
    });
    return html;
  }
}
