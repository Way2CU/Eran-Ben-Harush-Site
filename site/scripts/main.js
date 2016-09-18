/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 *    Animate object for animating elements triggered by position of window
 */

function animate(container, container_elements, trigger_element, delay_time) {
	var self = this;

	self.container = container;
	self.container_elements = null;
	self.position = trigger_element.offset().top -300;
	self.delay_time = delay_time;
	self.active = false;
	self._window = $(window);

	/*
	 * object initialization
	 */
	self._init = function() {
		// connect signals
		self._window.on('scroll', self.handle_scroll);
		
		// Find all container elements
		self.container_elements = self.container.find(container_elements);

	}

	self.handle_scroll = function(event) {
		//  position to trigger class on container elements
		var over_position = self._window.scrollTop() >= self.position;

		if (over_position && !self.active) {
			self.container_elements.each(function(index) {
				var item = self.container_elements.eq(index);
				if(!item.hasClass('active')){
					setTimeout(function() {
						self.handle_active(item);
					}, self.delay_time + (index * self.delay_time));
				}
			});

			self.active = true;
			self._window.off('scroll', self.handle_scroll);
		} 
	}

	//  function for adding active class
	self.handle_active = function(item) {
		item.addClass('active');
	}

	// finish object initialization
	self._init();
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	if(window.location.href.indexOf("terms-of-use") < 0) {
		// initialize animate object
		Site.animate_talk = new animate($('section#talk'),$('section#talk li'),$('section#talk'),200);
		Site.animate_solution = new animate($('section#solutions'),$('section#solutions li'),$('section#solutions'),400);
	}
};


// connect document `load` event with handler function
$(Site.on_load);
