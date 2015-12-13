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

	animateElement1 = new Tween($('section#methodology li.ads p:first'),0,219366,2000);
	animateElement2 = new Tween($('section#methodology li.cups p:first'),0,850,2000);
	animateElement3 = new Tween($('section#methodology li.rate p:first'),0,45,2000);
	animateElement3 = new Tween($('section#methodology li.clients p:first'),0,58,2000);


};


// connect document `load` event with handler function
$(Site.on_load);
