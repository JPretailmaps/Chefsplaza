import { IFeed } from '@interfaces/feed';
import { skeletonLoading } from '@lib/loading';
import { Form, Input } from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import classNames from 'classnames';
import style from './poll-form.module.scss';

const AddPollDurationForm = dynamic(() => import('./add-poll-duration'), { ssr: false, loading: skeletonLoading });

interface P {
  feed: IFeed;
  onChange: Function;
}

function PollForm({ feed, onChange }: P) {
  const [pollList, setPollList] = useState<any[]>(feed?.polls || []);
  const [openPollDuration, setOpenPollDuration] = useState<boolean>(false);
  const [expirePollDays, setExpirePollDays] = useState<Number>(7);
  const [expiredPollAt, setExpiredPollAt] = useState<any>(moment().endOf('day').add(7, 'days').toDate());

  const onChangePollDuration = (numberDays) => {
    const date = !numberDays ? moment().endOf('day').add(99, 'years').toDate() : moment().endOf('day').add(numberDays, 'days').toDate();
    setOpenPollDuration(false);
    setExpiredPollAt(date);
    setExpirePollDays(numberDays);
  };

  const onChangePoll = (index: number, value: string) => {
    const result = pollList;
    result[index] = value;
    setPollList([...result]);
    onChange({
      polls: result,
      expiredAt: expiredPollAt
    });
  };

  const onClearPolls = () => setPollList([]);

  return (
    <>
      <div className={classNames(style['poll-form'])}>
        <div className={style['poll-top']}>
          {!feed ? (
            <span aria-hidden onClick={() => setOpenPollDuration(true)}>
              Poll duration -
              {' '}
              {!expirePollDays ? 'No limit' : `${expirePollDays} days`}
            </span>
          ) : (<span>Poll</span>)}
        </div>
        <Form.Item
          name="pollDescription"
          className={style['form-item-no-pad']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: pollList.length > 0, message: 'Please add a question' }]}
        >
          <Input disabled={!!feed} placeholder="Question" maxLength={100} />
        </Form.Item>
        <Input
          key={`poll_${0}`}
          disabled={!!feed?._id}
          className={style['poll-input']}
          placeholder="Poll 1"
          value={pollList.length > 0 && pollList[0]?._id ? pollList[0]?.description : pollList[0] || ''}
          onChange={(e) => onChangePoll(0, e.target.value)}
          maxLength={100}
        />
        <Input
          key={`poll_${1}`}
          disabled={!!feed?._id || !pollList.length}
          placeholder="Poll 2"
          className={style['poll-input']}
          value={pollList.length > 1 && pollList[1]?._id ? pollList[1]?.description : pollList[1] || ''}
          onChange={(e) => onChangePoll(1, e.target.value)}
          maxLength={100}
        />
        {pollList.map((poll, index) => {
          if (index === 0 || index === 1) return null;
          return (
            <Input
              autoFocus
              disabled={!!feed?._id}
              placeholder={`Poll ${index + 1}`}
              // eslint-disable-next-line react/no-array-index-key
              key={`${poll?._id || feed?._id}_${index}`}
              value={(poll._id ? poll.description : poll) || ''}
              className={style['poll-input']}
              onChange={(e) => onChangePoll(index, e.target.value)}
              maxLength={100}
            />
          );
        })}
        {!feed && pollList.length > 1 && (
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a aria-hidden onClick={() => setPollList(pollList.concat(['']))}>Add another option</a>
          <a aria-hidden onClick={onClearPolls}>Clear polls</a>
        </p>
        )}
      </div>
      {openPollDuration && <AddPollDurationForm onAddPollDuration={onChangePollDuration} openDurationPollModal={openPollDuration} />}
    </>
  );
}

export default PollForm;
