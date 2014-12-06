# Popup

## Visible screenshot
 * Should work on every page
 * Should not have a scrollbar once captured
 * Should work with alt+x shortcut
 * Should have header and footer
 * Should work while page is in loading state (Hard to reproduce, but some pages are never loaded. Sometimes it happens with https://news.google.com/)
 * chrome://extensions/
 * file:///.../file.png - should display error "Go to chrome://extensions, and check the box "Allow access to file URLs", but should work without this as well.

## All page screenshot
 * Should not have a scrollbar
 * Should work with alt+z shortcut
 * Should have header and footer
 * file:///.../file.png
 * http://www.w3.org/TR/2014/CR-2dcontext-20140821/ - fixed background
 * http://www.projectpomonashop.com/ - invalid html with fixed bottom elements and middle fixed elements. <html> scrollbars
 * https://news.google.com/ - fixed menu
 * http://getbootstrap.com/components/ - long long page
 * https://www.facebook.com/ - everybody likes to take screenshots of their timeline
 * https://www.uploady.com/ - edge case, then body size is slightly bigger than the windows size (approx 13 folders)
 * http://www.samsung.com/in/consumer/memory-storage/ssd/ssd-840-pro/MZ-7PD512BW - js header

## Capture region
 * Should scroll if region is bigger than the page
 * Should be able to capture fixed elements
 * Should work with alt+r shortcut
 * Should not have header and footer

## Webcam capture

## Desktop capture

## Paste from clipboard

## Edit content

# Options
 * Should be able to change header and footer
 * Should be able to remove header and footer
 * Should be able to change shortcuts
 * Screenshot delay should work

# Editor
 * Tools
    * Line
    * Free line
    * Spray
    * Text
    * Rectangle
    * Filled Rectangle
    * Circle
    * Arrow
    * Star
    * Home
    * Crop
    * Undo
    * Redo
    * Choose a Color
    * Line width

# Plugins
 * Save to url
 * Save local
 * Pdf
 * Copy
 * Thumbnail
 * Print
 * ...
