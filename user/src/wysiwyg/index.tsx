import { useState } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

interface IProps {
  placeholder?: string;
  onChange: Function;
  content?: string;
}

function WYSISWYG({ placeholder, onChange, content }: IProps) {
  const [editorState, setEditorState] = useState<string>(content);
  const onEditorStateChange = (v: string) => {
    setEditorState(v);
    onChange && onChange(v);
  };

  return (
    <SunEditor
      lang="en"
      onChange={onEditorStateChange}
      setContents={editorState}
      placeholder={placeholder}
      autoFocus={false}
      setOptions={{
        mode: 'classic',
        height: '250',
        buttonList: [
          [
            'undo',
            'redo',
            'font',
            'fontSize',
            'formatBlock',
            'blockquote',
            'bold',
            'underline',
            'italic',
            'strike',
            'subscript',
            'superscript',
            'fontColor',
            'hiliteColor',
            'removeFormat',
            'align',
            'lineHeight',
            'list',
            'link',
            'table',
            // "image",
            'fullScreen',
            'preview'
          ]
        ]
      }}
    />
  );
}

WYSISWYG.defaultProps = {
  placeholder: 'Description..',
  content: ''
};

export default WYSISWYG;
