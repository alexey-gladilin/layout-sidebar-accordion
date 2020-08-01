import React, { Component, ReactChild, ReactElement } from 'react';
import { Helper } from '../utils';
import { SidebarAccordionContent } from './sidebar-accordion-content';
import { Sidebar } from './sidebar';
import './sidebar-accordion.scss';

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
  mode?: {
    left?: RenderModeType;
    top?: RenderModeType;
    right?: RenderModeType;
    bottom?: RenderModeType;
  };
}

type Props = Readonly<SidebarAccordionProps>;

interface HTMLStyle {
  left?: string;
  right?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

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

  private rootRef: HTMLDivElement | null = null;

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
  open(value: Position | 'all', index = 0): void {
    this.sidebarToggle(value, true, index);
  }

  /**
   * Закрыть боковую панель
   * @param value Позиция в рамках которой необходимо закрыть боковую панель
   * @return void
   */
  close(value: Position | 'all'): void {
    this.sidebarToggle(value, false);
  }

  /**
   * Устанавливает режим рендеренга боковых панеле
   * @param position Позиция панелей
   * @param mode Режим
   * @return void
   */
  setMode(position: Position | 'all', mode: RenderModeType): void {
    const changeMode = (
      paneRef: HTMLDivElement | undefined,
      position: Position
    ) => {
      if (!paneRef) {
        return;
      }
      if (
        mode === 'push' &&
        paneRef.classList.contains(`sidebar-accordion__${position}-pane_over`)
      ) {
        paneRef.classList.remove(`sidebar-accordion__${position}-pane_over`);
      } else if (
        mode === 'over' &&
        !paneRef.classList.contains(`sidebar-accordion__${position}-pane_over`)
      ) {
        paneRef.classList.add(`sidebar-accordion__${position}-pane_over`);
      }
    };

    if (position === 'all') {
      Object.keys(this.panesRefs).forEach(key => {
        const propName = key as Position;
        changeMode(this.panesRefs[propName], propName as Position);
      });
    } else {
      changeMode(this.panesRefs[position], position);
    }

    type cssStyleProp =
      | 'left'
      | 'right'
      | 'paddingLeft'
      | 'paddingRight'
      | 'paddingTop'
      | 'paddingBottom';

    Object.keys(this.panesRefs).forEach(key => {
      const propName = key as Position;

      const style = this.getPaneStyle(propName);
      Object.keys(style).forEach(propStyle => {
        this.panesRefs[propName]?.style.setProperty(
          propStyle,
          style[propStyle as cssStyleProp] as string
        );
      });
    });
  }

  /**
   * Осуществляет переключение состояния панелей
   * @param position Позиция боковой панели где требуется переключение
   * @param opened Открыть/закрыть
   * @param index Индекс боковой панели
   * @return void
   */
  private sidebarToggle(
    position: Position | 'all',
    opened: boolean,
    index?: number
  ): void {
    const getSidebars = (position: Position) => {
      const arr: Element[] = [];
      const paneRef = this.panesRefs[position as Position];
      if (paneRef) {
        if (position === 'left' || position === 'top') {
          for (let i = paneRef.children.length - 1; i >= 0; i--) {
            arr.push(paneRef.children[i]);
          }
        } else {
          for (let i = 0; i < paneRef.children.length; i++) {
            arr.push(paneRef.children[i]);
          }
        }
      }
      return arr;
    };

    const sidebars: Element[] = getSidebars(position as Position);

    switch (position) {
      case 'all':
        Object.keys(this.panesRefs).forEach(key => {
          const sidebars = getSidebars(key as Position);

          if (opened) {
            sidebars.forEach((sidebar, i) => {
              if (i > 0) {
                SidebarAccordion.removeAttrOpen(sidebar);
              } else if (i === 0) {
                SidebarAccordion.addAttrOpen(sidebar);
              }
            });
          } else {
            sidebars.forEach(sidebar =>
              SidebarAccordion.removeAttrOpen(sidebar)
            );
          }
        });
        break;
      default:
        sidebars.forEach(s => SidebarAccordion.removeAttrOpen(s));

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

    const getSidebar = (elm: HTMLDivElement): HTMLDivElement | undefined => {
      if (!elm) {
        return;
      }

      if (elm.classList[0] !== 'sidebar') {
        return getSidebar(elm.parentElement as HTMLDivElement);
      } else {
        return elm;
      }
    };

    const sidebar = getSidebar(e.target as HTMLDivElement);

    const paneRef = this.panesRefs[sender.props.position as Position];

    const eventArgs: SidebarOpenChangedEventArgs = {
      position: sender.props.position
    };

    if (paneRef) {
      for (let i = 0; i < paneRef.children.length; i++) {
        const itemRef = paneRef.children[i];

        if (itemRef === sidebar) {
          if (itemRef.hasAttribute('open')) {
            itemRef.removeAttribute('open');
            eventArgs.close = i;
          } else {
            itemRef.setAttribute('open', '');
            eventArgs.open = i;
          }
        } else if (itemRef !== sidebar && itemRef.hasAttribute('open')) {
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
    if (sidebar) {
      sidebar.setAttribute('open', '');
    }
  }

  /**
   * Удаляет атрибут открытия панели
   * @param sidebar Ссылка на DOM элемент боковой панели
   * @return void
   */
  private static removeAttrOpen(sidebar: Element): void {
    if (sidebar) {
      sidebar.removeAttribute('open');
    }
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
    const { className, children, mode } = this.props as Props;
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

    /**
     * Метод получения css класса для областей контента
     * @param position Область размещения панелей
     * @param mode Режим
     * @return css класс
     */
    const getPaneClassName = (
      position: Position,
      mode?: RenderModeType
    ): string => {
      return (
        `sidebar-accordion__${position}-pane` +
        (mode && mode === 'over'
          ? ` sidebar-accordion__${position}-pane_over`
          : '')
      );
    };

    return (
      <div
        ref={elm => (this.rootRef = elm)}
        className={'sidebar-accordion' + (className ? ` ${className}` : '')}
      >
        <div
          ref={elm => (this.panesRefs['left'] = elm as HTMLDivElement)}
          className={getPaneClassName('left', mode?.left)}
        >
          {leftPane.reverse().map((item, index) => {
            return (
              <React.Fragment key={'left-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.panesRefs['top'] = elm as HTMLDivElement)}
          className={getPaneClassName('top', mode?.top)}
        >
          {topPane.reverse().map((item, index) => {
            return (
              <React.Fragment key={'top-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.panesRefs['right'] = elm as HTMLDivElement)}
          className={getPaneClassName('right', mode?.right)}
        >
          {rightPane.map((item, index) => {
            return (
              <React.Fragment key={'right-pane' + index}>{item}</React.Fragment>
            );
          })}
        </div>
        <div
          ref={elm => (this.panesRefs['bottom'] = elm as HTMLDivElement)}
          className={getPaneClassName('bottom', mode?.bottom)}
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

  /**
   * Возвращает css стили для области размещения панелей
   * @param position Позиция
   * @return css стиль
   */
  private getPaneStyle(position: Position): HTMLStyle {
    const root = document.documentElement;
    const spaceSidebarHeader = +getComputedStyle(root)
      .getPropertyValue(`--sidebar-accordion-space__sidebar-header`)
      .replace('px', '');

    const spaceSidebarHeaderBorder = +getComputedStyle(root)
      .getPropertyValue(`--sidebar-accordion-space__sidebar-header-border`)
      .replace('px', '');

    const leftPaneIsOver = this.panesRefs['left']?.classList.contains(
      `sidebar-accordion__left-pane_over`
    );
    const topPaneIsOver = this.panesRefs['top']?.classList.contains(
      `sidebar-accordion__top-pane_over`
    );
    const rightPaneIsOver = this.panesRefs['right']?.classList.contains(
      `sidebar-accordion__right-pane_over`
    );
    const bottomPaneIsOver = this.panesRefs['bottom']?.classList.contains(
      `sidebar-accordion__bottom-pane_over`
    );

    const leftSidebarCount =
      this.panesRefs['left']?.querySelectorAll('.sidebar-header').length || 0;
    const topSidebarCount =
      this.panesRefs['top']?.querySelectorAll('.sidebar-header').length || 0;
    const rightSidebarCount =
      this.panesRefs['right']?.querySelectorAll('.sidebar-header').length || 0;
    const bottomSidebarCount =
      this.panesRefs['bottom']?.querySelectorAll('.sidebar-header').length || 0;

    const style: HTMLStyle = {};

    switch (position) {
      case 'top':
      case 'bottom':
        const currentPaneIsOver = this.panesRefs[position]?.classList.contains(
          `sidebar-accordion__${position}-pane_over`
        );

        if (currentPaneIsOver) {
          if (leftPaneIsOver) {
            style.left =
              leftSidebarCount * spaceSidebarHeader +
              spaceSidebarHeaderBorder +
              'px';
          } else {
            style.left = '0';
          }
          if (rightPaneIsOver) {
            style.right =
              rightSidebarCount * spaceSidebarHeader +
              spaceSidebarHeaderBorder +
              'px';
          } else {
            style.right = '0';
          }
          return style;
        } else {
          if (leftPaneIsOver) {
            style.paddingLeft =
              leftSidebarCount * spaceSidebarHeader +
              spaceSidebarHeaderBorder +
              'px';
          }

          if (rightPaneIsOver) {
            style.paddingRight =
              rightSidebarCount * spaceSidebarHeader +
              spaceSidebarHeaderBorder +
              'px';
          }
          return style;
        }
      case undefined:
      case null:
        if (leftPaneIsOver) {
          style.paddingLeft =
            leftSidebarCount * spaceSidebarHeader +
            spaceSidebarHeaderBorder +
            'px';
        }
        if (topPaneIsOver) {
          style.paddingTop =
            topSidebarCount * spaceSidebarHeader +
            spaceSidebarHeaderBorder +
            'px';
        }
        if (rightPaneIsOver) {
          style.paddingRight =
            rightSidebarCount * spaceSidebarHeader +
            spaceSidebarHeaderBorder +
            'px';
        }
        if (bottomPaneIsOver) {
          style.paddingBottom =
            bottomSidebarCount * spaceSidebarHeader +
            spaceSidebarHeaderBorder +
            'px';
        }

        return style;
      default:
        return {};
    }
  }

  /**
   * Осуществляет корректировку максимального размера боковых панелей
   * @return void
   */
  private correctMaxSizeSidebars() {
    if (!this.rootRef) {
      return;
    }
    const setSpaceSidebar = (
      openedSidebarsPosition: Position[],
      outOfScreenSize: number
    ) => {
      openedSidebarsPosition.forEach(s => {
        let spaceSidebar = +getComputedStyle(root)
          .getPropertyValue(`--sidebar-accordion-space__sidebar-content-${s}`)
          .replace('px', '');

        if (spaceSidebar < 0) {
          spaceSidebar *= -1;
        }

        let spaceValue = spaceSidebar - outOfScreenSize;

        if (spaceValue < 0) {
          spaceValue = 0;
        }

        root.style.setProperty(
          `--sidebar-accordion-space__sidebar-content-${s}`,
          spaceValue + 'px'
        );
      });
    };

    const getSidebarsOver = (
      position: Position,
      pane?: HTMLDivElement
    ): Position[] => {
      const sidebarsPosition: Position[] = [];
      if (!pane) {
        return sidebarsPosition;
      }
      for (let i = 0; i < pane.children.length; i++) {
        const sidebar = pane.children[i] as HTMLDivElement;
        if (
          sidebar.getAttribute('open') &&
          sidebar.className.includes(`sidebar-accordion__${position}-pane_over`)
        ) {
          sidebarsPosition.push(position);
        }
      }
      return sidebarsPosition;
    };

    const root = document.documentElement;

    const spaceSidebarHeaderBorder = +getComputedStyle(root)
      .getPropertyValue(`--sidebar-accordion-space__sidebar-header-border`)
      .replace('px', '');

    const outOfScreenWidth =
      this.rootRef.scrollWidth -
      (this.rootRef.clientWidth + spaceSidebarHeaderBorder);
    const outOfScreenHeight =
      this.rootRef.scrollHeight -
      (this.rootRef.clientHeight + spaceSidebarHeaderBorder);

    if (outOfScreenWidth > 0) {
      const openedSidebarsW: Position[] = [
        ...getSidebarsOver('left', this.panesRefs.left),
        ...getSidebarsOver('right', this.panesRefs.right)
      ];
      setSpaceSidebar(openedSidebarsW, outOfScreenWidth);
    }
    if (outOfScreenHeight > 0) {
      const openedSidebarsH: Position[] = [
        ...getSidebarsOver('top', this.panesRefs.top),
        ...getSidebarsOver('bottom', this.panesRefs.bottom)
      ];
      setSpaceSidebar(openedSidebarsH, outOfScreenHeight);
    }
  }
}

export type RenderModeType = 'push' | 'over';

export type Position = 'left' | 'top' | 'right' | 'bottom';

export interface SidebarOpenChangedEventArgs {
  position: Position;
  open?: number;
  close?: number;
}

export { SidebarAccordion };
