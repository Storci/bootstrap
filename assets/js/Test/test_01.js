
$('#IDLabel').text('PIPPO')
$("body").find('*').not('#IDSpinning').not('#IDDivSpinning').hide();


setTimeout(function(){
  $('#IDLabel').text('CIAOO')
  $("body").find('*').fadeIn();
  $("body").find('#IDSpinning').fadeOut();
  $("#IDDivSpinning").fadeOut();
  //$('#msform').attr('style', 'display:none;');
}, 3000)
