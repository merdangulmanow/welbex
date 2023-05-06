import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  app.use(morgan(':method, :url, :body, :status, :remote-addr, :date, :response-time ms'))
  
  const port = process.env.PORT ? Number(process.env.PORT) : 5500;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      forbidNonWhitelisted : true, 
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new HttpException({ statusCode: HttpStatus.NOT_ACCEPTABLE, success: false, message: validationErrors}, HttpStatus.NOT_ACCEPTABLE);
      },
    })
  );
  app.getHttpAdapter().getInstance().disable('x-powered-by')
  await app.listen(port).then(()=>{console.log(`server started on ${port}`)});
}
bootstrap();
