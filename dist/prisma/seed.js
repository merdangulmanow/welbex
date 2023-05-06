"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const data_1 = require("./data");
const prisma = new client_1.PrismaClient();
async function main() {
    for (let user of data_1.users) {
        await prisma.users.create({
            data: {
                email: user.email, name: user.name, password: user.password, activated: user.activated,
                posts: {
                    createMany: {
                        data: user.posts
                    }
                }
            }
        });
    }
}
main().catch(err => {
    console.log(err);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map