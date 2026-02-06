import { useSelector, useDispatch } from 'react-redux';
import { removeMessage } from '../slice/messageReducer';
import './MessageToast.css';

function MessageToast() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message);

  return (
    <div
      className="position-fixed"
      style={{ top: '64px', right: '15px', zIndex: 1100 }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`toast show mb-2 ${msg.isLeaving ? 'toast-animate-out' : 'toast-animate-in'}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header bg-${msg.type} text-white`}>
            <strong className="me-auto">{msg.title}</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => dispatch(removeMessage(msg.id))}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
