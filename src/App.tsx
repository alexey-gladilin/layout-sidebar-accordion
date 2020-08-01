import React from 'react';
import './App.scss';
import { SidebarHeader } from './components';
import { Sidebar } from './components/sidebar';
import { SidebarContent } from './components/sidebar-content';
import {
  SidebarAccordion,
  SidebarOpenChangedEventArgs,
  Position,
  RenderModeType
} from './components/sidebar-accordion';
import { SidebarAccordionContent } from './components/sidebar-accordion-content';

/**
 * Основной компонент
 * @constructor
 */
function App(): JSX.Element {
  let sidebarAccordionRef: SidebarAccordion | null;
  let btnThemeRef: HTMLButtonElement | null;
  let positionRef: HTMLSelectElement | null;
  let sidebarIndexRef: HTMLInputElement | null;
  let selectionModeRef: HTMLSelectElement | null;
  let selectionPositionModeRef: HTMLSelectElement | null;

  /**
   * Обработчик события нажатия на кнопку изменения темы
   * @return void
   */
  const onThemeClick = (): void => {
    let theme = document.getElementsByTagName('html')[0].getAttribute('theme');

    theme !== 'light' && theme !== null ? (theme = 'light') : (theme = 'dark');
    document.getElementsByTagName('html')[0].setAttribute('theme', theme);

    if (btnThemeRef) {
      btnThemeRef.innerText = theme;
    }
  };

  /**
   * Обработчик события нажатия на кнопку "открыть"
   * @return void
   */
  const onOpenClick = (): void => {
    sidebarAccordionRef?.open(
      positionRef?.value as Position,
      sidebarIndexRef ? +sidebarIndexRef.value : undefined
    );
  };

  /**
   * Обработчик события нажатия на кнопку "закрыть"
   * @return void
   */
  const onCloseClick = (): void => {
    sidebarAccordionRef?.close(positionRef?.value as Position);
  };

  /**
   * Обработчик события нажатия на кнопку "Применить"
   * @return void
   */
  const onApplyMode = (): void => {
    sidebarAccordionRef?.setMode(
      selectionPositionModeRef?.value as Position,
      selectionModeRef?.value as RenderModeType
    );
  };

  return (
    <SidebarAccordion
      ref={elm => (sidebarAccordionRef = elm)}
      sidebarOpenChanged={(e: SidebarOpenChangedEventArgs) => {
        console.log(e.position, 'open:', e.open, 'close:', e.close);
      }}
      mode={{
        left: 'over'
      }}
    >
      {{
        content: (
          <SidebarAccordionContent className="app__sidebar-accordion-content ">
            <div>
              <div className="app__options">
                <header>
                  <h1>Options</h1>
                </header>
                <div className="app__options-content">
                  <fieldset>
                    <legend>open/close</legend>
                    <section>
                      <label>position:</label>
                      <select
                        ref={elm => {
                          positionRef = elm;
                        }}
                      >
                        <option>all</option>
                        <option>left</option>
                        <option>top</option>
                        <option>right</option>
                        <option>bottom</option>
                      </select>
                    </section>
                    <section>
                      <label>index:</label>
                      <input
                        ref={elm => (sidebarIndexRef = elm)}
                        type="number"
                        defaultValue={0}
                        max="2"
                        min="0"
                      />
                    </section>
                    <div className="app__section-button">
                      <button style={{ width: '100%' }} onClick={onOpenClick}>
                        open
                      </button>
                      <button style={{ width: '100%' }} onClick={onCloseClick}>
                        close
                      </button>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>sidebar mode</legend>
                    <section>
                      <label>position:</label>
                      <select ref={elm => (selectionPositionModeRef = elm)}>
                        <option>left</option>
                        <option>top</option>
                        <option>right</option>
                        <option>bottom</option>
                      </select>
                    </section>
                    <section>
                      <label>mode:</label>
                      <select ref={elm => (selectionModeRef = elm)}>
                        <option>push</option>
                        <option>over</option>
                      </select>
                    </section>
                    <button style={{ width: '100%' }} onClick={onApplyMode}>
                      apply
                    </button>
                  </fieldset>

                  <fieldset>
                    <legend>theme</legend>
                    <button
                      ref={elm => (btnThemeRef = elm)}
                      style={{ width: '100%' }}
                      onClick={onThemeClick}
                    >
                      light
                    </button>
                  </fieldset>

                  <fieldset style={{ width: 357 }}>
                    <legend>events</legend>
                    <section>
                      <textarea style={{ height: 150, width: 350 }}></textarea>
                    </section>
                  </fieldset>
                </div>
              </div>
              <div>
                <h1>Some content</h1>
                <div className="app__content">
                  <p>The quick brown fox jumps over the lazy dog</p>
                  <article>
                    The earliest known appearance of the phrase is from The
                    Boston Journal. In an article titled "Current Notes" in the
                    February 9, 1885, edition, the phrase is mentioned as a good
                    practice sentence for writing students: "A favorite copy set
                    by writing teachers for their pupils is the following,
                    because it contains every letter of the alphabet: 'A quick
                    brown fox jumps over the lazy dog.'"[1] Dozens of other
                    newspapers published the phrase over the next few months,
                    all using the version of the sentence starting with "A"
                    rather than "The".[2] The earliest known use of the phrase
                    starting with "The" is from the 1888 book Illustrative
                    Shorthand by Linda Bronson.[3] The modern form (starting
                    with "The") became more common despite the fact that it is
                    slightly longer than the original (starting with "A"). As
                    the use of typewriters grew in the late 19th century, the
                    phrase began appearing in typing lesson books as a practice
                    sentence. Early examples include How to Become Expert in
                    Typewriting: A Complete Instructor Designed Especially for
                    the Remington Typewriter (1890),[4] and Typewriting
                    Instructor and Stenographer's Hand-book (1892). By the turn
                    of the 20th century, the phrase had become widely known. In
                    the January 10, 1903, issue of Pitman's Phonetic Journal, it
                    is referred to as "the well known memorized typing line
                    embracing all the letters of the alphabet".[5] Robert
                    Baden-Powell's book Scouting for Boys (1908) uses the phrase
                    as a practice sentence for signaling.[6] The first message
                    sent on the Moscow–Washington hotline on August 30, 1963,
                    was the test phrase "THE QUICK BROWN FOX JUMPED OVER THE
                    LAZY DOG'S BACK 1234567890".[7] Later, during testing, the
                    Russian translators sent a message asking their American
                    counterparts, "What does it mean when your people say 'The
                    quick brown fox jumped over the lazy dog'?"[8] During the
                    20th century, technicians tested typewriters and
                    teleprinters by typing the sentence.[9]
                  </article>
                </div>
              </div>
            </div>
          </SidebarAccordionContent>
        ),
        sidebars: [
          <Sidebar
            key="sidebar-right-0"
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
                  <div>right-pane0-header-row1</div>
                  <div>right-pane0-header-row2</div>
                </SidebarHeader>
              ),
              content: <SidebarContent>right-pane0-content</SidebarContent>
            }}
          </Sidebar>,
          <Sidebar
            key="sidebar-right-1"
            position="right"
            headerClicked={() => console.log('sidebar click header')}
          >
            {{
              content: (
                <SidebarContent>
                  right-pane1-content without header
                </SidebarContent>
              )
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
                  right-pane1-header
                </SidebarHeader>
              ),
              content: <SidebarContent>right-pane1-content</SidebarContent>
            }}
          </Sidebar>,
          <Sidebar
            key="sidebar-left-0"
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
                  left-pane0-header
                </SidebarHeader>
              ),
              content: <SidebarContent>left-pane0-content</SidebarContent>
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
                  left-pane1-header
                </SidebarHeader>
              ),
              content: <SidebarContent>left-pane1-content</SidebarContent>
            }}
          </Sidebar>,
          <Sidebar
            key="sidebar-top-0"
            position="top"
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
                  top-pane0-header
                </SidebarHeader>
              ),
              content: <SidebarContent>top-pane0-content</SidebarContent>
            }}
          </Sidebar>,
          <Sidebar
            key="sidebar-top-1"
            position="top"
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
                  top-pane1-header
                </SidebarHeader>
              ),
              content: <SidebarContent>top-pane1-content</SidebarContent>
            }}
          </Sidebar>,
          <Sidebar
            key="sidebar-bottom-0"
            position="bottom"
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
                  bottom-pane0-header
                </SidebarHeader>
              ),
              content: <SidebarContent>bottom-pane0-content</SidebarContent>
            }}
          </Sidebar>,
          <Sidebar
            key="sidebar-bottom-1"
            position="bottom"
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
                  top-pane1-header
                </SidebarHeader>
              ),
              content: <SidebarContent>bottom-pane1-content</SidebarContent>
            }}
          </Sidebar>
        ]
      }}
    </SidebarAccordion>
  );
}

export default App;
