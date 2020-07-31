import React, { Component, ReactChild, ReactElement } from 'react';
import { Helper } from '../utils';
import { SidebarAccordionContent } from './sidebar-accordion-content';
import { Sidebar } from './sidebar';

type ReactChildExt = ReactChild & {
  props?: any;
  type?: any;
};

type ChildrenType = { content: ReactChildExt; sidebars?: ReactChildExt[] };

type Position = 'left' | 'top' | 'right' | 'bottom' | 'all';

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
  /**
   * Карта областей расположения боковых панелей
   */
  private panesRefs: {
    left?: HTMLDivElement;
    top?: HTMLDivElement;
    right?: HTMLDivElement;
    bottom?: HTMLDivElement;
  } = {};

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

  /**
   * Открыть боковую панель
   * @param value Позиция в рамках которой необходимо открыть боковую панель
   * @param index Индекс боковой панели
   * @return void
   */
  open(value: Position, index = 0): void {
    this.sidebarToggle(value, true, index);
  }

  /**
   * Закрыть боковую панель
   * @param value Позиция в рамках которой необходимо закрыть боковую панель
   * @return void
   */
  close(value: Position): void {
    this.sidebarToggle(value, false);
  }

  /**
   * Осуществляет переключение состояния панелей
   * @param position Позиция боковой панели где требуется переключение
   * @param opened Открыть/закрыть
   * @param index Индекс боковой панели
   * @return void
   */
  private sidebarToggle(
    position: Position,
    opened: boolean,
    index?: number
  ): void {
    const sidebars: Element[] = [];
    const paneRef = this.panesRefs[
      position as 'left' | 'top' | 'right' | 'bottom'
    ];
    if (paneRef) {
      if (position === 'left' || position === 'top') {
        for (let i = paneRef.children.length - 1; i >= 0; i--) {
          sidebars.push(paneRef.children[i]);
        }
      } else {
        for (let i = 0; i < paneRef.children.length; i++) {
          sidebars.push(paneRef.children[i]);
        }
      }
    }

    switch (position) {
      case 'all':
        Object.keys(this.panesRefs).forEach(key => {
          const paneRef = this.panesRefs[
            key as 'left' | 'top' | 'right' | 'bottom'
          ];
          if (paneRef) {
            if (opened) {
              if (paneRef.children.length > 0) {
                SidebarAccordion.addAttrOpen(
                  paneRef.children[index ? index : 0]
                );
              }
            } else if (index) {
              SidebarAccordion.removeAttrOpen(paneRef.children[index]);
            } else {
              for (let i = 0; i < paneRef.children.length; i++) {
                SidebarAccordion.removeAttrOpen(paneRef.children[i]);
              }
            }
          }
        });
        break;
      default:
        opened
          ? SidebarAccordion.addAttrOpen(sidebars[index ? index : 0])
          : index
          ? SidebarAccordion.removeAttrOpen(sidebars[index])
          : sidebars.forEach(s => SidebarAccordion.removeAttrOpen(s));
        break;
    }
  }

  private readonly isChildrenType = (children: any): children is ChildrenType =>
    Helper.isObject(children) && 'sidebars' in children;

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

    const paneRef = this.panesRefs[
      sender.props.position as 'left' | 'top' | 'right' | 'bottom'
    ];

    const eventArgs: SidebarOpenChangedEventArgs = {
      position: sender.props.position
    };

    if (paneRef) {
      for (let i = 0; i < paneRef.children.length; i++) {
        const itemRef = paneRef.children[i];

        if (itemRef === headerRef.parentElement) {
          if (itemRef.hasAttribute('open')) {
            itemRef.removeAttribute('open');
            eventArgs.close = i;
          } else {
            itemRef.setAttribute('open', '');
            eventArgs.open = i;
          }
        } else if (
          itemRef !== headerRef.parentElement &&
          itemRef.hasAttribute('open')
        ) {
          itemRef.removeAttribute('open');
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
   * Устанавливает атрибут открытия панели
   * @param sidebar Ссылка на DOM элемент боковой панели
   * @return void
   */
  private static addAttrOpen(sidebar: Element): void {
    sidebar.setAttribute('open', '');
  }

  /**
   * Удаляет атрибут открытия панели
   * @param sidebar Ссылка на DOM элемент боковой панели
   * @return void
   */
  private static removeAttrOpen(sidebar: Element): void {
    sidebar.removeAttribute('open');
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
          ref={elm => (this.panesRefs['left'] = elm as HTMLDivElement)}
          className="sidebar-accordion__left-pane"
        >
          {leftPane.map((item, index) => {
            return (
              <React.Fragment key={'left-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.panesRefs['top'] = elm as HTMLDivElement)}
          className="sidebar-accordion__top-pane"
        >
          {topPane.map((item, index) => {
            return (
              <React.Fragment key={'top-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.panesRefs['right'] = elm as HTMLDivElement)}
          className="sidebar-accordion__right-pane"
        >
          {rightPane.map((item, index) => {
            return (
              <React.Fragment key={'right-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.panesRefs['bottom'] = elm as HTMLDivElement)}
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
