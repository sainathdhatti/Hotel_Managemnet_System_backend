import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';

console.log('JWT Secret:', process.env.JWT_SECRET);
@Module({
  imports: [UserModule,JwtModule.register({
    global: true,
    secret: "5d41402abc4b2a76b9719d911017c592f6d9d7b3e5f923e49f2d0921d58f0e4",
    signOptions: { expiresIn: '1d' },
  }),],
  controllers:[AuthController],
  providers:[AuthService],
  exports:[AuthService]
})
export class AuthModule{
    
}
