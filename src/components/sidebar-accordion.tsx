import React, { Component, ReactChild, ReactElement } from 'react';
import { Helper } from '../utils';
import { SidebarAccordionContent } from './sidebar-accordion-content';
import { Sidebar } from './sidebar';

type ReactChildExt = ReactChild & {
  props?: any;
  type?: any;
};

type ChildrenType = { content: ReactChildExt; sidebars?: ReactChildExt[] };

interface SidebarAccordionProps {
  className?: string;
  sidebarResizable?: boolean;
  children: ChildrenType | ReactChild;
  sidebarOpenChanged?: (e: SidebarOpenChangedEventArgs) => void;
}

type Props = Readonly<SidebarAccordionProps>;

/**
 * Контейнер для размещения контента и боковых панелей
 * @param children Дочерние элементы Sidebar,SidebarAccordionContent
 * @param sidebarResizable Параметр определяющий возможность изменения пользователем
 * размера боковых панелей
 * @constructor
 */
class SidebarAccordion extends Component<Props> {
  private leftPaneRef: HTMLDivElement | null = null;
  private topPaneRef: HTMLDivElement | null = null;
  private rightPaneRef: HTMLDivElement | null = null;
  private bottomPaneRef: HTMLDivElement | null = null;

  /**
   * Контейнер для размещения контента и боковых панелей
   * @param props Параметры
   */
  constructor(props: Props) {
    super(props);
  }

  /**
   * Функция отрисовки компонента
   * @return Компонент
   */
  render(): ReactElement<Props> {
    const { children } = this.props as Props;
    if (!children) {
      throw new Error('children is mandatory');
    }

    if (this.isChildrenType(children)) {
      return this.renderContentWithSidebars();
    } else {
      return <div className="sidebar-accordion">{children}</div>;
    }
  }

  private readonly isChildrenType = (children: any): children is ChildrenType =>
    Helper.isObject(children) && 'sidebars' in children;

  /**
   * Возвращает ссылку на область размещения панелей
   * @param position Поизиция области
   * @return Ссылка на элемент
   */
  private getPaneRef(position: string): HTMLDivElement | null {
    switch (position) {
      case 'left':
        return this.leftPaneRef;
      case 'top':
        return this.topPaneRef;
      case 'right':
        return this.rightPaneRef;
      case 'bottom':
        return this.bottomPaneRef;
      default:
        return null;
    }
  }

  /**
   * Обработчик события клика по заголовку боковой панели
   * @param sender Информация о том в каком заголовке панели возникло событие
   * @param e Параметры события
   * @return void
   */
  private onHeaderClicked(
    sender: ReactChildExt,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    if (sender.props.headerClicked) {
      sender.props.headerClicked(e);
    }
    const headerRef = ((e.target as HTMLDivElement).classList[0] ===
    'sidebar-header'
      ? e.target
      : (e.target as HTMLDivElement).parentElement) as HTMLDivElement;

    const paneRef = this.getPaneRef(sender.props.position);

    const eventArgs: SidebarOpenChangedEventArgs = {
      position: sender.props.position
    };

    if (paneRef) {
      for (let i = 0; i < paneRef.children.length; i++) {
        const item = paneRef.children[i];
        const itemHeaderRef = item.querySelector('.sidebar-header');
        if (itemHeaderRef === headerRef) {
          if (headerRef.hasAttribute('open')) {
            headerRef.removeAttribute('open');
            eventArgs.close = i;
          } else {
            headerRef.setAttribute('open', '');
            eventArgs.open = i;
          }
        } else if (
          itemHeaderRef &&
          itemHeaderRef !== headerRef &&
          itemHeaderRef.hasAttribute('open')
        ) {
          itemHeaderRef.removeAttribute('open');
          eventArgs.close = i;
        }
      }
    }

    const { sidebarOpenChanged } = this.props as Props;

    if (sidebarOpenChanged) {
      sidebarOpenChanged(eventArgs);
    }
    // console.log('sidebar onHeaderClicked event');
  }

  /**
   * Обработчик события окончания перемещения пальца по заголовку боковой панели
   * @param sender Информация о заголовке в котором возникло событие
   * @param e Параметры события
   * @return void
   */
  private static onHeaderTouchEnded(
    sender: ReactChildExt,
    e: React.TouchEvent<HTMLDivElement>
  ): void {
    if (sender.props.headerTouchEnded) {
      sender.props.headerTouchEnded(e);
    }
    console.log('sidebar onHeaderTouchEnded event');
  }

  /**
   * Обработчик события перемещени пальца по заголовку боковой панели
   * @param sender Информация о заголовке в котором возникло событие
   * @param e Параметры события
   * @return void
   */
  private static onHeaderTouchMoved(
    sender: ReactChildExt,
    e: React.TouchEvent<HTMLDivElement>
  ): void {
    if (sender.props.headerTouchMoved) {
      sender.props.headerTouchMoved(e);
    }
    console.log('sidebar onHeaderTouchMoved');
  }

  /**
   * Возвращает разметку компонента с боковыми панелями
   * @return Разметка
   */
  private renderContentWithSidebars(): ReactElement<Props> {
    const { className, children } = this.props as Props;
    const { content, sidebars } = children as ChildrenType;

    if (content.type !== SidebarAccordionContent) {
      throw new Error('children content is not SidebarAccordionContent');
    }
    const leftPane: ReactChildExt[] = [];
    const topPane: ReactChildExt[] = [];
    const rightPane: ReactChildExt[] = [];
    const bottomPane: ReactChildExt[] = [];

    if (sidebars) {
      sidebars.forEach(sidebarItem => {
        if (sidebarItem.type !== Sidebar) {
          throw new Error('children sidebars include is not Sidebar');
        }

        const sidebar = React.cloneElement(sidebarItem as any, {
          ...sidebarItem.props,
          ...{
            headerClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              this.onHeaderClicked(sidebarItem, e),
            headerTouchEnded: (e: React.TouchEvent<HTMLDivElement>) =>
              SidebarAccordion.onHeaderTouchEnded(sidebarItem, e),
            headerTouchMoved: (e: React.TouchEvent<HTMLDivElement>) =>
              SidebarAccordion.onHeaderTouchMoved(sidebarItem, e)
          }
        });

        switch (sidebar.props.position) {
          case 'left':
            leftPane.push(sidebar);
            break;
          case 'top':
            topPane.push(sidebar);
            break;
          case 'right':
            rightPane.push(sidebar);
            break;
          case 'bottom':
            bottomPane.push(sidebar);
            break;
        }
      });
    }

    return (
      <div className={'sidebar-accordion' + (className ? ` ${className}` : '')}>
        <div
          ref={elm => (this.leftPaneRef = elm)}
          className="sidebar-accordion__left-pane"
        >
          {leftPane.map((item, index) => {
            return (
              <React.Fragment key={'left-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.topPaneRef = elm)}
          className="sidebar-accordion__top-pane"
        >
          {topPane.map((item, index) => {
            return (
              <React.Fragment key={'top-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.rightPaneRef = elm)}
          className="sidebar-accordion__right-pane"
        >
          {rightPane.map((item, index) => {
            return (
              <React.Fragment key={'right-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.bottomPaneRef = elm)}
          className="sidebar-accordion__bottom-pane"
        >
          {bottomPane.map((item, index) => {
            return (
              <React.Fragment key={'bottom-pane' + index}>
                {item}
              </React.Fragment>
            );
          })}
        </div>
        <div className="sidebar-accordion__content-pane">{content}</div>
      </div>
    );
  }
}

export interface SidebarOpenChangedEventArgs {
  position: 'left' | 'top' | 'right' | 'bottom';
  open?: number;
  close?: number;
}

export { SidebarAccordion };
