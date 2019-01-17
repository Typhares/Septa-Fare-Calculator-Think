'use strict';

function purchaseDisplay(selected_time) {
  if (selected_time === 'anytime') { // 10-trip purchase
    $('#calculate-fare-anytime-info').show(); // Display disclaimer
    $('#calculate-fare-advance').prop('checked', true); // Check Station Kiosk for purchase location
    $('#calculate-fare-onboard').prop('disabled', true); // Disable Onboard purchase option
    $('#calculate-fare-trips').attr({ // Set ride amount to multiples of 10
      step: '10',
      value: '10',
      min: '10'
    });
  } else {  // Reset form for single ticket purchase
    $('#calculate-fare-anytime-info').hide();
    $('#calculate-fare-onboard').prop('disabled', false);
    $('#calculate-fare-trips').attr({
      step: '1',
      value: '1',
      min: '1'
    });
  }
}

function calculateFare(data) {
  // Retrieve current values of form inputs
  var selected_time = $('#calculate-fare-time').val();
  purchaseDisplay(selected_time); // Handle anytime display

  var selected_zone = $('#calculate-fare-zone').val();
  var selected_purchase_location = $('input[name="purchase_location"]:checked').val();
  var selected_trips = $('#calculate-fare-trips').val();

  // Update helper text 
  $('#calculate-fare-time-info').text(data.info[selected_time]); // Time valid text
  $('#calculate-fare-purchase-info').text(data.info[selected_purchase_location]); // Purchase location text

  // Calculate total 
  var zone = data.zones.filter(function(fare_zone) { // Filter through zone
      return fare_zone.zone === Number(selected_zone); // Return json data of selected zone
  })[0];
  var fare = zone.fares.filter(function(fare_option) { // Filter through fares
    return (fare_option.type === selected_time) && (fare_option.purchase === selected_purchase_location);
  })[0];
  var total = (fare.price / fare.trips) * selected_trips; // Standardize cost per ticket and multiply by number of trips

  // Update total display
  $('#calculate-fare-total').text('$' + Number(total).toFixed(2)); // Display and format ($0.00) total
}

$(document).ready(function() {
  var septa_fare_data = {}; // initializing json variable

  $('#calculate-fare-form').submit(function(e) { // Prevent page reload/form submission
    e.preventDefault();
  });

  $.ajax({ 
    url : 'https://',
    type : 'GET',
    dataType:'json',
    success : function(data) {              
      septa_fare_data = data; 
      calculateFare(septa_fare_data); 
    }
  }); 

  // Calculate fare + auto update total
  $('.calculate-fare-field').change(function() { // On any change w/in formfield
    calculateFare(septa_fare_data); // Run calculate fare function with json data
  });    
});