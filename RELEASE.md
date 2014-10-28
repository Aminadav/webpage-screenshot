* Testing before release
* Test for new users
	Remove and install again the extension, test every button in the popup, and the toolbar.

* Test for exisiting user by adding manually this permissions: (open console of options.html)
		document.onclick=function(){
			chrome.permissions.request(
				{"origins":["http://*/*","https://*/*"],"permissions":["tabs","webNavigation","webRequest"]},
				function(a){
				console.log(a)
				console.log(chrome.runtime.lastError)
			})
		};
--
# Release plan
  * Update extension version in manifest_[ws|sb].json
  * Commit the changes
  * Merge with master branch
  * Create git tag with version name
  * Copy src folder outside the git repo and apply following changes to this folder:
    * settings.js - set dev variable to false
    * rename manifest_[ws|sb].json to manifest.js
    * delete unused manifest_[ws|sb].json files
    * ZIP and release