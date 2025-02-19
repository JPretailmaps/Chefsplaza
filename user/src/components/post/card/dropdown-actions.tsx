import {
  MoreOutlined
} from '@ant-design/icons';
import { IFeed } from '@interfaces/feed';
import {
  Button,
  Divider, Dropdown, Menu, MenuProps, message
} from 'antd';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { feedService } from '@services/feed.service';
import { showError } from '@lib/utils';
import style from './dropdown-actions.module.scss';

type Props = {
  feed: IFeed;
};

function DropdownActions({
  feed
}: Props) {
  const user = useSelector((state: any) => state.user.current);

  const copyLink = () => {
    const str = `${window.location.origin}/post/${feed.slug || feed._id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(str);
    } else {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    message.success('Copied to clipboard');
  };

  // const handleDelete = async () => {
  //   if (user._id !== feed.fromSourceId) {
  //     return;
  //   }
  //   if (!window.confirm('Are you sure to remove this post?')) {
  //     return;
  //   }
  //   try {
  //     await feedService.delete(feed._id);
  //     message.success('Removed successfully');
  //   } catch (e) {
  //     showError(e);
  //   }
  // };

  const items: MenuProps['items'] = [
    {
      key: `post_detail_${feed._id}`,
      label: (
        <Link href={{ pathname: '/post/[id]', query: { id: feed.slug || feed._id } }} as={`/post/${feed.slug || feed._id}`}>
          Details
        </Link>
      )
    },
    {
      key: `copy_link_${feed._id}`,
      label: (
        <a
          aria-hidden
          onClick={() => {
            copyLink();
          }}
        >
          Copy link to clipboard
        </a>
      )
    }
  ];
  if (user._id === feed.fromSourceId) {
    items.push(...[
      {
        key: 'divider',
        label: <Divider style={{ margin: '10px 0' }} />
      },
      {
        key: `edit_${feed._id}`,
        label: (
          <Link
            href={{ pathname: '/creator/my-post/edit/[id]', query: { id: feed._id } }}
            as={`/creator/my-post/edit/${feed._id}`}
          >
            Edit post
          </Link>
        )
      }
      // {
      //   key: `delete_${feed._id}`,
      //   label: (
      //     <a aria-hidden onClick={handleDelete}>Delete post</a>
      //   )
      // }
    ]);
  }

  return (
    <Dropdown menu={{ items }} className={style['dropdown-options']}>
      <MoreOutlined />
    </Dropdown>
  );
}

export default DropdownActions;
