var imgHeightPx = 0;
var imgWidthPx = 0;
var xCompression = 0;	// eg, 0.25
var yCompression = 0;


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var images = [];
var isDragging = false;
var dragIndex = -1;
var dragStart = { x: 0, y: 0 };
var reflength_x = 30;
var reflength_y = 10;
var clickCount = 0;
var x1, y1, x2, y2, length;

var universalscalefactor = 4.45;    // - AD laptop;
var scaleFactor = 1;
var widgetMenu = document.getElementById("widget-menu");
widgetMenu.style.width = window.screen.availWidth - 50;

// Load the background image
var backgroundImage = new Image();
document.getElementById("background-image-input").addEventListener("change", function(event) {
    var fileInput = event.target;
    var file = fileInput.files[0];
  
    var reader = new FileReader();
    reader.onload = function(e) {
      backgroundImage.src = e.target.result;
    };

    backgroundImage.onload = function() {
        canvas.width = getAvlWidth();	// - 50;
        canvas.height = getAvlHeight();
		
		imgHeightPx = backgroundImage.height;
		imgWidthPx = backgroundImage.width;
		console.log("Image size:" + imgWidthPx + " x " + imgHeightPx);
		console.log("Canvas size:" + canvas.width + " x " + canvas.height);
			
		xCompression = (imgWidthPx-canvas.width)/canvas.width;
		yCompression = (imgHeightPx-canvas.height)/canvas.height;
		
		console.log("Compression:" + xCompression + " & " + yCompression);
	  
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
		//ctx.drawImage(backgroundImage, 0, 0);
    };
    images = [];
  
    reader.readAsDataURL(file);
});

function getAvlHeight() {return window.screen.availHeight-180;}
function getAvlWidth()  {return window.screen.availWidth;}

function getAbsHeight() {return window.screen.height;}
function getAbsWidth()  {return window.screen.width;}

function openNav() {
    document.getElementById("mySidenav").style.width = "175px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("image", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("image");
    var image = document.getElementById(data);
    var uniqueId = image.id + Date.now(); // Generate a unique ID
    var x = (event.clientX - canvas.offsetLeft) / scaleFactor;
    var y = (event.clientY - canvas.offsetTop) / scaleFactor;

	if(image.id === "suction-pad") {
			images.push({
			id: uniqueId,
			type: image.alt,
			element: image,
			x: x - image.width / 2,  // Adjust the x-coordinate based on image width
			y: y - image.height / 2, // Adjust the y-coordinate based on image height
			radius: 100,
			src: image.src,  // Store the original src attribute in the image object
			text: "",
			rotation: 0,
			link: ""
		});
	}
	else {
		images.push({
			id: uniqueId,
			type: image.alt,
			element: image,
			x: x - image.width / 2,  // Adjust the x-coordinate based on image width
			y: y - image.height / 2, // Adjust the y-coordinate based on image height
			radius: 50,
			src: image.src,  // Store the original src attribute in the image object
			text: "",
			rotation: 0,
			link: ""
		});
	}
	
    redraw();
}

function onDoubleClick(event) {
    if (event.target === canvas) {
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            if (x >= image.x && x < image.x + image.element.width && y >= image.y && y < image.y + image.element.height) {
                if (image.type === "suction-pad") {
                    var diameter = prompt("Enter the diameter (in mm) to resize the image:", image.radius * 2);
                    if (diameter !== null) {
                        var radius = parseFloat(diameter) / 2;
                        image.radius = radius*1.5;	// * 2 is only to make 90MM vacpad look bigger on editor. needs to be changed after demo
                        redraw();
                    }
                } else if (image.type === "image") {
                    var fileInput = document.createElement("input");
                    fileInput.type = "file";

                    // Listen for the file selection
                    fileInput.addEventListener("change", function (event) {
                        var file = event.target.files[0];
                        if (file) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (event) {
                                var base64Image = event.target.result;
                                // Update the image.link property with the base64 string
                                image.link = base64Image;
								image.radius = 100;
                                // Redraw the canvas with the new image
                                redraw();
                            };
                            fileReader.readAsDataURL(file);
                        }
                    });

                    // Trigger the file dialog
                    fileInput.click();
                 }
                else if (image.type === "video") {
                    var link = prompt("Enter the video source URL:", image.link);
                    if (link !== null) {
                        image.link = link;  // Update the link value of the specific image object
                        // image.element.src = src;  // Update the src attribute of the corresponding image in the canvas
                        redraw();
                    }
                }                                               
                else if (image.type === "text") {
                    var textdata = prompt("Enter Text:", image.text);
                    if (textdata !== null) {
                        image.text = textdata;  // Update the src value of the specific image object
                        // image.element.src = src;  // Update the src attribute of the corresponding image in the canvas
                        redraw();
                    }
                }
                break;
            }
        }
    }
} 

function onMouseDown(event) {
    if (event.target === canvas) {
        for (var i = images.length - 1; i >= 0; i--) {
            var image = images[i];
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var x = (event.clientX - rect.left) * scaleX;
            var y = (event.clientY - rect.top) * scaleY;

            if (x >= image.x && x < image.x + image.element.width && y >= image.y && y < image.y + image.element.height) {
                isDragging = true;
                dragIndex = i;
                dragStart.x = x - image.x;
                dragStart.y = y - image.y;
                if (event.shiftKey) {
                    // Shift key is pressed, rotate image by 90 degrees
                    image.rotation += 90;
                    // If the rotation exceeds 360 degrees, reset it to 0
                    if (image.rotation >= 360) {
                        image.rotation = 0;
                    }
                    redraw();
                }
                break;
            }
        }
    }
}

function onMouseMove(event) {
    if (isDragging) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        var image = images[dragIndex];
        image.x = x - dragStart.x;
        image.y = y - dragStart.y;
        redraw();
    }
}

function onMouseUp(event) {
    if (isDragging) {
        isDragging = false;
        dragIndex = -1;
    }
}

function deleteElement(id) {
    for (var i = 0; i < images.length; i++) {
        if (images[i].id === id) {
            images.splice(i, 1);
            break;
        }
    }
    redraw();
}

function handleContextMenu(event) {
    event.preventDefault();
    var x = (event.clientX - canvas.offsetLeft) / scaleFactor;
    var y = (event.clientY - canvas.offsetTop) / scaleFactor;

    for (var i = images.length - 1; i >= 0; i--) {
        var image = images[i];
        if (x >= image.x && x < image.x + image.element.width && y >= image.y && y < image.y + image.element.height) {
            var confirmation = confirm("Are you sure you want to delete this element?");
            if (confirmation) {
                deleteElement(image.id);
            }
            break;
        }
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = src;
    });
}
  
async function redraw() {
    var canvasWidth = getAvlWidth();	// - 50;
    var canvasHeight = getAvlHeight();	// - 100;
    canvas.width = canvasWidth * scaleFactor;
    canvas.height = canvasHeight * scaleFactor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
	//ctx.drawImage(backgroundImage, 0, 0);
    
    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      var imgScaleFactor = image.radius / Math.max(image.element.width, image.element.height);
      var newWidth = image.element.width * imgScaleFactor * scaleFactor;
      var newHeight = image.element.height * imgScaleFactor * scaleFactor;
      var newX = image.x * scaleFactor + image.element.width / 2 - newWidth / 2;
      var newY = image.y * scaleFactor + image.element.height / 2 - newHeight / 2;

      // Draw the purple boundary
    //   ctx.strokeStyle = "purple";
    //   ctx.lineWidth = 2;
    //   ctx.strokeRect(newX, newY, newWidth, newHeight);
      
      // Save the current canvas state
      ctx.save();
  
      // Translate to the center of the image
      ctx.translate(newX + newWidth / 2, newY + newHeight / 2);
  
      // Rotate the canvas based on the image's rotation
      ctx.rotate((image.rotation * Math.PI) / 180);
  
      // Draw the image at the rotated position
      if (image.type === "image" && image.link) {
        try {
          var loadedImage = await loadImage(image.link);
          ctx.drawImage(loadedImage, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      } else {
        ctx.drawImage(image.element, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
      }
  
      // Restore the canvas state
      ctx.restore();
  
      if (image.type === "text") {
        ctx.save();
  
        // Apply the same rotation transformation to the text
        ctx.translate(newX + newWidth / 2, newY + newHeight / 2);
        ctx.rotate((image.rotation * Math.PI) / 180);
  
        // Adjust the vertical position of the text
        var textOffsetY = newHeight / 2 + 5; // Adjust the value as needed
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(image.text, 0, textOffsetY);
  
        ctx.restore();
      }
    }
  
    canvas.addEventListener("dblclick", onDoubleClick);
  
    // Add event listeners to handle delete functionality
    canvas.addEventListener("contextmenu", handleContextMenu);
	
	console.log("Offset left: " + canvas.offsetLeft);
	console.log("Offset top:" + canvas.offsetTop);
}  

function saveData() {
    // Create an object to hold the image data by type
    var imageDataByType = {};

    // Iterate over the images and collect the data
    for (var i = 0; i < images.length; i++) {
        var image = images[i];

        // Check if the type already exists in the object
        if (!imageDataByType.hasOwnProperty(image.type)) {
            // If the type doesn't exist, create a new array for it
            imageDataByType[image.type] = [];
        }

        // Create the image data object
        var data = {
            id: image.id,
            x: image.x,
            y: image.y,
            radius: image.radius,
            src: image.src,
            link: image.link,
            text: image.text,
            rotation: image.rotation,
            width: image.element.width,
            height: image.element.height
        };

        // Add the image data to the corresponding type array
        imageDataByType[image.type].push(data);
    }

    // Create the final JSON object
    var jsonData = {
        elements: imageDataByType,
        layoutImage:{
            src: backgroundImage.src // Set the source location
        },
		compression: {xcompression:1+xCompression, ycompression:1+yCompression}
    };

    // Create a JSON string from the data
    var jsonString = JSON.stringify(jsonData);

    // Create a Blob object with the JSON string
    var blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary anchor element to trigger the file download
    var anchor = document.createElement("a");
    anchor.download = "harness.again";
    anchor.href = URL.createObjectURL(blob);

    // Programmatically click the anchor element to trigger the download
    anchor.click();

    // Clean up the temporary anchor element
    URL.revokeObjectURL(anchor.href);
}

canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);
