import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { authProviders } from './providers/auth.provider';
import { UserModule } from '../user/user.module';
import { AuthService, SocialLoginService } from './services';
import { MailerModule } from '../mailer/mailer.module';
import { AuthGuard, RoleGuard, LoadUser } from './guards';
import { RegisterController } from './controllers/register.controller';
import { LoginController } from './controllers/login.controller';
import { PasswordController } from './controllers/password.controller';
import { AdminPasswordController } from './controllers/admin-password.controller';
import { FileModule } from '../file/file.module';
import { PerformerModule } from '../performer/performer.module';
import { DeleteUserListener } from './listeners';

@Module({
  imports: [
    MongoDBModule,
    forwardRef(() => PerformerModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailerModule),
    forwardRef(() => FileModule)
  ],
  providers: [
    ...authProviders,
    AuthService,
    SocialLoginService,
    DeleteUserListener,
    AuthGuard,
    RoleGuard,
    LoadUser
  ],
  controllers: [
    RegisterController,
    LoginController,
    PasswordController,
    AdminPasswordController
  ],
  exports: [
    ...authProviders,
    AuthService,
    AuthGuard,
    RoleGuard,
    LoadUser
  ]
})
export class AuthModule { }
