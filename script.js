    // Refinance Calculator Second
    (function(){
      function refinanceCalculatorSecond() {
          // Initial stage visibility
          $(".stage1").show();
          $(".stage2").hide();
          $(".stage3").hide();
  
          // Function to handle styling of text input fields
          function handleTextInputStyling($input) {
              $(".property_error-message-refinance").text("");
              $(".loan_error-message-refinance").text("");
              $(".interest_error-message-refinance").text("");
              $(".remainT_error-message-refinance").text("");
              
              let sanitizedValue = $input.val().replace(/[^0-9]/g, '');
              const $fieldItem = $input.closest(".field-item");
  
              $fieldItem.find("label, span").css({
                  color: sanitizedValue === '' ? "rgba(227, 27, 27, 0.8)" : "",
              });
  
              $fieldItem.css({
                  borderColor: sanitizedValue === '' ? "rgba(227, 27, 27, 0.8)" : "",
              });
  
              if (sanitizedValue === '') {
                  $input.addClass("empty-placeholder");
              } else {
                  $input.removeClass("empty-placeholder");
              }
          };
  
          // Function to handle styling of radio input fields
          function handleRadioInputStyling($input) {
              const $fieldItem = $input.closest(".field-item");
  
              // Example: Change the color of label, span, and placeholder
              $fieldItem.find("label, span").css({
                  color: $input.is(":checked") ? "" : "rgba(227, 27, 27, 0.8)",
              });
  
              // Example: Change the border color
              $fieldItem.css({
                  borderColor: $input.is(":checked") ? "" : "rgba(227, 27, 27, 0.8)",
              });
          };
  
  
          // Function to revert the styling of text input fields
          function revertTextInputStyling() {
              $(".calc-form input[type='text']").each(function() {
                  const $input = $(this);
                  const $fieldItem = $input.closest(".field-item");
  
                  // Revert the color of label, span, and placeholder
                  $fieldItem.find("label, span").css({
                      color: "",
                  });
  
                  // Revert the border color
                  $fieldItem.css({
                      borderColor: "",
                  });
  
                  // Remove the empty-placeholder class
                  $input.removeClass("empty-placeholder");
              });
          };
  
          // Function to revert the styling of radio input fields
          function revertRadioInputStyling() {
              $(".calc-form input[type='radio']").each(function() {
                  const $input = $(this);
                  const $fieldItem = $input.closest(".field-item");
  
                  // Revert the color of label, span, and placeholder (adjust as needed)
                  $fieldItem.find("label, span").css({
                      color: "",
                  });
  
                  // Revert the border color (adjust as needed)
                  $fieldItem.css({
                      borderColor: "",
                  });
              });
          };

          // Function to calculate Current Interest Payment using the formula
          function calculateCurrentRepayment(currentInterestRate, remainingLoanTerm, currentLoanBalance) {
              let monthlyRate = currentInterestRate / 12 / 100;
              let totalPayments = remainingLoanTerm * 12;
              return currentLoanBalance * monthlyRate / (1-Math.pow(1+monthlyRate, -totalPayments));               
          };

          // Function to calculate Refinance Payment using the formula //  New Repayment
          function calculateRefinanceRepayment(averageInterestRate, newLoanTerm, currentLoanBalance) {
              let monthlyRate_pi = averageInterestRate/12/100;  // principal and interest
              let monthlyRate_InterestOnly = averageInterestRate/100; // interest only
              let totalPayments = newLoanTerm * 12;
              let loanTypeCheck = $('input[name="loan_type"]:checked').attr('id');
              let repaymentTypeCheck = $('input[name="repayment_type"]:checked').attr('id');

              if(loanTypeCheck === "owner_occupied" && repaymentTypeCheck === "p_i" && monthlyRate_pi){
                  return currentLoanBalance * monthlyRate_pi / (1-Math.pow(1+monthlyRate_pi, -totalPayments));
              } else if (loanTypeCheck === "owner_occupied" && repaymentTypeCheck === "interest_only" && monthlyRate_InterestOnly){
                  return (currentLoanBalance * monthlyRate_InterestOnly)/12;
              } else if(loanTypeCheck === "investment" && repaymentTypeCheck === "p_i" && monthlyRate_pi){
                  return currentLoanBalance * monthlyRate_pi / (1-Math.pow(1+monthlyRate_pi, -totalPayments));
              } else if (loanTypeCheck === "investment" && repaymentTypeCheck === "interest_only" && monthlyRate_InterestOnly){
                  return (currentLoanBalance * monthlyRate_InterestOnly)/12;
              } else {
                  return null;
              };               
          };


          function hasErrors(monthlyPayment, refinanceMonthly, monthlysaving, yearlySaving) {
              // For example, if any of the calculated values is not a number or is negative, return true
              if (isNaN(monthlyPayment) || isNaN(refinanceMonthly) ||isNaN(monthlysaving) || isNaN(yearlySaving) || monthlyPayment < 0 || refinanceMonthly < 0 || monthlysaving < 0 || yearlySaving < 0) {
                  return true; // return false;
              }
              return false; // Otherwise, return false
          };

          // add commas in the output field
          function addCommas(number) {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          };
  
          // Function to display results
          function calculateAverageInterestRate(loanType, repaymentType, lvr) {
              if (loanType === "owner_occupied" && repaymentType === "p_i") {
                  return (lvr <= 60) ? 5.89 : (lvr <= 80) ? 5.99 : (lvr <= 90) ? 6.19 : 6.39;
              } else if (loanType === "owner_occupied" && repaymentType === "interest_only") {
                  return (lvr <= 60) ? 6.15 : (lvr <= 80) ? 6.25 : (lvr <= 90) ? 6.45 : 6.65;
              } else if (loanType === "investment" && repaymentType === "p_i") {
                  return (lvr <= 60) ? 6.24 : (lvr <= 80) ? 6.34 : (lvr <= 90) ? 6.54 : 6.74;
              } else if (loanType === "investment" && repaymentType === "interest_only") {
                  return (lvr <= 60) ? 6.40 : (lvr <= 80) ? 6.50 : (lvr <= 90) ? 6.70 : 6.90;
              } else {
                  return null;
              }
          }; 

          // function to add colors in input fields
          function handleValidationErrors(selector, color, borderColor) {
              $(selector).find("label, span").css({
                  color: color
              });
          
              $(selector).css({
                  borderColor: borderColor
              });
          };
          
          // Event handler for text input fields on input (while typing)
          $(".calc-form :input[type='text']").on("input", function() {
              handleTextInputStyling($(this));
              // $("#error-message-refinance").text("");
              $(".error-monthly-payment-message").text("");
              let sanitizedValue = $(this).val().replace(/,/g, '');
              let numericValue = sanitizedValue.replace(/[^0-9.]/g, '');
              if (!isNaN(numericValue)) {
                  let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  $(this).val(formattedValue);
              };      
              $(this).change();
          });
  
          // Event handler for radio input fields on change
          $(".calc-form :input[type='radio']").on("change", function() {
              handleRadioInputStyling($(this));
          });
  
          // Event handler for the calculate button
          $("#calculate").on("click", function(event) {
              event.preventDefault();
              $(".property_error-message-refinance").text("");
              $(".loan_error-message-refinance").text("");
              $(".interest_error-message-refinance").text("");
              $(".remainT_error-message-refinance").text("");
              $(".current_monthly_repayment").text("");
              $(".error-monthly-payment-message").text("");
  
              // Trigger the input styling for all relevant text input fields
              $(".calc-form :input[type='text']").each(function() {
                  handleTextInputStyling($(this));
              });
  
              // Trigger the input styling for all relevant radio input fields
              $(".calc-form :input[type='radio']").each(function() {
                  handleRadioInputStyling($(this));
              });               
  
              // Extracting user inputs
              let currentPropertyValue = parseFloat($("#current_prop_value").val().replace(/,/g, ''));
              let currentHomeLoanValue = parseFloat($("#current_home_loan_value").val().replace(/,/g, ''));
              let currentInterestRate = parseFloat($("#current_interest_rate").val().replace(/,/g, ''));        
              let remainLoanTerm = parseInt($("#remain_loan_term").val().replace(/,/g, ''));
              let loanType = $("input[name='loan_type']:checked").val();
              let repaymentType = $("input[name='repayment_type']:checked").val();

              // Declaration of variable for use later
              let monthlyPayment, refinanceMonthly, monthlysaving, yearlySaving;

              // console.log("Current Property Value: ", currentPropertyValue);

              // Calculate LVR
              let lvr = (currentHomeLoanValue / currentPropertyValue) * 100;
              // console.log("LVR: ", lvr);
  
              let averageInterestRate = calculateAverageInterestRate(loanType, repaymentType, lvr);
              // console.log("Average interest: ", averageInterestRate);
          
              if (averageInterestRate !== null) {
          
                  monthlyPayment = calculateCurrentRepayment(currentInterestRate, remainLoanTerm, currentHomeLoanValue);
                  // console.log("Monthly Repayments under current interest rate: ", monthlyPayment);
                  
                  let maxLoanTerm = 30; // years

                  refinanceMonthly = calculateRefinanceRepayment(averageInterestRate, maxLoanTerm, currentHomeLoanValue, currentInterestRate, repaymentType)  ;
                  // console.log("Monthly Repayments after Refinancing: ", refinanceMonthly);
                  
                  monthlysaving = (monthlyPayment - refinanceMonthly);
                  // console.log("Monthly Saving: ", monthlysaving);

                  // Save yearly
                  yearlySaving = monthlysaving * 12;                
              };

              if(currentPropertyValue < currentHomeLoanValue ){
                  handleValidationErrors(".error-loan", "rgba(227, 27, 27, 0.8)", "rgba(227, 27, 27, 0.8)");
                  $(".loan_error-message-refinance").text("Home loan should be lesser than property value.");
              };

              // Check if currentInterest is greater than 99, then set it to 99
              if(currentInterestRate <= 0 || currentInterestRate > 99 ){
                  handleValidationErrors(".error-interest", "rgba(227, 27, 27, 0.8)", "rgba(227, 27, 27, 0.8)");
                  $(".interest_error-message-refinance").text("Your current rate must be between 0.01% and 99.00%.");
              };
              
              // Check for less interest rate and negative saving
              if(monthlysaving <0){
                  handleValidationErrors(".error-interest", "rgba(227, 27, 27, 0.8)", "rgba(227, 27, 27, 0.8)");
                  $(".interest_error-message-refinance").text("Please enter more interest rate.");
              };

              // Check if remainLoanTerm is greater than 30, then set it to 30
              if(remainLoanTerm <= 0 || remainLoanTerm > 30 ){
                  handleValidationErrors(".error-remainT", "rgba(227, 27, 27, 0.8)", "rgba(227, 27, 27, 0.8)");
                  $(".remainT_error-message-refinance").text("Your loan term must be 1-30 years.");
              };

              if(loanType && repaymentType){
                  // Revert styling for radio input fields
                  revertRadioInputStyling();
              }; 

              // Your logic to determine if stage2 is correct
              let errorOccurred = hasErrors(monthlyPayment, refinanceMonthly, monthlysaving, yearlySaving);
  
              // Check the additional condition for stage3
              if (!currentPropertyValue || currentHomeLoanValue > currentPropertyValue || (remainLoanTerm <=0 || remainLoanTerm > 30)) {
                  // Show stage3 and hide others
                  $(".stage1, .stage2").hide();
                  $(".stage3").show();
              }  else if (!errorOccurred && currentInterestRate <= 99) {
                  // Show stage2 and hide others
                  $(".stage1, .stage3").hide();
                  $(".stage2").show();
  
                  // Update values in stage 2
                  $("#refinance_est_cash").text("$ " + addCommas(Math.round(yearlySaving)) + " every year!*"); // Total Amount saved per year
                  $(".info-value:first").text("$ " + addCommas(Math.round(monthlyPayment))); // Make sure to define monthlyPayment
                  $(".info-value:last").text("$ " + addCommas(Math.round(refinanceMonthly))); // Make sure to define refinanceMonthly
              } else {
                  // Show stage3 and hide others
                  $(".stage1, .stage2").hide();
                  $(".stage3").show();
              };   
          });

          // Mobile view calculator
          if ($(window).width() <= 767) {
              $("#calculate").click(function() {
                  $('html, body').animate({
                      scrollTop: $("#refncalc-right").offset().top
                  }, 1000);
              });
          };
  
  
          // Event handler for the reset button
          $("#reset").on("click", function(event) {
              event.preventDefault();
              // Revert styling for text input fields
              revertTextInputStyling();
              // Revert styling for radio input fields
              revertRadioInputStyling();

              // Reset text input fields to their default values
              $(".calc-form input[type='text']").each(function() {
                  this.value = this.defaultValue;
              });
              
              // Reset radio input fields to their default values
              $(".calc-form input[type='radio']").prop("checked", function() {
                  return this.defaultChecked;
              });

              $("#monthlyPayment").text("");
              $("#refinanceMonthlyPayment").text("");
              $("#amountSavedPerYear").text("");
  
              // stage reset
              $(".stage1").show();
              $(".stage2").hide();
              $(".stage3").hide();

              // error message reset
              $(".property_error-message-refinance").text("");
              $(".loan_error-message-refinance").text("");
              $(".interest_error-message-refinance").text("");
              $(".remainT_error-message-refinance").text("");
              $(".current_monthly_repayment").text("");
              $(".error-monthly-payment-message").text("");
          });

      };    
      refinanceCalculatorSecond();
  })();
