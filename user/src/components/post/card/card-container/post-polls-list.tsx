import { IFeed } from '@interfaces/feed';
import { shortenLargeNumber } from '@lib/number';
import { feedService } from '@services/feed.service';
import { message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import ReactMomentCountDown from 'react-moment-countdown';
import { showError } from '@lib/utils';
import { useSelector } from 'react-redux';
import { IUser } from '@interfaces/user';
import { BarChartOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { round } from 'lodash';
import style from './post-polls-list.module.scss';

interface IProps {
  feed: IFeed;
}

export default function Polls({ feed }: IProps) {
  if (!feed?.polls || !feed?.polls.length) return null;

  const { theme } = useSelector((state: any) => state.ui);
  const [polls, setPolls] = useState<any>(feed?.polls || []);
  const user = useSelector((state: any) => state.user.current) as IUser;

  const votePoll = async (poll: any) => {
    const isExpired = moment().isAfter(feed?.pollExpiredAt);
    if (!user || !user._id) {
      message.error('Please login or register!');
      return;
    }
    if (isExpired) {
      message.error('The poll is now closed');
      return;
    }
    try {
      await feedService.votePoll(poll._id);
      const index = polls.findIndex((p) => p._id === poll._id);
      setPolls((prevPolls) => {
        const newItems = [...prevPolls];
        newItems[index].totalVote += 1;
        return newItems;
      });
    } catch (e) {
      showError(e);
    }
  };

  let totalVote = 0;
  polls && polls.forEach((poll) => {
    totalVote += poll.totalVote;
  });

  const convertVotePercent = (vote: number) => (totalVote > 0 ? round((vote * 100) / totalVote, 2) : 0);

  return (
    <div className={classNames(style['feed-polls'])}>
      {feed.pollDescription && (
      <div className={style['p-question']}>
        <BarChartOutlined />
        {feed.pollDescription}
      </div>
      )}
      {polls.map((poll) => (
        <div aria-hidden className={style['p-item']} key={poll._id} onClick={() => votePoll(poll)}>
          <span className={style.progress} style={{ width: `${convertVotePercent(poll?.totalVote) || 0}%` }} />
          <span className={style['p-desc']}>{poll?.description}</span>
          <span className={style['p-voted']}>{poll?.totalVote || 0}</span>
        </div>
      ))}
      <div className={style['total-vote']}>
        <span>
          Total
          {' '}
          {shortenLargeNumber(totalVote)}
          {' '}
          {totalVote < 2 ? 'vote' : 'votes'}
        </span>
        {feed.pollExpiredAt && moment(feed.pollExpiredAt).isAfter(moment()) ? (
          <span>
            {`${moment(feed.pollExpiredAt).diff(moment(), 'days')}d `}
            <ReactMomentCountDown toDate={moment(feed.pollExpiredAt)} />
          </span>
        ) : <span>Closed</span>}
      </div>
    </div>
  );
}
