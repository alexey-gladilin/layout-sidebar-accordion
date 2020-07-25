import React, { FunctionComponent, ReactChild } from 'react';

/**
 * Параметры компонента
 */
interface SidebarContentProps {
  className?: string;
  children?: ReactChild;
}

type Props = Readonly<SidebarContentProps>;

/**
 * Содержимое боковой панели
 * @param children Дочерние элементы
 * @param className Css класс
 * @constructor
 */
const SidebarContent: FunctionComponent<Props> = ({
  className,
  children
}: Props) => {
  return (
    <div className={'sidebar-content' + (className ? ` ${className}` : '')}>
      {children}
    </div>
  );
};

export { SidebarContent };
