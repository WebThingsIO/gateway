const TIMEOUT_MS = 5000;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Elements {
  constructor(browser) {
    this.browser = browser;
  }

  defineDisplayedProperty(name, selector) {
    // Create new method which checks if elements are displayed.
    /**
     * @method hasName
     * @return boolean
     */
    this[`has${capitalizeFirstLetter(name)}`] = async () => {
      const rootElement = this.rootElement;
      if (!rootElement) {
        return await this.browser.isExisting(selector);
      }
      const elements = await this.browser.elementIdElements(
        rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
        selector);
      if (elements.value.length == 0) {
        return false;
      }
      // Check that all elements are displayed which match the selector.
      return await elements.value.reduce(async (result, e) => {
        const isExisting = await this.browser.elementIdDisplayed(e.ELEMENT);
        return result && isExisting;
      }, true);
    };
  }

  // Create new method which waits for elements are displayed.
  defineWaitForProperty(name, selector) {
    /**
     * @method waitForName
     */
    this[`waitFor${capitalizeFirstLetter(name)}`] = async () => {
      const rootElement = this.rootElement;
      if (!rootElement) {
        return await this.browser.waitForExist(selector, TIMEOUT_MS);
      }
      return await this.browser.waitUntil(async () => {
        const elements = await this.browser.elementIdElements(
          rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
          selector
        );
        return elements.value.length > 0;
      }, TIMEOUT_MS);
    };
  }

  // Create new method which defines an HTML element.
  defineElement(name, selector) {
    /**
     * @method name
     * @return element
     */
    this[name] = async () => {
      const rootElement = this.rootElement;
      if (!rootElement) {
        const elements = await this.browser.elements(selector);
        return elements.value[0];
      }
      return await this.browser.elementIdElement(
        rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
        selector
      );
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector);
  }

  // Create new method which defines multiple HTML elements.
  defineElements(name, selector) {
    /**
     * @method name
     * @return element
     */
    this[name] = async () => {
      const rootElement = this.rootElement;
      if (!rootElement) {
        return await this.browser.elements(selector);
      }
      return await this.browser.elementIdElements(
        rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
        selector
      );
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector);
  }
}

class Section extends Elements {
  constructor(browser, rootElement) {
    super(browser);
    this.rootElement = rootElement;
  }
}

class Page extends Elements {
  constructor(browser, path) {
    super(browser);
    this.path = path;
  }

  /**
   * Define properties for section.
   * @param {String} name
   * @param {String} selector
   * @param {Class Section} section
   */
  defineSection(name, selector, section) {
    /**
     * @method name
     * @return Section
     */
    this[name] = async () => {
      let e = null;
      const rootElement = this.rootElement;
      if (rootElement) {
        e = await this.browser.elementIdElement(
          rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
          selector
        );
      } else {
        const elements = await this.browser.elements(selector);
        e = elements.value[0];
      }
      return new section(this.browser, e);
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector);
  }

  /**
   * Define properties for sections.
   * @param {String} name
   * @param {String} selector
   * @param {Class Section} section
   */
  defineSections(name, selector, section) {
    /**
     * @method name
     * @return Array[Section]
     */
    this[name] = async () => {
      let elements = null;
      const rootElement = this.rootElement;
      if (rootElement) {
        elements = await this.browser.elementIdElements(
          rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
          selector
        );
      } else {
        elements = await this.browser.elements(selector);
      }
      return elements.value.map((e) => new section(this.browser, e));
    };

    this.defineDisplayedProperty(name, selector);
    this.defineWaitForProperty(name, selector);
  }

  async open() {
    await this.browser.url(this.path);
  }
}


module.exports = {Page, Section};
