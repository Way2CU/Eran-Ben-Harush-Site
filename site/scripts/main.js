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

function Tween(target, start_value, end_value, duration) {
	var self = this;

	self._target = target;
	self._start_value = start_value;
	self._end_value = end_value;
	self._duration = duration;
	self._current_value = start_value;
	self._total_value = null;
	self._step_size = null;
	self._last_frame_time = null;

	self._init = function() {
		// pre-calculate values to minimize operations later
		self._total_value = self._end_value - self._start_value;
		self._step_size = self._total_value / self._duration;

		// initial frame time
		//Here
		self._last_frame_time = Date.now();

		// start animation
		window.requestAnimationFrame(self._callback);
	};

	self._callback = function() {
		var current_frame_time = Date.now();
		var step = self._step_size * (current_frame_time - self._last_frame_time);

		// increase value
		self._current_value += step;

		// set last frame time
		self._last_frame_time = current_frame_time;

		// set target value
		if (self._current_value < self._end_value) {
			self._target.html(Math.round(self._current_value));

			// continue animation
			window.requestAnimationFrame(self._callback);

		} else {
			self._target.html(Math.round(self._end_value));
		}
	};

	// finalize object
	self._init();
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();
	if(window.location.href.indexOf("terms-of-use") < 0) {	
		var self_window = $(window);
		var is_position = true;
		var position = $('section#methodology').offset().top - 400;
		var methodology_links = $('section#methodology li.stock.feature');

		// initialize animate object
		Site.animate_talk = new animate($('section#talk'),$('section#talk li'),$('section#methodology li'),200);
		Site.animate_solution = new animate($('section#solutions'),$('section#solutions li'),$('section#solutions'),400);

		// Function for displaying tween animation triggered by window position
		self_window.scroll(function (event) {
			if(self_window.scrollTop() >= position && is_position) {
				is_position = false;
				methodology_links.each(function() {
					var end_value = parseInt($(this).find('p').eq(0).text());
					new Tween($(this).find('p').eq(0), 0, end_value, 2000);
				});
			}
		});
	}
};


// connect document `load` event with handler function
$(Site.on_load);
