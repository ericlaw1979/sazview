'use strict';

let inputFile_;
let btnClear_;
let frameSessionList_;
const zip = new JSZip();

function doLoadFile(sazFile) {
  document.title = sazFile.name + " - SAZView";
  var fileReader = new FileReader();
  fileReader.onload = onLoadBytes;
  fileReader.readAsArrayBuffer(sazFile);
}

function inputFileChanged() {
  doLoadFile(inputFile_.files[0]);
}

function btnClearClick() {
  inputFile_.value = '';
  document.title = "SAZView";
  frameSessionList_.src = "data:text/html,<i>Select a SAZ file to load it into this viewer</i>";
}

function onLoadBytes(data) {
  zip.loadAsync(data.target.result).then(zip => {
    if (!zip.files['_index.htm']) {
      alert('The selected SAZ file lacks an index. Maybe it was captured from FiddlerCore? Sorry.');
      return;
    }
    zip.files['_index.htm'].async('string').then(content => {
      // Inject fixup references into the SessionList loaded from the SAZ.
      content=content.replace('</head>', '<script type="application/javascript" src="' + new URL('sessionlist.js', document.location.href) + '"></script><link rel="stylesheet" href="' + new URL('sessionlist.css', document.location.href) + '" /></head>');
      var blob = new Blob( [content], { type: 'text/html; charset=utf-8'} );
      frameSessionList_.src=window.URL.createObjectURL(blob);
      });
    })
    .catch(e => {
      console.log("ZIP load failed: " + e.message);
      this.inputFile_.value = null;
    });
}

// hack, remove this!
// https://stackoverflow.com/questions/14147213/search-for-multi-byte-pattern-in-uint8array
// https://codereview.stackexchange.com/questions/20136/uint8array-indexof-method-that-allows-to-search-for-byte-sequences/192136
Uint8Array.prototype.indexOfMulti = function(searchElements, fromIndex) {
    fromIndex = fromIndex || 0;

    var index = Array.prototype.indexOf.call(this, searchElements[0], fromIndex);
    if(searchElements.length === 1 || index === -1) {
        // Not found or no other elements to check
        return index;
    }

    for(var i = index, j = 0; j < searchElements.length && i < this.length; i++, j++) {
        if(this[i] !== searchElements[j]) {
            return this.indexOfMulti(searchElements, index + 1);
        }
    }

    return(i === index + searchElements.length) ? index : -1;
};

// hack
function findEndOfHeaders(data) {
  return data.indexOfMulti([0x0a,0x0d,0x0a]);
}

function doInspect(sItem) {
    zip.files[sItem].async('uint8array').then(data => {
      const ixEndOfHeaders = findEndOfHeaders(data);
      if (ixEndOfHeaders > 0) data = data.slice(0, ixEndOfHeaders);
      const blob = new Blob( [data], { type: 'text/plain; charset=utf-8'} );
      const bloburl = window.URL.createObjectURL(blob);
      // TODO: Detect if we're mobile and if so replace the current frame instead because
      // tab/window management on mobile sucks.
      // frameSessionList_.src=bloburl;
      window.open(bloburl, '_blank');
      //https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
      // https://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
      /*const uint8 = new Uint8Array([10, 20, 30, 40, 50]);
      const array1 = uint8.slice(1, 3);
      var uint8array = new TextEncoder("utf-8").encode("�");
      var string = new TextDecoder("utf-8").decode(uint8array);
*/
    });
}

// postMessage API Router
window.addEventListener('message', (e) => {
  // console.log('App Router got a message: ' + JSON.stringify(e.data));
  if (e.data.op === 'inspect') doInspect(e.data.item);
}, false);

document.addEventListener('DOMContentLoaded', function() {
  frameSessionList_ = document.getElementById("frameSessionList");
  inputFile_ = document.getElementById('inputFile');
  inputFile_.onchange = inputFileChanged;
  btnClear_ = document.getElementById('btnClear');
  btnClear.onclick = btnClearClick;

  // Implement File Handling
  // https://github.com/WICG/file-system-access/blob/master/EXPLAINER.md
  if ('launchQueue' in window) {
    launchQueue.setConsumer(launchParams => {
      if (!launchParams.files.length)
        return;
      doLoadFile(launchParams.files[0]);
    });
}

}, false);
