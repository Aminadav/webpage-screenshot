var uploady = {
  upload: function (settings) {
    var uploadUrl= 'https://content.uploady.com/v1/api/upload';
    var accessToken = '7MURi9qo4ysOJs9O-gD3VZKWuY_hrh7wPBM4Uf6ecM3uIsKABY8~m48Ai';
    var folderId = 'NZ~sRJG3bHz';
    var data = new FormData();
    data.append('file', settings.blob, settings.filename);
    data.append('share_link_enabled', true);
    data.append('folder_id', folderId);
    var request = $.ajax({
      type: "POST",
      url: uploadUrl,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      processData: false,
      contentType: false,
      dataType: 'json',
      data: data
    });
    request.done(function(data) {
      settings.callback(data);
    });
    request.fail(function(jqXHR, textStatus) {
      settings.fail(jqXHR.statusText);
      alert(
        "Upload request failed \n" +
        jqXHR.status
        + ":"
        + jqXHR.statusText
        + "\n"
        + jqXHR.responseText
      );
    });
  }
};