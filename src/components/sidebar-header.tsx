import React, { FunctionComponent, ReactChild } from 'react';

/**
 * Параметры компонента
 */
interface SidebarHeaderProps {
  className?: string;
  clicked?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  touchMoved?: (e: React.TouchEvent<HTMLDivElement>) => void;
  touchEnded?: (e: React.TouchEvent<HTMLDivElement>) => void;
  children?: ReactChild | ReactChild[];
}

type Props = Readonly<SidebarHeaderProps>;

/**
 * Заголовок панели
 * @param className Наименование css класса
 * @param children Дочерние элементы
 * @param clicked Событие клика по заголовку
 * @param touchEnded Событие окончания нажатия пальцем на заголовок
 * @param touchMoved События перемещения пальцем по заголовку
 * @constructor
 */
const SidebarHeader: FunctionComponent<Props> = ({
  className,
  children,
  clicked,
  touchEnded,
  touchMoved
}: Props) => {
  /**
   * Обработчик события клика по заголовку
   * @param e Параметры события
   * @returns type 'void'
   */
  const onClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (clicked) {
      clicked(e);
    }
  };

  /**
   * Обработчик события перемещения пальца
   * @param e Параметры события
   * @returns type 'void'
   */
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (touchMoved) {
      touchMoved(e);
    }
  };

  /**
   * Обработчик события завершения перемещения пальца
   * @param e Параметры события
   * @returns type 'void'
   */
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (touchEnded) {
      touchEnded(e);
    }
  };

  return (
    <div
      className={'sidebar-header' + (className ? ` ${className}` : '')}
      onClick={e => onClicked(e)}
      onTouchMove={e => onTouchMove(e)}
      onTouchEnd={e => onTouchEnd(e)}
    >
      <div className="sidebar-header__content">
        <div className="sidebar-header__wrapper">{children}</div>
      </div>
    </div>
  );
};

export { SidebarHeader };
