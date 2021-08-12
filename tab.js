/**
 * Tab - v1.0.1
 * Copyright 2020 Abel Brencsan
 * Released under the MIT License
 */

var Tab = function(options) {

	'use strict';

	// Test required options
	if (typeof options.panels !== 'object') throw 'Tab "panels" option must be an object';
	if (typeof options.triggers !== 'object') throw 'Tab "triggers" option must be an object';

	// Default tab instance options
	var defaults = {
		panels: null,
		triggers: null,
		initialIndex: 0,
		initCallback: null,
		selectCallback: null,
		destroyCallback: null,
		isSelectedClass: 'is-selected',
		isVisibleClass: 'is-visible'
	};

	// Extend tab instance options with defaults
	for (var key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Tab instance variables
	this.index = 0;
	this.isInitialized = false;

};

Tab.prototype = function () {

	'use strict';

	var tab = {

		/**
		* Initialize tab. It creates related events, show initial tab item. (public)
		*/
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				tab.handleEvents.call(this, event);
			};
			for (var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', this);
				this.triggers[i].addEventListener('keydown', this);
			}
			if (this.initialIndex) {
				this.index = this.initialIndex;
			}
			tab.select.call(this, this.index, false);
			this.isInitialized = true;
			if (this.initCallback) this.initCallback.call(this);
		},

		/**
		* Show tab item by given index, hide current one. (public)
		*/
		select: function(index, setFocus) {
			this.index = index;
			if (this.triggers.length - 1 < index) {
				this.index = 0;
			}
			else if (index < 0) {
				this.index = this.triggers.length - 1;
			}
			for (var i = 0; i < this.triggers.length; i++) {
				if (i !== this.index) {
					tab.hide.call(this, i);
				}
			}
			tab.show.call(this, this.index);
			if (setFocus) {
				this.triggers[this.index].focus();
			}
			if (this.selectCallback) this.selectCallback.call(this);
		},

		/**
		* Show tab by given index. (private)
		*/
		show: function(index) {
			this.triggers[index].classList.add(this.isSelectedClass);
			this.triggers[index].setAttribute('aria-selected', true);
			this.triggers[index].setAttribute('tabindex', 0);
			this.panels[index].classList.add(this.isVisibleClass);
			this.panels[index].setAttribute('aria-hidden', false);
			this.panels[index].setAttribute('tabindex', 0);
		},

		/**
		* Hide tab by given index. (private)
		*/
		hide: function(index) {
			this.triggers[index].classList.remove(this.isSelectedClass);
			this.triggers[index].setAttribute('aria-selected', false);
			this.triggers[index].setAttribute('tabindex', -1);
			this.panels[index].classList.remove(this.isVisibleClass);
			this.panels[index].setAttribute('aria-hidden', true);
			this.panels[index].setAttribute('tabindex', -1);
		},

		/**
		* Handle events. (private)
		* On trigger click: Select tab item.
		* On right arrow keydown: Select next tab item.
		* On left arrow keydown: Select previous tab item.
		* @param event object
		*/
		handleEvents: function(event) {
			switch(event.type) {
				case 'click':
					event.preventDefault();
					for (var i = 0; i < this.triggers.length; i++) {
						if (event.target == this.triggers[i]) {
							tab.select.call(this, i, true);
						}
					}
					break;
				case 'keydown':
					if (event.keyCode == 37) {
						event.preventDefault();
						tab.select.call(this, this.index - 1, true);
					}
					if (event.keyCode == 39) {
						event.preventDefault();
						tab.select.call(this, this.index + 1, true);
					}
					break;
			}
		},

		/**
		* Destroy tab. It removes events, classes and attributes relevant to tab. (public)
		*/
		destroy: function() {
			if (!this.isInitialized) return;
			for (var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].removeEventListener('click', this);
				this.triggers[i].removeEventListener('keydown', this);
				this.triggers[i].classList.remove(this.isSelectedClass);
				this.triggers[i].removeAttribute('aria-selected');
				this.triggers[i].removeAttribute('tabindex');
			}
			for (var i = 0; i < this.panels.length; i++) {
				this.panels[i].classList.remove(this.isVisibleClass);
				this.panels[i].removeAttribute('aria-hidden');
				this.panels[i].removeAttribute('tabindex');
			}
			this.index = 0;
			this.isInitialized = false;
			if (this.destroyCallback) this.destroyCallback.call(this);
		}
	};

	return {
		init: tab.init,
		select: tab.select,
		destroy: tab.destroy
	};

}();
