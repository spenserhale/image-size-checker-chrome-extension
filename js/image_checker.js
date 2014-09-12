// The background page is asking us to find an address on the page.
if (window == top) {
    chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
        sendResponse(findImages());
    });
}

var findImages = function () {
    if (window.jQuery !== undefined) {
        var $list = [];
        var $run = false;
        function checkImageSize(id){
            jQuery(id).each(function () {
                if (this.naturalWidth > 1025 || (((this.naturalWidth / this.width) >= 2) && (this.src.indexOf('themes') <= 0))) {
                    console.log('found image');
                    $run = true;
                    $list[this.src] = [
                        this.naturalWidth,
                        this.naturalHeight
                    ];

                    jQuery(this).addClass('red-border overlay-warning');
                    $("img");
                }
            });
        }
        checkImageSize("img");
        //checkImageSize("#content img");
        //checkImageSize("#content-main img");
        if ($run) {
            console.log('run');
            var css = '.red-border{border:5px solid red}.warning_overlay{position:relative;}.warning_message{width:100%;position:relative;display:block;opacity:0.7;text-align:center;bottom:0;left:0;background-color:red;font-family:arial;font-size:1em;color:#fff}.warning_content{height:70px;padding:5px;line-height:20px;}.warning_content a{color:#fff}.warning_message,img{cursor:pointer}',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);

            jQuery("img.overlay-warning").each(function () {
                var height = jQuery(this).prop('height'),
                    width = jQuery(this).prop('width'),
                    naturalHeight = this.naturalHeight,
                    naturalWidth = this.naturalWidth;


                //Wrap the image with an overlay
                jQuery(this).wrap("<div class='warning_overlay'></div>");

                //Cache warning_message overlay object
                var o = jQuery(this).parent(".warning_overlay");

                //Append the warning_message to the overlay
                o.append("<div class='warning_message'><div class='warning_content'></div></div>");

                // Get Dynamic Height
                var warning_content_height = o.find(".warning_content").outerHeight() + 5,
                    margin = "-" + warning_content_height + "px auto 0 auto";

                //Set the warning_message from the img alt attribute
                o.find(".warning_content").html("Image is not sized properly.<br/>File Size: "+naturalWidth+"x"+naturalHeight+"<br/>Display Size: "+width+"x"+height+"");

                //Align the warning_message with the image
                o.css("width", jQuery(this).width() + 10);
                o.find(".warning_message").css("margin",  margin);

                //o.find(".warning_content a").on("click", window.pbhs_editors[0].loadEditor());

                /*

                o.mouseover(function(){
                    o.find("img.overlay-warning").stop().fadeTo(500, 1, function () {
                        jQuery(this).css("width", naturalWidth).css("height", naturalHeight);
                    });
                });

                o.mouseout(function(){
                    o.find("img.overlay-warning").stop().fadeTo(500, 1, function () {
                        jQuery(this).css("width", width).css("height", height);
                    });
                });

                */
            });
            console.log($list);
        } else {
            console.log('no items found')
        }
        return $list;
    } else {
        console.log('no jquery');
    }
};

findImages();