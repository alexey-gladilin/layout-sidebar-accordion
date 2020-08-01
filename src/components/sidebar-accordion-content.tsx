import React, { FunctionComponent, ReactChild } from 'react';

interface SidebarAccordionContentProps {
  className?: string;
  children?: ReactChild | ReactChild[];
}

type Props = Readonly<SidebarAccordionContentProps>;

/**
 * Основной контент разметки
 * @param className Css класс
 * @param children Дочерние элементы
 * @constructor
 */
const SidebarAccordionContent: FunctionComponent<Props> = ({
  className,
  children
}: Props) => {
  return (
    <div
      className={
        'sidebar-accordion-content' + (className ? ` ${className}` : '')
      }
    >
      {children}
    </div>
  );
};

export { SidebarAccordionContent };
