 /** 
  
Hello World Hello Think
1/15/19
Calculate SEPTA Regional Rail fare price

*/

/*
I used W3School's JavaScript Style Guidenaming and declaration rules and used camelCasing for my functions, params, args and vars
*/

/*	
2 Bug: line 69; the total fare to update and display to the page */
 
/*
There 3 functions:
	@Display the user's current fare selection by zone, time and purchase location (kiosk or onboard)
	@Calculates fares
	@The app assumes that the anytime fare is for a 10 trip purchase and that the minimum fare purchase is '1' and maximum fare purchase '10'
*/

'use strict';

 //this function checks Station Kiosk for purchase locationand resets the form

function purchaseDisplay(time) {
	if (time === 'anytime') { 
		$('#widget-fare-anytime').show(); 
		$('#widget-fare-time-options').prop('checked', true);
		$('#widget-fare-onboard').prop('disabled', true);
		$('#widget-fare-trips').attr({ 
		  step: '10', value: '10', min: '10'
    	});
  	} else {  // Reset form 
    $('#widget-fare-anytime').hide();
    $('#widget-fare-onboard').prop('disabled', false);
    $('#widget-fare-trips').attr({
      step: '1',
      value: '1',
      min: '1'
    });
  }
} 

/*
calculates the fare by taking Json data as it's argument
and retrieving the value of inputs 
*/
function calculateFare(data) {
  let time = $('#widget-fare-time-options').val();
  purchaseDisplay(time); 
  let zone = $('#widget-fare-zone').val();
  let location = $('input[name="purchase_location"]:checked').val();
  let trips = $('#widget-fare-trips').val();
 
// Update helper text for anytime travel or special offers
  $('#widget-fare-anytime').text(data.info[time]); 
  $('#widget-fare-time').text(data.info[location]); 

//Calculate the total
  let calcZone = data.zones.filter(function(fareZone) { 
	return fareZone.calcZone === Number(calcZone); 
	  })[0];
  let calcFare = calcZone.fares.filter(function(fare) { 
	return (fare.type === time) && (fare.purchase === location)})[0];
  let calcTotal = (calcFare.price / calcFare.trips) * trips; 
	   $('#widget-fare-text--total').html( "$"+ " " + calcTotal);
}

$(document).ready(function() {
  let septaData = {}; // initiales json variable

  $('#widget-fare-form').submit(function(event) { // Prevent page reload/form submission
    event.preventDefault();
  });

  $.ajax({ 
    url : 'https://',
    type : 'GET',
    dataType:'json',
    success : function(data) {              
      septaData = data; 
      calculateFare(septaData); 
    }
  }); 

  // Calculate fare + auto update total
  $('.widget-fare-field').change(function() { // On any change w/in formfield
    calculateFare(septaData); // Run calculate fare function with json data
  });    
});