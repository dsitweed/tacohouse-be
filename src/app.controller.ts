import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Test app work
   */
  @Get()
  getHello(): string {
    return `Hello World! + ${process.env.FIREBASE_PROJECT_ID}`;
  }
}
