import * as React from 'react';
import { IUser } from 'src/interfaces';

import style from './streaming-chat-view.module.scss';

interface Props<T> {
  members: T[];
}

function StreamingChatUsers({
  members = []
}: Props<IUser>) {
  return (
    <div className={style['conversation-users']}>
      <div className={style.users}>
        {members.length > 0
          && members.map((member) => (
            <div className={style.user} key={member._id}>
              <img alt="avt" src={member?.avatar || '/no-avatar.jpg'} />
              <span className="username">{member?.name || member?.username || 'N/A'}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default StreamingChatUsers;
