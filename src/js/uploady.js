var uploady = function ($, settings) {
  var folderName = 'Screenshots';
  var token;
  var user;
  var folderId;
  var oauth;

  return {
    init: init,
    upload: upload,
    isConnected: isConnected,
    isTemporary: isTemporary,
    getExpirationDate: getTemporaryAccountExpirationDate,
    connectUser: connectUser,
    disconnectUser: disconnectUser,
    getUser: getUser,
    getFolderUrl: getFolderUrl
  };

  function init() {
    readLocalStorage();
    if (!oauth) {
      return initOAuth().then(init);
    }
    if (isConnected() && oauth.isAccessTokenExpired()) {
      return authorize().then(init);
    }
    if (!isAuthorized()) {
      return createTempAccount().then(init);
    }
    if (isTemporary() && isTemporaryAccountExpired()) {
      return refreshTemporaryAccessToken().then(init);
    }
    if (!folderId) {
      return createFolder().then(init);
    }
    return $.Deferred().resolve().promise();
  }
  function getUser() {
    return user;
  }
  function getFolderUrl() {
    return settings.myfilesUrl + folderId;
  }
  function isConnected() {
    return oauth && !!oauth.getAccessToken();
  }
  function isAuthorized() {
    return oauth && !!oauth.getAccessToken() || !!token;
  }
  function isTemporary() {
    return isAuthorized() && !isConnected();
  }
  function getTemporaryAccountExpirationDate() {
    return token && token.expiration_date;
  }
  function isTemporaryAccountExpired() {
    return getTemporaryAccountExpirationDate() < Date.now();
  }
  function getAccessToken() {
    if (oauth && oauth.getAccessToken()) {
      return oauth.getAccessToken();
    } else if (token) {
      return token.access_token;
    }
    throw "User is not authorized";
  }
  function allowCors() {
    var d = $.Deferred();
    premissions.checkPermissions({origins: ['http://*.uploady.com/*', 'https://*.uploady.com/*']}, function () {
      d.resolve();
    });
    return d.promise();
  }
  function connectUser() {
    return authorize().then(getProfile).then(function () {
      if (token) {
        return mergeWithTemporaryAccount();
      } else {
        return $.Deferred().resolve().promise();
      }
    }).then(function () {
      if (folderId) {
        return moveFolder(user.links.root_folder);
      } else {
        return createFolder();
      }
    });
  }
  function mergeWithTemporaryAccount() {
    if (isTemporaryAccountExpired()) {
      return refreshTemporaryAccessToken().then(mergeWithTemporaryAccount);
    }
    return mergeUser(token.access_token);
  }
  function disconnectUser() {
    oauth && oauth.clear();
    localStorage.uploady = '';
  }
  function initOAuth() {
    var d = $.Deferred();
    allowCors().then(function () {
      var apiScope = 'profile create.folder create.file share.file user.merge update.folder';
      oauth = new OAuth2('uploady', {
        client_id: settings.clientId,
        api_scope: apiScope
      }, function () {
        oauth = this;
        d.resolve();
      });
    });
    return d.promise();
  }
  function authorize() {
    var d = $.Deferred();
    initOAuth().then(function () {
      oauth.authorize(function (error) {
        if (error) {
          d.reject();
        } else {
          d.resolve();
        }
      });
    });
    return d.promise();
  }
  function readLocalStorage() {
    var storage = JSON.parse(localStorage.uploady || null) || {};
    user = storage.user;
    token = storage.token;
    folderId = storage.folderId;
    return !!storage;
  }
  function saveLocalStorage() {
    localStorage.setItem('uploady', JSON.stringify({
      user: user,
      token: token,
      folderId: folderId,
      isConnected: isConnected()
    }));
  }
  function mergeUser(merge_with_access_token) {
    return $.post(settings.apiUrl + 'users/merge', {
      access_token: getAccessToken(),
      merge_with_access_token: merge_with_access_token
    }).then(handleResponse, handleApiError);
  }
  function createTempAccount() {
    return $.post(settings.apiUrl + 'users/remote', {
      access_token: settings.clientAccessToken
    }).then(handleResponse, handleApiError).then(function (data) {
      user = data.users.pop();
      setToken(data);
      saveLocalStorage();
      return data;
    });
  }
  function setToken(data) {
    token = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      expiration_date: Date.now() + data.expires_in * 1000
    };
  }
  function getProfile() {
    return $.get(settings.apiUrl + 'users', {
      access_token: getAccessToken()
    }).then(handleResponse, handleApiError).then(function (data) {
      user = data.users.pop();
      saveLocalStorage();
      return data;
    });
  }
  function createFolder() {
    return $.post(settings.apiUrl + 'folders', {
      access_token: getAccessToken(),
      name: folderName
    }).then(handleResponse, handleApiError).then(function (data) {
      folderId = data.folders.pop().id;
      saveLocalStorage();
      return data;
    });
  }
  function moveFolder(parent_folder) {
    var data = new FormData();
    data.append('id', folderId);
    data.append('parent_id', parent_folder);
    return $.ajax({
      type: "PUT",
      url: settings.apiUrl + 'folders',
      headers: {
        'Authorization': 'Bearer ' + getAccessToken()
      },
      processData: false,
      contentType: false,
      dataType: 'json',
      data: data
    }).then(handleResponse, handleApiError);
  }
  function upload(file) {
    if (isTemporary() && isTemporaryAccountExpired()) {
      return refreshTemporaryAccessToken().then(function () {
        return upload(file);
      });
    }
    var data = new FormData();
    data.append('file', file.blob, file.filename);
    data.append('share_link_enabled', true);
    data.append('folder_id', folderId);
    return $.ajax({
      type: "POST",
      url: settings.uploadUrl + '?access_token=' + getAccessToken(),
      processData: false,
      contentType: false,
      dataType: 'json',
      data: data
    }).then(handleResponse, handleApiError);
  }
  function refreshTemporaryAccessToken() {
    return $.post(settings.tokenURL, {
      client_id: settings.clientId,
      refresh_token: token.refresh_token,
      grant_type: 'refresh_token'
    }).then(handleResponse, handleApiError).then(function (data) {
      data.refresh_token = data.refresh_token || token.refresh_token;
      setToken(data);
      saveLocalStorage();
      return data;
    }, disconnectUser);
  }

  function handleResponse(data) {
    if (data.error) {
      alert(
        "Invalid request \n" +
        data.error
        + ":"
        + data.error_code
        + "\n"
        + data.error_description
      );
      return $.Deferred().reject(data).promise();
    }
    return data;
  }
  function handleApiError(jqXHR) {
    alert(
      "Request failed, if this is error happened more than once, please go to `extension settings` -> `share settings` and click `Disconnect my current user`. \n\n Details:\n" +
      jqXHR.status
      + ":"
      + jqXHR.statusText
      + "\n"
      + jqXHR.responseText
    );
    return $.Deferred().reject(jqXHR).promise();
  }
}(jQuery, settings.uploady);