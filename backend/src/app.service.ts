import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {

    //model : code
    return 'Hello Huy Neymar';
  }
}
