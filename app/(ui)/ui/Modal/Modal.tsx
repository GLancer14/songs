"use client"

import clsx from "clsx";
import {
  MouseEventHandler,
  ReactNode,
  TransitionEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import s from "./Modal.module.scss";
import { createPortal } from "react-dom";

type ModalChildren = ReactNode | ((ctx: { show: boolean }) => ReactNode);

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  mountId?: string;
  className?: string;
  children?: ModalChildren;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, className, children }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (isOpen) {
      setMounted(true);
      rafRef.current = requestAnimationFrame((): void => {
        setShow(true);
        rafRef.current = null;
      });
      document.body.style.overflow = 'hidden';
    } else {
      setShow(false);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isOpen]);

  // useEffect(() => {
  //   const handleTabKey = (e: KeyboardEvent) => {
  //     if (show) {
  //       if (e.key !== 'Tab') {
  //         if (e.key === 'Escape') {
  //           onClose?.();
  //         }
  //       }

  //       e.preventDefault();
  //       modalRef.current?.focus();
  //     }
  //   };

  //   document.addEventListener('keydown', handleTabKey);
  //   return () => {
  //     document.removeEventListener('keydown', handleTabKey);
  //   };
  // }, [show]);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event): void => {
    if (event.target === event.currentTarget) {
      document.body.style.overflow = 'auto';
      setShow(false);
      onClose?.();
    }
  };

  const handleTransitionEnd: TransitionEventHandler<HTMLDivElement> = (event): void => {
    if (event.target === event.currentTarget && event.propertyName === 'opacity' && !show) {
      setMounted(false);
    }
  };

  if (!mounted) return null;

  const isVeilRenderProp = (
    value: ModalChildren | undefined,
  ): value is (ctx: { show: boolean }) => ReactNode => typeof value === 'function';

  const content = isVeilRenderProp(children) ? children({ show }) : children;

  return createPortal(
    <div
      ref={modalRef}
      onMouseDown={handleClick}
      tabIndex={-1}
      onTransitionEnd={handleTransitionEnd}
      className={clsx(s.modal, { [s.modal_open]: show }, className)}>
      {content}
    </div>,
    document.body,
  );
};

export default Modal;