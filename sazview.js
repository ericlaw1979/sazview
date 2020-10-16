'use strict';

let inputFile_;
let btnClear_;
let frameSessionList_;

function inputFileChanged() { 
  const sazFile = inputFile_.files[0];
  document.title = sazFile.name + " - SAZView";
  var fileReader = new FileReader();
  fileReader.onload = onLoadBytes;
  fileReader.readAsArrayBuffer(sazFile);
}

function btnClearClick() {
  inputFile_.value = '';
  document.title = "SAZView";
  frameSessionList_.src = "data:text/html,<i>Select a SAZ file to load it into this viewer</i>";
}

function onLoadBytes(data) {
  const zip = new JSZip();
	zip.loadAsync(data.target.result)
	  .then(zip => {
	   /* for (const filename in zip.files) {
	      if (filename.toLowerCase()!=='_index.htm') {
	        console.log('Netlog Import skipping: ' + filename);
	        continue;
	      }
	  */
	  
	  if (!zip.files['_index.htm']) return;
	  zip.files['_index.htm'].async('string').then(content => {
	        
	        //console.log(content);
	        
	        
	    content=content.replace('</head>', '<link rel="stylesheet" href="' + new URL('sessionlist.css', document.location.href) + '" /></head>');
	            
	         var blob = new Blob( [content], { type: 'text/html; charset=utf-8'} );
	         
	         
	         frameSessionList_.style='width:100%; height:100%; display:block;';
	         frameSessionList_.src=window.URL.createObjectURL(blob);
	         
	         
	   //     var result = LogUtil.loadLogFile(content, logFile.name + //    "::" + filename);
	      });
	      // We only need one index
	//          return;
	    
	    // If we made it this far, we did not find any JSON.
	//        throw new Error("The ZIP file did not contain a netlog.json file.");
	  })
	  .catch(e => {
	    console.log("ZIP load failed: " + e.message);
	    this.inputFile_.value = null;
	//    this.setLoadFileStatus(
	  //      'Error: Unable to find json inside the ZIP file.', false);
	  });
}


document.addEventListener('DOMContentLoaded', function() {
	frameSessionList_ = document.getElementById("frameSessionList");
  inputFile_ = document.getElementById('inputFile');
  inputFile_.onchange = inputFileChanged; 
  btnClear_ = document.getElementById('btnClear'); 
  btnClear.onclick = btnClearClick;
  
}, false);
