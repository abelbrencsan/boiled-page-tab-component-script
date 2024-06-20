/**
 * Tab
 * Copyright 2024 Abel Brencsan
 * Released under the MIT License
 */
const Tab = function(options) {

	'use strict';

	// Test required options
	if (!(options.panels instanceof NodeList)) {
		throw 'Tab "panels" must be a `NodeList`';
	}
	if (!(options.triggers instanceof NodeList)) {
		throw 'Tab "triggers" must be a `NodeList`';
	}

	// Default tab instance options
	let defaults = {
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
	for (let key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Tab instance variables
	this.index = 0;
	this.isInitialized = false;

};

Tab.prototype = function () {

	'use strict';

	let tab = {

		/**
		* Initialize tab.
		* 
		* @public
		*/
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				tab.handleEvents.call(this, event);
			};
			for (let i = 0; i < this.triggers.length; i++) {
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
		* Select tab by given index.
		* 
		* @public
		* @param {number} index
		* @param {boolean} setFocus
		*/
		select: function(index, setFocus) {
			this.index = index;
			if (this.triggers.length - 1 < index) {
				this.index = 0;
			}
			else if (index < 0) {
				this.index = this.triggers.length - 1;
			}
			for (let i = 0; i < this.triggers.length; i++) {
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
		* Show tab at given index.
		* 
		* @private
		* @param {number} index
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
		* Hide tab at given index.
		* 
		* @private
		* @param {number} index
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
		* Handle events.
		* On trigger click: select tab item.
		* On right arrow keydown: select next tab item.
		* On left arrow keydown: select previous tab item.
		* 
		* @private
		* @param {Event} event
		*/
		handleEvents: function(event) {
			switch(event.type) {
				case 'click':
					event.preventDefault();
					for (let i = 0; i < this.triggers.length; i++) {
						if (event.target == this.triggers[i] || this.triggers[i].contains(event.target)) {
							tab.select.call(this, i, true);
						}
					}
					break;
				case 'keydown':
					if (event.key == 'ArrowLeft') {
						event.preventDefault();
						tab.select.call(this, this.index - 1, true);
					}
					if (event.key == 'ArrowRight') {
						event.preventDefault();
						tab.select.call(this, this.index + 1, true);
					}
					break;
			}
		},

		/**
		* Destroy tab.
		* 
		* @public
		*/
		destroy: function() {
			if (!this.isInitialized) return;
			for (let i = 0; i < this.triggers.length; i++) {
				this.triggers[i].removeEventListener('click', this);
				this.triggers[i].removeEventListener('keydown', this);
				this.triggers[i].classList.remove(this.isSelectedClass);
				this.triggers[i].removeAttribute('aria-selected');
				this.triggers[i].removeAttribute('tabindex');
			}
			for (let i = 0; i < this.panels.length; i++) {
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
