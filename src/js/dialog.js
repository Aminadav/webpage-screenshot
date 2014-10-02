$(function () {
  $('[autoselect]').on('click', function() {
    $(this).select();
    document.execCommand('copy');
  });
  $('[autocopy]').each(function() {
    $(this).select();
    document.execCommand('copy');
    clearSelection();
  });
});
function clearSelection() {
  if ( document.selection ) {
    document.selection.empty();
  } else if ( window.getSelection ) {
    window.getSelection().removeAllRanges();
  }
}