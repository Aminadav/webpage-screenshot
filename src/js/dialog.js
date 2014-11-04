onload(function () {
  $('[autoselect]').on('click', function() {
    $(this).select();
  });
  $('.link-copy').click(function (e) {
    e.preventDefault();
    var $self = $(this);
    var $target = $($self.attr('href'));
    postMessage(JSON.stringify({
      data: 'copyText',
      text: $target.val()
    }), '*');
  });
});
// JQuery is loaded async
function onload(cb) {
  if (window.$) {
    $(cb);
    return ;
  }
  setTimeout(onload, 50);
}
