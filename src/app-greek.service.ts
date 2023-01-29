import { Injectable } from '@nestjs/common';

@Injectable()
export class AppGreekService {
  getHello(): string {
    return 'Καλημέρα!';
  }
}
