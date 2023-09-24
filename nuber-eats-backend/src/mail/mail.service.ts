import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.strings';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append(
      'from',
      `Nico from Nuber Eats <mailgun@${this.options.domain}>`, // the verification mail`s sender
    );
    form.append('to', `ksz18601@gmail.com`); // the Authorized email address that can receive a verification mail
    form.append('subject', subject); // the verification mail`s title
    form.append('template', template); // Using template`s name
    emailVars.forEach(
      eVar => form.append(`v:${eVar.key}`, eVar.value), //  assigns the value to template`s variable key
    );

    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              // Encodes the api key with 'base64'
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('plz Verify Your Email', 'template1', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
