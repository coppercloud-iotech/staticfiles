var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var scaleFactor = 1;    //reflength_x*4.26; // pxlength
var data;

function getAvlHeight() {return window.screen.availHeight;}
function getAvlWidth()  {return window.screen.availWidth;} 

function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // IP address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}  

function openVideoPopup(videoSrc,x,y) {
    var width = 200;
    var height = 200;
    var left = x - width / 2 + window.scrollX;
    var top = y - height + window.scrollY;

    var popupWindow = window.open('', '_blank', 'left=' + left + ', top=' + top + ', width=' + width + ', height=' + height);
    // var popupWindow = window.open('', '_blank', 'width=100, height=100');
    var videoElement;

    if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
      // Extract the video ID from the URL
      var videoId = '';
      var match = videoSrc.match(/[?&]v=([^&]+)/);
      if (match) {
        videoId = match[1];
      } else {
        var urlParts = videoSrc.split('/');
        videoId = urlParts[urlParts.length - 1];
      }
  
      // Construct the embed URL
      videoSrc = 'https://www.youtube.com/embed/' + videoId;
    }
  
    if (isURL(videoSrc)) {
      videoElement = document.createElement('iframe');
      videoElement.src = videoSrc;
      videoElement.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      videoElement.allowFullscreen = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.border = 'none'; // Remove iframe border
    } else {
      videoElement = document.createElement('video');
      videoElement.src = videoSrc;
      videoElement.controls = true;
      videoElement.preload = 'metadata';
      videoElement.style.maxWidth = '100%';
      videoElement.style.maxHeight = '100%';
      videoElement.style.display = 'block'; // Ensure the video is displayed as a block element
      videoElement.style.margin = 'auto'; // Center the video horizontally
    }
  
    popupWindow.document.write('<html><body style="margin: 0;"><div style="display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh;">' + videoElement.outerHTML + '</div></body></html>');
    popupWindow.document.close();
  
    // Resize the popup window after the video loads
    // videoElement.addEventListener('loadedmetadata', function() {
    //   var width = videoElement.videoWidth;
    //   var height = videoElement.videoHeight;
    //   // popupWindow.resizeTo(width, height);
    //   popupWindow.resizeTo(400, 400);
    // });
}

function openImgPopup(imageSrc,x,y) {
    var img = new Image();
    img.src = imageSrc;
    img.onload = function() {
      // var width = img.width;
      // var height = img.height;
      var width = 100;
      var height = 100;
      var left = x - width / 2 + window.scrollX;
      var top = y - height + window.scrollY;

      var popupWindow = window.open('', '_blank', 'left=' + left + ', top=' + top + ', width=' + width + ', height=' + height);
      // var popupWindow = window.open('', '_blank', 'width=' + width + ', height=' + height);
      popupWindow.document.write('<html><body style="margin: 0;"><img src="' + imageSrc + '" style="width: 100%; height: 100%; object-fit: contain;"></body></html>');
      popupWindow.document.close();
    };
}

function onDoubleClick(event) {
  if (event.target === canvas) {
    var x = (event.clientX - canvas.offsetLeft) / scaleFactor;
    var y = (event.clientY - canvas.offsetTop) / scaleFactor;

    const elements = Object.values(data.elements);
    elements.forEach((elementGroup) => {
      elementGroup.forEach((element) => {
        var image = element;
        var imgScaleFactor = element.radius / Math.max(element.width, element.height);
        var newWidth = element.width * imgScaleFactor * scaleFactor;
        var newHeight = element.height * imgScaleFactor * scaleFactor;
        var newX = (element.x * scaleFactor) + (element.width * scaleFactor - newWidth) / 2;
        var newY = (element.y * scaleFactor) + (element.height * scaleFactor - newHeight) / 2;

        var transformedX = x - newX / scaleFactor;
        var transformedY = y - newY / scaleFactor;
        var isWithinImage = transformedX >= 0 && transformedX < newWidth / scaleFactor && transformedY >= 0 && transformedY < newHeight / scaleFactor;

        if (isWithinImage) {
          if (image.id.startsWith("image")) {
            // Open popup screen
            openImgPopup(image.link, event.screenX, event.screenY);
          } else if (image.id.startsWith("video")) {
            // Open popup screen with video playing
            openVideoPopup(image.link, event.screenX, event.screenY);
          }
        }
      });
    });
  }
}   

window.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("json-file");
  
    fileInput.addEventListener("change", handleFileSelect, false);
  
    function handleFileSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
  
        reader.onload = function (e) {
            const contents = e.target.result;
            data = JSON.parse(contents);
    
            const layoutImage = new Image();
            layoutImage.src = data.layoutImage.src;
            layoutImage.addEventListener("load", () => {
                var canvasWidth = getAvlWidth() - 50;
                var canvasHeight = getAvlHeight() - 100;
                canvas.width = canvasWidth * scaleFactor;
                canvas.height = canvasHeight * scaleFactor;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(layoutImage, 0, 0, canvas.width, canvas.height);
            
                const elements = Object.values(data.elements);
                elements.forEach((elementGroup) => {
                    elementGroup.forEach((element) => {
                        const image = new Image();
                        if (element.id.startsWith("image")) {
                          image.src = element.link;
                        }
                        else{
                          image.src = element.src;
                        }
                        var imgScaleFactor = element.radius / Math.max(element.width, element.height);
                        var newWidth = element.width * imgScaleFactor * scaleFactor;
                        var newHeight = element.height * imgScaleFactor * scaleFactor;
                        var newX = (element.x * scaleFactor) + (element.width * scaleFactor - newWidth) / 2;
                        var newY = (element.y * scaleFactor) + (element.height * scaleFactor - newHeight) / 2;
                        image.addEventListener("load", () => {
                            // Draw the purple boundary
                            // ctx.strokeStyle = "purple";
                            // ctx.lineWidth = 2;
                            // ctx.strokeRect(newX, newY, newWidth, newHeight);

                            // Save the current canvas state
                            ctx.save();
                            
                            // Translate to the center of the image
                            ctx.translate(newX + newWidth / 2, newY + newHeight / 2);
                            
                            // Rotate the canvas based on the image's rotation
                            ctx.rotate((element.rotation * Math.PI) / 180);
                            
                            // Draw the image at the rotated position
                            ctx.drawImage(image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
                            
                            // Restore the canvas state
                            ctx.restore();

                            if (element.id.startsWith("text")) {
                                ctx.save();
                              
                                // Apply the same rotation transformation to the text
                                ctx.translate(newX + newWidth / 2, newY + newHeight / 2);
                                ctx.rotate((element.rotation * Math.PI) / 180);
                              
                                // Adjust the vertical position of the text
                                var textOffsetY = newHeight / 2 + 5; // Adjust the value as needed
                                ctx.font = "12px Arial";
                                ctx.fillStyle = "black";
                                ctx.textAlign = "center";
                                ctx.fillText(element.text, 0, textOffsetY);
                              
                                ctx.restore();
                            }
                        });
                    });
                });
                canvas.addEventListener("dblclick", onDoubleClick);
            });          
        }
        reader.readAsText(file);
    }
});