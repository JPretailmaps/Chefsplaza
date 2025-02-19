import {
  useContext, useMemo,
  createContext,
  useReducer
} from 'react';
import dynamic from 'next/dynamic';

const ViewMediaPopupChildren = dynamic(import('./view-media-popup-children'));

const initialValues = {
  show: false, showPopup: (a, b) => {}, closePopup: () => {}, content: [] as any, index: 0
};

type Values = typeof initialValues;

const reducers = (prevState, action) => {
  switch (action.type) {
    case 'VIEW_POPUP':
      return {
        ...prevState,
        show: action.open,
        ...action.payload
      };
    case 'CLOSE_POPUP':
      return {
        ...prevState,
        show: action.open,
        content: [],
        index: 0
      };
    default:
      return { ...prevState };
  }
};

export const ViewPopupContext = createContext<Values>(initialValues);

export const useViewPopup = () => useContext(ViewPopupContext);

export function ViewPopupProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducers, initialValues);

  const showPopup = (content: any, index: any) => {
    dispatch({ type: 'VIEW_POPUP', open: true, payload: { content, index } });
  };

  const closePopup = () => {
    dispatch({ type: 'CLOSE_POPUP', open: false });
  };

  const value = useMemo(() => ({ ...state, showPopup, closePopup }), [state, showPopup, closePopup]);

  return (
    <ViewPopupContext.Provider value={value}>
      {children}
    </ViewPopupContext.Provider>

  );
}

export default function ViewMediaPopupContainer({ children }: any) {
  return (
    <ViewPopupProvider>
      {children}
      <ViewMediaPopupChildren />
    </ViewPopupProvider>
  );
}
