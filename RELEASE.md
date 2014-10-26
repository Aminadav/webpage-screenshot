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