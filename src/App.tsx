import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { SidebarHeader } from './components';
import { Sidebar } from './components/sidebar';
import { SidebarContent } from './components/sidebar-content';
import {
  SidebarAccordion,
  SidebarOpenChangedEventArgs
} from './components/sidebar-accordion';
import { SidebarAccordionContent } from './components/sidebar-accordion-content';

/**
 * Основной компонент
 * @constructor
 */
function App(): JSX.Element {
  let sidebarAccordionRef: SidebarAccordion | null;

  useEffect(() => {
    // sidebarAccordionRef?.open('right', 1);
    // sidebarAccordionRef?.open('left');
    sidebarAccordionRef?.open('all');

    setTimeout(() => sidebarAccordionRef?.close('all'), 10000);
    console.log(sidebarAccordionRef);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <SidebarAccordion
        ref={elm => (sidebarAccordionRef = elm)}
        sidebarOpenChanged={(e: SidebarOpenChangedEventArgs) => {
          console.log(e.position, 'open:', e.open, 'close:', e.close);
        }}
      >
        {{
          content: <SidebarAccordionContent>ssssss</SidebarAccordionContent>,
          sidebars: [
            <Sidebar
              key="sidebar-right-1"
              position="right"
              headerClicked={() => console.log('sidebar click header')}
            >
              {{
                header: (
                  <SidebarHeader
                    clicked={e => {
                      console.log('click', e);
                    }}
                  >
                    this is header
                  </SidebarHeader>
                ),
                content: <SidebarContent>this is content</SidebarContent>
              }}
            </Sidebar>,
            <Sidebar
              key="sidebar-right-2"
              position="right"
              headerClicked={() => console.log('sidebar click header')}
            >
              {{
                header: (
                  <SidebarHeader
                    className="app__sidebar-header"
                    clicked={e => {
                      console.log('click', e);
                    }}
                  >
                    this is header
                  </SidebarHeader>
                ),
                content: <SidebarContent>this is content</SidebarContent>
              }}
            </Sidebar>,
            <Sidebar
              key="sidebar-left-1"
              position="left"
              headerClicked={() => console.log('sidebar click header')}
            >
              {{
                header: (
                  <SidebarHeader
                    className="app__sidebar-header"
                    clicked={e => {
                      console.log('click', e);
                    }}
                  >
                    this is header
                  </SidebarHeader>
                ),
                content: <SidebarContent>this is content</SidebarContent>
              }}
            </Sidebar>,
            <Sidebar
              key="sidebar-left-2"
              position="left"
              headerClicked={() => console.log('sidebar click header')}
            >
              {{
                header: (
                  <SidebarHeader
                    className="app__sidebar-header"
                    clicked={e => {
                      console.log('click', e);
                    }}
                  >
                    this is header
                  </SidebarHeader>
                ),
                content: <SidebarContent>this is content</SidebarContent>
              }}
            </Sidebar>
          ]
        }}
      </SidebarAccordion>
    </div>
  );
}

export default App;
