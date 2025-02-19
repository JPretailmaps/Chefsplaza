import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { DELETE_USER_CHANNEL } from 'src/modules/user/constants';
import { DELETE_PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { PerformerDto } from 'src/modules/performer/dtos';
import {
  AuthModel, VerificationModel, OAuthLoginModel, ForgotModel
} from '../models';
import {
  AUTH_MODEL_PROVIDER, VERIFICATION_MODEL_PROVIDER, OAUTH_LOGIN_MODEL_PROVIDER, FORGOT_MODEL_PROVIDER
} from '../providers/auth.provider';

const DELETE_USER_AUTH_TOPIC = 'DELETE_USER_AUTH_TOPIC';
const DELETE_PERFORMER_AUTH_TOPIC = 'DELETE_PERFORMER_AUTH_TOPIC';

@Injectable()
export class DeleteUserListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(AUTH_MODEL_PROVIDER)
    private readonly authModel: Model<AuthModel>,
    @Inject(VERIFICATION_MODEL_PROVIDER)
    private readonly verificationModel: Model<VerificationModel>,
    @Inject(OAUTH_LOGIN_MODEL_PROVIDER)
    private readonly oAuthLoginModel: Model<OAuthLoginModel>,
    @Inject(FORGOT_MODEL_PROVIDER)
    private readonly forgotModel: Model<ForgotModel>
  ) {
    this.queueEventService.subscribe(
      DELETE_USER_CHANNEL,
      DELETE_USER_AUTH_TOPIC,
      this.handleDeleteUser.bind(this)
    );
    this.queueEventService.subscribe(
      DELETE_PERFORMER_CHANNEL,
      DELETE_PERFORMER_AUTH_TOPIC,
      this.handleDeleteUser.bind(this)
    );
  }

  private async handleDeleteUser(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const user = event.data as PerformerDto;
    await Promise.all([
      this.authModel.deleteMany({
        sourceId: user._id
      }),
      this.verificationModel.deleteMany({
        sourceId: user._id
      }),
      this.oAuthLoginModel.deleteMany({
        sourceId: user._id
      }),
      this.forgotModel.deleteMany({
        sourceId: user._id
      })
    ]);
  }
}
