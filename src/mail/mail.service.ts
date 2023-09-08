import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './interfaces/jwt.configOptions';
import { MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    
  }

  async sendEmail(
    subject: string,
    to: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean>
  {
    const form = new FormData();
    form.append(
      'from',
      `Nico from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);

    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    const response = await got.post( // got()을 통해 HTTP 요청을 보냄.
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api: ${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    return true;
  }
  catch(error) {
    return false;
  }


  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Please Verify Your Email', 'template', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
