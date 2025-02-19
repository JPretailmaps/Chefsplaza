import { useTheme } from 'next-themes';
import Picker from '@emoji-mart/react';

interface IProps {
  onEmojiClick: Function;
}

function Emotions({ onEmojiClick }: IProps) {
  const { theme } = useTheme();
  return (
    <div className="emoji-picker">
      <Picker
        data={async () => {
          const response = await fetch(
            'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
          );
          return response.json();
        }}
        onEmojiSelect={(e) => onEmojiClick(e.native)}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}

export default Emotions;
