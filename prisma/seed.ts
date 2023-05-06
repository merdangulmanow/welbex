import { PrismaClient } from '@prisma/client'
import {users} from './data'
const prisma = new PrismaClient();

async function main(){
  for(let user of users){
    await prisma.users.create({
      data: {
        email: user.email, name: user.name, password: user.password, activated: user.activated, 
        posts: {
          createMany: {
            data: user.posts
          }
        }
      }
    })
  }
}

main().catch(err=>{
  console.log(err)
  process.exit(1)
}).finally(()=>{
  prisma.$disconnect()
})