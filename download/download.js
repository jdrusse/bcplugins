videojs.plugin('downloadVideoPlugin', function(options) {
    //Declare contains method to search array
    var contains = function(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;
        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1,
                    index = -1;
                for (i = 0; i < this.length; i++) {
                    var item = this[i];
                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return indexOf.call(this, needle) > -1;
    };
    //Function to parse URI.
    function parseUri(sourceUri) {
        var uriPartNames = ["source", "protocol", "authority", "domain", "port", "path", "directoryPath", "fileName", "query", "anchor"],
            uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri),
            uri = {};
        for (var i = 0; i < 10; i++) {
            uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
        }
        /* Always end directoryPath with a trailing backslash if a path was present in the source URI
        Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key */
        if (uri.directoryPath.length > 0) {
            uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
        }
        return uri;
    }
    // Create variables and new div, anchor and image for download icon
    var myPlayer = this,
        videoName,
        totalRenditions,
        mp4Ara = [],
        highestQuality,
        spacer,
        newElement = document.createElement('div'),
        newLink = document.createElement('a'),
        newImage = document.createElement('img');
    myPlayer.on('loadstart', function() {
        //Function to display download link.
        var download = function() {
                // Get video name and the MP4 renditions
                videoName = myPlayer.mediainfo['name'];
                rendtionsAra = myPlayer.mediainfo.sources;
                totalRenditions = rendtionsAra.length;
                for (var i = 0; i < totalRenditions; i++) {
                    if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
                        mp4Ara.push(rendtionsAra[i]);
                    };
                };
                // Sort the renditions from highest to lowest
                mp4Ara.sort(function(a, b) {
                    return b.size - a.size;
                });
                // Set the highest rendition
                highestQuality = mp4Ara[0].src;
                // Assign id and classes to div for icon
                newElement.id = 'downloadButton';
                newElement.className = 'downloadStyle vjs-control';
                // Assign properties to elements and assign to parents
                newImage.setAttribute('src', '//solutions.brightcove.com/bcls/brightcove-player/download-video/file-download.png');
                newLink.setAttribute('href', highestQuality);
                newLink.setAttribute('download', videoName);
                newLink.appendChild(newImage);
                newElement.appendChild(newLink);
                // Get the spacer element
                spacer = myPlayer.controlBar.customControlSpacer.el();
                // Set the content of the spacer to be right justified
                spacer.setAttribute("style", "justify-content: flex-end;");
                // Place the new element in the spacer
                spacer.appendChild(newElement);
            }
            //Look for hosts options and if set, only show download icon on valid domains.
        if (typeof options.hosts !== 'undefined') {
            //Attempt to get hostname of actual page in the case we're embedded in iFrame.
            var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
            //Parse out the URI to get just the domain.
            var hostURL = parseUri(url).domain;
            if (contains.call(options.hosts, hostURL)) {
                download();
            }
        } else {
            download();
        }
    })
});
