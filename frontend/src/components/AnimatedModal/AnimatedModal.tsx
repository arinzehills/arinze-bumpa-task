import React, { useState, CSSProperties, ReactNode, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export interface AnimatedModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  children: ReactNode;
  bkdropclassName?: string;
  modalHeight?: string | number;
  style?: CSSProperties;
  maxWidthClass?: string;
  isCircular?: boolean;
  backdropwidth?: string;
  canClose?: boolean;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  openModal,
  setOpenModal,
  children,
  bkdropclassName,
  modalHeight,
  style,
  maxWidthClass = "max-w-3xl p-6",
  isCircular = false,
  canClose = true,
}) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleCancelClick = (): void => {
    setOpenModal(false);

    if (canClose) {
      setOpenModal(false);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCloseModal = (): void => {
    setOpenModal(false);
    setShowConfirmation(false);
  };

  const handleConfirmationClose = (): void => {
    setShowConfirmation(false);
  };

  const modalStyle: CSSProperties = {
    ...style,
    height: modalHeight,
    borderRadius: isCircular ? "50%" : "0.5rem",
  };

  return (
    <AnimatePresence>
      {openModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-blue-900 bg-opacity-40 backdrop-blur-sm z-[9999999] flex justify-center items-center ${
              bkdropclassName || ""
            }`}
            onClick={() => canClose && setOpenModal(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { duration: 0.2 } }}
              exit={{ scale: 0 }}
              className={`${maxWidthClass} bg-white w-full rounded-md relative flex flex-col overflow-y-auto max-h-[95vh]`}
              onClick={stopPropagation}
              style={modalStyle}
            >
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { delay: 0.2, duration: 0.6 },
                }}
                exit={{ opacity: 0, x: 100 }}
                className="w-full h-full relative"
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-2xl cursor-pointer hover:opacity-70 transition z-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancelClick();
                  }}
                  aria-label="Close modal"
                >
                  <Icon icon="ph:x" className="w-6 h-6 text-gray-600" />
                </button>
                {children}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[9999999] flex justify-center items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { duration: 0.2 } }}
                  exit={{ scale: 0 }}
                  className="bg-white w-full max-w-lg rounded-md p-6 relative flex flex-col"
                >
                  <p className="text-lg mb-4">
                    Are you sure you want to close?
                  </p>
                  <div className="flex justify-end">
                    <button
                      className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      onClick={handleCloseModal}
                    >
                      Yes, Close
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                      onClick={handleConfirmationClose}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;
