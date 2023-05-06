"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const morgan = require("morgan");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    morgan.token('body', req => {
        return JSON.stringify(req.body);
    });
    app.use(morgan(':method, :url, :body, :status, :remote-addr, :date, :response-time ms'));
    const port = process.env.PORT ? Number(process.env.PORT) : 5500;
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (validationErrors = []) => {
            return new common_1.HttpException({ statusCode: common_1.HttpStatus.NOT_ACCEPTABLE, success: false, message: validationErrors }, common_1.HttpStatus.NOT_ACCEPTABLE);
        },
    }));
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    await app.listen(port).then(() => { console.log(`server started on ${port}`); });
}
bootstrap();
//# sourceMappingURL=main.js.map