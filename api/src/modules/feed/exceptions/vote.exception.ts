import { HttpStatus } from '@nestjs/common';
import { RuntimeException } from 'src/kernel';

export class AlreadyVotedException extends RuntimeException {
  constructor(msg: string | object = "You've already voted'", error = 'ALREADY_VOTED') {
    super(msg, error, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class PollExpiredException extends RuntimeException {
  constructor(msg: string | object = 'The poll is now closed', error = 'ALREADY_EXPIRED_TO_VOTE') {
    super(msg, error, HttpStatus.FORBIDDEN);
  }
}
