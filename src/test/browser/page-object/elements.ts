import webdriverio from 'webdriverio';

const TIMEOUT_MS = 30000;

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class Elements {
  protected browser: webdriverio.BrowserObject;

  protected rootElement?: webdriverio.Element;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;

  constructor(browser: webdriverio.BrowserObject, rootElement?: webdriverio.Element) {
    this.browser = browser;
    this.rootElement = rootElement;
  }

  defineDisplayedProperty(name: string, selector: string): void {
    // Create new method which checks if elements are displayed.
    /**
     * @method hasName
     * @return boolean
     */
    this[`has${capitalizeFirstLetter(name)}`] = async () => {
      const rootElement = this.rootElement;
      if (!rootElement) {
        const el = await this.browser.$(selector);
        return await el.isExisting();
      }

      const elements = await rootElement.$$(selector);
      if (elements.length == 0) {
        return false;
      }

      // Check that all elements are displayed which match the selector.
      for (const el of elements) {
        if (!(await el.isDisplayed())) {
          return false;
        }
      }

      return true;
    };
  }

  // Create new method which waits for elements are displayed.
  defineWaitForProperty(name: string, selector: string, onValue?: boolean): void {
    /**
     * @method waitForName
     */
    this[`waitFor${capitalizeFirstLetter(name)}`] = async () => {
      const rootElement = this.rootElement;
      if (!rootElement) {
        const el = await this.browser.$(selector);
        return await el.waitForExist(TIMEOUT_MS);
      }

      return await this.browser.waitUntil(async () => {
        const elements = await rootElement.$$(selector);

        if (typeof onValue === 'boolean') {
          for (const el of elements) {
            const data = await el.getProperty('on');

            if (data === onValue) {
              return true;
            }
          }

          return false;
        } else {
          return elements.length > 0;
        }
      }, TIMEOUT_MS);
    };
  }

  // Create new method which defines an HTML element.
  defineElement(name: string, selector: string, onValue?: boolean): void {
    /**
     * @method name
     * @return element
     */
    this[name] = async () => {
      const rootElement = this.rootElement || this.browser;
      return await rootElement.$(selector);
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector, onValue);
  }

  // Create new method which defines multiple HTML elements.
  defineElements(name: string, selector: string, onValue?: boolean): void {
    /**
     * @method name
     * @return element
     */
    this[name] = async () => {
      const rootElement = this.rootElement || this.browser;
      return await rootElement.$$(selector);
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector, onValue);
  }
}

export class Section extends Elements {}

export class Page extends Elements {
  protected path: string;

  constructor(browser: webdriverio.BrowserObject, path: string) {
    super(browser);
    this.path = path;
  }

  /**
   * Define properties for section.
   * @param {String} name
   * @param {String} selector
   * @param {Class Section} section
   * @param {Boolean} onValue
   */
  defineSection(name: string, selector: string, section: typeof Section, onValue?: boolean): void {
    /**
     * @method name
     * @return Section
     */
    this[name] = async () => {
      const rootElement = this.rootElement || this.browser;
      const e = await rootElement.$(selector);
      return new section(this.browser, e);
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector, onValue);
  }

  /**
   * Define properties for sections.
   * @param {String} name
   * @param {String} selector
   * @param {Class Section} section
   * @param {Boolean} onValue
   */
  defineSections(name: string, selector: string, section: typeof Section, onValue?: boolean): void {
    /**
     * @method name
     * @return Array[Section]
     */
    this[name] = async () => {
      const rootElement = this.rootElement || this.browser;
      const elements = await rootElement.$$(selector);
      return elements.map((e) => new section(this.browser, e));
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector, onValue);
  }

  async open(): Promise<void> {
    await this.browser.url(this.path);
  }
}
