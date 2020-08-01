import React, { FunctionComponent, ReactChild } from 'react';
// import { DOMAttributes } from 'react';
import { Helper } from '../utils';
import { SidebarContent } from './sidebar-content';
import { SidebarHeader } from './index';

// declare module 'react' {
//   interface HTMLAttributes<T> extends DOMAttributes<T> {
//     position?: string;
//   }
// }
type ReactChildExt = ReactChild & {
  props?: any;
  type?: any;
};

type ChildrenType = { header?: ReactChildExt; content: ReactChildExt };

/**
 * Параметры компонента
 */
interface SidebarProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  headerClicked?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  headerTouchMoved?: (e: React.TouchEvent<HTMLDivElement>) => void;
  headerTouchEnded?: (e: React.TouchEvent<HTMLDivElement>) => void;
  children: ChildrenType | ReactChild;
}

type Props = Readonly<SidebarProps>;

/**
 * Боковая панель
 * @param position Край окна к которому будет прикреплена панель
 * @param children Дочерние элементы SidebarHeader, SidebarContent
 * @param className Наименование css класса
 * @param headerClicked Событие клика на заголовок
 * @param headerTouchEnded Событие окончания перемещения пальца
 * @param headerTouchMoved Событие перемещения пальца
 * @constructor
 */
const Sidebar: FunctionComponent<Props> = ({
  children,
  className,
  headerClicked,
  headerTouchEnded,
  headerTouchMoved
}) => {
  if (!children) {
    throw new Error('children is mandatory');
  }

  const onHeaderClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { header } = children as ChildrenType;

    if (header?.props.clicked) {
      header?.props.clicked(e);
    }
    if (headerClicked) {
      headerClicked(e);
    }
  };

  const onTouchEnded = (e: React.TouchEvent<HTMLDivElement>) => {
    const { header } = children as ChildrenType;

    if (header?.props.clicked) {
      header?.props.touchEnded(e);
    }
    if (headerTouchEnded) {
      headerTouchEnded(e);
    }
  };

  const onTouchMoved = (e: React.TouchEvent<HTMLDivElement>) => {
    const { header } = children as ChildrenType;

    if (header?.props.clicked) {
      header?.props.touchMoved(e);
    }
    if (headerTouchMoved) {
      headerTouchMoved(e);
    }
  };

  const isChildrenType = (children: any): children is ChildrenType =>
    Helper.isObject(children) && 'content' in children;

  if (isChildrenType(children)) {
    let { header, content } = children;

    if (content.type !== SidebarContent) {
      throw new Error('children content is not SidebarContent');
    }
    if (header && header?.type !== SidebarHeader) {
      throw new Error('children header is not SidebarHeader');
    } else if (header) {
      header = React.cloneElement(header as any, {
        ...header?.props,
        ...{
          clicked: onHeaderClicked,
          touchMoved: onTouchMoved,
          touchEnded: onTouchEnded
        }
      });
    }

    return (
      <div className={'sidebar' + (className ? ` ${className}` : '')}>
        {header ? header : null}
        {content}
      </div>
    );
  } else {
    if ((children as any).type === SidebarContent) {
      return (
        <div className={'sidebar' + (className ? ` ${className}` : '')}>
          {children}
        </div>
      );
    } else {
      throw new Error('children is not SidebarContent');
    }
  }
};

export { Sidebar };
