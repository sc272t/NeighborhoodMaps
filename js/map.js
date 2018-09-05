	//define global variables
	var map;
      // Create a new blank array for all the listing markers.
    var markers = [];
	var infoWindow;
	  //locations is the array
	var locations = [
          {title: '33rd St Midtown', location: {lat: 40.74918887894443, lng: -73.98830870163144}, name: '33rd Street'},
          {title: 'World Trade Center Financial District', location: {lat: 40.71182926326535, lng: -74.01171660169312}, name: 'World Trade Center'},
          {title: '14th Street Downtown', location: {lat: 40.737437547323744, lng: -73.99693094613774}, name: '14th Street'},
          {title: 'Christopher Street Downtown', location: {lat: 40.73293683885262, lng: -74.00690471503522}, name: 'Christopher Street'},
          {title: '9th Street Greenwich Village', location: {lat: 40.73411866697534, lng: -73.99891649333695}, name: '9th Street'},
          {title: '23rd Street Flatiron District', location: {lat: 40.74304922009359, lng: -73.99287688121208}, name: '23rd Street'},
		  {title: 'Grove Street Jersey City', location: {lat: 40.71968678196704, lng: -74.0428270511608}, name: 'Grove Street'},
          {title: 'Newport Jersey City', location: {lat: 40.72716325019128, lng: -74.03431263421655}, name: 'Newport'},
		  {title: 'Exchange Place Jersey City', location: {lat: 40.71624906568188, lng: -74.03320670127869}, name: 'Exchange Place'},
		  {title: 'Hoboken', location: {lat: 40.734958, lng: -74.0276}, name: 'Hoboken'}
        ];
	var wikiURL;
	var venue;
	var venueName;
	var category;
	var street;
	var city;
	var state;
	var zip;
	var address;

	function initMap() {
	// custom styling of the google map
		var styles = [
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": 30
            },
			{
				"color": "#ffffb3"
			}
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
	{
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#a9f07e"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#b3c6ff"
            }
        ]
    },
	
]
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.728157, lng: -74.077642},
          zoom: 21,
		  styles: styles,
          mapTypeControl: true,
		  mapTypeControlOptions: {
			  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			  position: google.maps.ControlPosition.TOP_RIGHT
		  }
        });
		
		var largeInfowindow = new google.maps.InfoWindow();
		var bounds = new google.maps.LatLngBounds();
		infoWindow = new google.maps.InfoWindow();
		
		// var defaultIcon = makeMarkerIcon('0091ff');
		var defaultIcon = makeMarkerIcon2("img/path-icon2.jpg");
	    //var highlightedIcon = makeMarkerIcon('22EB22');
		var highlightedIcon = makeMarkerIcon2("img/path-icon22.jpg");
		
		for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
		  var name = locations[i].name;
          
		  // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
			position: position,
			lat: position.lat,
			lng: position.lng,
            title: title,
			name: name,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
          });
		  marker.setVisible(true);
		  vm.locationsList()[i].marker = marker;
		  //bounds.extend(markers[i].position);
		   bounds.extend(marker.position);
		   
		  // Create an onclick event to open the largeinfowindow at each marker.
          marker.addListener('click', function() {
			populateInfoWindow(this, infoWindow);
			toggleBounce(this);
          });
		  
		  // Two event listeners - one for mouseover, one for mouseout,
		  marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        }
		
		// event listeners for buttons
        document.getElementById('showMap').addEventListener('click', initMap);

		// event listener for zoom-to-area button
		document.getElementById('zoom-to-area').addEventListener('click', function() {
          zoomToArea();
        });
		
		// listener to close marker infowindow when clicked anywhere on the map
		map.addListener("click", function(){
		infoWindow.close(infoWindow);
		});
        
		// Extend the boundaries of the map for each marker
        map.fitBounds(bounds);	
		
	} // end of function initMap()
	
	
	 // Bounce effect on marker
	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
        marker.setAnimation(null);
      }, 3000);
			}
	};
	

	function populateInfoWindow (marker, infowindow) {
		 infowindow.marker = null;
		 if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
		  
          // infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
			var streetViewService = new google.maps.StreetViewService();
			var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
		  function getStreetView(data, status) {
		    if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);

			  var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 10
                  }
                };
			   var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infoWindow.setContent('<div>' + marker.title + '</div>' +
                '<div>Street View Not Available</div>');
            }
          }
		
		
		// Retrieve location information using foursquare api
		var clientID = 'QEKZXBQWM5IQ1BJMTBWUMXZANPI1GFQY1YJTRZSBO2ELFI1F';
		var clientSecret = 'ZQLRVZY0DK4GBLSE05PAWSNS1FAWCFW2JB4AU0RQT3RISNFL';
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.lat + ',' + marker.lng 
			+ '&client_id=' + clientID + '&client_secret=' + clientSecret + '&query=PATH station ' + marker.title + '&v=20180815' + '&limit=1';
		
		//ajax call to foursquare when a marker location is clicked from map or list
		$.ajax(foursquareUrl,{type: "GET", dataType: "json",
		data: {
        async: true
		}
		}).done(function(data){
			venue = data.response.venues[0];
			venueName = venue.name;
			category = venue.categories[0].name;
			street = venue.location.address;
			city = venue.location.city;
			state = venue.location.state;
			zip = venue.location.postalCode;
			address = street + '<div>' + city + " " + state + " " + zip + '</div>';
			
			streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
			
			//infowindow.setContent("<strong> Foursquare Info: </strong>" + '<div>'  + '<div>' + venueName + '</div>' + '<div>' + category + '</div>' + '<div>' + address + '</div>' + '</div><div id="pano"></div>'); 
			infowindow.setContent("Foursquare Info: <img src=img/Foursquare.png width=20 height=20>" + '<div>'  + '<div><strong>' + venueName + '</strong></div>' + '<div>' + category + "<img src=img/path-icon3.jpg width=30 height=30>" + '</div>' + '<div>' + address + '</div>' + '<div>' + '<a href ="' + wikiURL + '" + target="_blank">Click here for Wikipedia Info:</a>' + "<img src=img/wikipedia-icon.png width=20 height=20>" + '</div>' + '</div><div id="pano"></div>'); 
			
			//ajax call to wikipedia when a marker location is clicked from map or list			
				var wikipediaURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.name + " PATH station" + '&format=json' + '&gscoord=' + marker.lat + '|' + marker.lng + '&gsradius=50' + '&list=geosearch';
				$.ajax(wikipediaURL,{
				  type: "GET",
				  dataType: "jsonp",
				  async: true
				  }).done(function(response){
					wikiURL = response[3][0];
					streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
					infoWindow.setContent("Foursquare Info: <img src=img/Foursquare.png width=20 height=20>" + '<div>'  + '<div><strong>' + venueName + '</strong></div>' + '<div>' + category + "<img src=img/path-icon3.jpg width=30 height=30>" + '</div>' + '<div>' + address + '</div>' + '<div>' + '<a href ="' + wikiURL + '" + target="_blank">Click here for Wikipedia Info:</a>' + "<img src=img/wikipedia-icon.png width=20 height=20>" + '</div>' + '</div><div id="pano"></div>');
				})
				.fail(function(){
					streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
					infoWindow.setContent("Foursquare Info: <img src=img/Foursquare.png width=20 height=20>" + '<div>'  + '<div><strong>' + venueName + '</strong></div>' + '<div>' + category + "<img src=img/path-icon3.jpg width=30 height=30>" + '</div>' + '<div>' + address + '</div>' + '<div>' + "Wikipedia unavailable" + '</div><div id="pano"></div>');

				});
				})

			.fail(function(){
					streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
					infowindow.setContent('Foursquare request failed. <div>Please try later</div> <div><strong>' + marker.title + "<img src=img/path-icon3.jpg width=30 height=30>" + '</strong></div>'+'<div id="pano"></div>');
					infowindow.open(map, marker);
            });
			infowindow.open(map, marker);
		 }

} //end of function populateInfoWindow()


	// This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
       function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
	  
	  
	  // This function takes in an image file argument, and then creates an icon for a maps marker similar to the previous function
	   function makeMarkerIcon2(markerImage) 
	  {
        var markerImage = new google.maps.MarkerImage(markerImage,
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
	 
	 
	  // This function takes the input value in the find nearby area text input
      // locates it, and then zooms into that area.
      function zoomToArea() {
        // Initialize the geocoder.
        var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
        var address = document.getElementById('zoom-to-area-text').value;
        // Makes sure the address isn't blank.
        if (address == '') {
          window.alert('You must enter an area, or address.');
        } else {
          // Geocode the address/area entered to get the center. Then, center the map
          geocoder.geocode(
            { address: address,
              componentRestrictions: {locality: 'New York', country: 'US'}
            }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
              } else {
                window.alert('We could not find that location - try entering a more' +
                    ' specific place.');
              }
            });
        }
      }
	  // function to handle any exception for google maps api
		function googleMapsError() {
		  alert('Google Maps failed to load. Please try later');
		   $('#map')
		.addClass('error')
		.append('<div id="googleMapsError">Google Maps failed to load. Please try later</div>');
		};	