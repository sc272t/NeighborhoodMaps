var Location = function(data) {
		//var self = this;
		//this.title = ko.observable(data.title);
		this.title = data.title
		this.location = data.location;
	};

var ViewModel = function() {
		var self = this;
		self.locationsList = ko.observableArray([]);
		locations.forEach(function(location) {
			self.locationsList.push(new Location(location));
		});
		//Will show when Google Maps is unavailable
		self.mapError = ko.observable(false);
		//populates input value from search box
		self.searchedLocation = ko.observable(""); 
		
		self.filteredLocations = ko.computed(function() {
		var filter = self.searchedLocation().toLowerCase();
			if (!filter) {
            for (var i = 0; i < self.locationsList().length; i++) {
				if (self.locationsList()[i].marker) {
					self.locationsList()[i].marker.setVisible(true);
				}
            }
			 return self.locationsList();
			}
			else {
				return ko.utils.arrayFilter(self.locationsList(), function(loc) {
				// if location matches filter and store results as a variable
				var  match = loc.title.toLowerCase().indexOf(filter) >= 0;
				// set marker visibility based on match status
				if (loc.marker) {
					loc.marker.setVisible(match);

				}
				// return match status to item in list view if match
				return match;
				});
			}
			}, self);
				
		self.resetLocation = function() {
			self.searchedLocation(""); //To reset the list view filtered locations
			for (var t = 0; self.locationsList().length; t++) {
				self.locationsList()[i].marker.setVisible(true);
			}
		}
		
		self.currentLocation = ko.observableArray([this.locationsList()[0]]);

		this.selectedLocation = function(clickedLocation) {
			//sets the currentLocation to selected element from the list view
			self.currentLocation(clickedLocation);
			toggleBounce(clickedLocation.marker);
			// Clear the infowindow content to give the streetview time to load.
			populateInfoWindow(clickedLocation.marker, infoWindow);
			}
		self.visibleMenu = ko.observable(false),
		self.clickMe = function() {
		this.visibleMenu(!this.visibleMenu());
		};

};

		var  vm = new ViewModel();
		ko.applyBindings(vm);