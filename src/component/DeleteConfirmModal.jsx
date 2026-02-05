import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, productTitle }) {
  const modalRef = useRef(null);
  const modalElRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    modalRef.current = new Modal(modalElRef.current);

    const el = modalElRef.current;
    const handleHidden = () => onCloseRef.current();
    el.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleHidden);
      modalRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.show();
    } else {
      modalRef.current?.hide();
    }
  }, [isOpen]);

  return (
    <div
      className="modal fade"
      ref={modalElRef}
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="deleteModalLabel">
              刪除產品
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => onCloseRef.current()}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            確定要刪除「<strong>{productTitle}</strong>
            」嗎？此操作無法復原。
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onCloseRef.current()}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
