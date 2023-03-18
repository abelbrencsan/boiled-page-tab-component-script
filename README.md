# Boiled Page tab component and script

Tab SCSS singleton and script for Boiled Page frontend framework. They are intended to create responsive tabbed content.

## Install

Place `_tab.scss` file to `/assets/css/components` directory, and add its path to component block in `assets/css/app.scss` file. 

You will also need to place `tab.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts.

## Usage

### Tab component

#### Classes

Class name | Description | Example
---------- | ----------- | -------
`tab` | Applies a tab. | `<div class="tab"></div>`
`tab-triggers` | Applies a group of triggers inside tab. | `<div class="tab-triggers"></div>`
`tab-panel` | Applies a panel for content inside tab. | `<div class="tab-panel"></div>`

#### Examples

##### Example 1

The following example shows a tab with 3 items.

```html
<div class="tab" data-tab>
  <div class="tab-triggers" role="tablist">
    <button aria-controls="tab-1" role="tab" data-tab-trigger>First tab</button>
    <button aria-controls="tab-2" role="tab" data-tab-trigger>Second tab</button>
    <button aria-controls="tab-3" role="tab" data-tab-trigger>Third tab</button>
  </div>
  <div id="tab-1" class="tab-panel" role="tabpanel" data-tab-panel>
    <p>1. Nunc lacinia ante nunc ac lobortis. Interdum adipiscing gravida odio porttitor sem non mi integer non faucibus ornare mi ut ante amet placerat aliquet. Volutpat eu sed ante lacinia sapien lorem accumsan varius montes viverra nibh in adipiscing blandit tempus accumsan.</p>
  </div>
  <div id="tab-2" class="tab-panel" role="tabpanel" data-tab-panel>
    <p>2. Nunc lacinia ante nunc ac lobortis. Interdum adipiscing gravida odio porttitor sem non mi integer non faucibus ornare mi ut ante amet placerat aliquet. Volutpat eu sed ante lacinia sapien lorem accumsan varius montes viverra nibh in adipiscing blandit tempus accumsan.</p>
  </div>
  <div id="tab-3" class="tab-panel" role="tabpanel" data-tab-panel>
    <p>3. Nunc lacinia ante nunc ac lobortis. Interdum adipiscing gravida odio porttitor sem non mi integer non faucibus ornare mi ut ante amet placerat aliquet. Volutpat eu sed ante lacinia sapien lorem accumsan varius montes viverra nibh in adipiscing blandit tempus accumsan.</p>
  </div>
</div>
```

Add `tabs` property to `app` object in `assets/js/app.js`.

```js
tabs: []
```

Place the following code inside `assets/js/app.js` to initialize elements with `data-tab` attribute as tabs.

```js
// Initialize tabs
var tabElems = document.querySelectorAll('[data-tab]');
for (var i = 0; i < tabElems.length; i++) {
  app.tabs[i] = new Tab({
    triggers: tabElems[i].querySelectorAll('[data-tab-trigger]'),
    panels: tabElems[i].querySelectorAll('[data-tab-panel]')
  });
  app.tabs[i].init();
}
```

#### Extension ideas

##### Special tab

```scss
/* Tab component extensions */
div.tab {

  // Special tab
  &.tab--special {

    > div.tab-triggers {
      border-left: none;
      margin-bottom: $box-padding;
      margin-left: ($grid-gutter * -1);
      position: relative;

      > button {
        background-color: transparent;
        border-width: 0 0 2px 0;
        font-weight: $bold-font-weight;
        margin-left: $grid-gutter;
        padding: $box-padding * 0.75 0;
        position: relative;

        &.is-selected {
          border-color: $fg-color;
        }
      }

      &:before {
        background-color: $border-color;
        bottom: 0;
        content: '';
        height: 2px;
        position: absolute;
        right: 0;
        width: calc(100% - #{$grid-gutter});
      }
    }

    > div.tab-panel {
      border-radius: 0;
      border: none;
      padding: 0;
    }
  }

  @include breakpoint('small') {

    &.tab--special {

      > div.tab-triggers {
        margin-left: 0;

        > button {
          margin-left: 0;
        }
      }
    }
  }
}
```

### Tab script

#### Usage

To create a new tab instance, call `Tab` constructor the following way:

```js
// Create new tab instance
var tab = new Tab(options);

// Initialize tab instance
tab.init();
```

#### Options

The following options are available for tab constructor:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`panels` | Object | null | Yes | A `NodeList` object of tab panels.
`triggers` | Object | null | Yes | A `NodeList` object of tab triggers.
`initialIndex` | Number | 0 | No | Initial index.
`initCallback` | Function | null | No | Callback function after tab is initialized.
`selectCallback` | Function | null | No | Callback function after a tab item is selected.
`destroyCallback` | Function | null | No | Callback function after tab is destroyed.
`isSelectedClass` | String | 'is-selected' | No | Class added to trigger when tab item is selected.
`isVisibleClass` | String | 'is-visible' | No | Class added to panel when tab item is selected.

#### Methods

##### Initialize tab

`init()` - Initialize tab. It creates related events, show initial tab item.

##### Select tab item by given index

`select(index)` - Show tab item by given index, hide current one.

Parameter | Type | Required | Description
----------|------|----------|------------
index | Number | Yes | Index of tab item to be selected.

##### Destroy tab

`destroy()` - Destroy tab. It removes events, classes and attributes relevant to tab.