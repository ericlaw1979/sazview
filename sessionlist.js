//https://www.brainbell.com/javascript/making-resizable-table-js.html
//function resizableGrid(e){var t=e.getElementsByTagName("tr")[0],n=t?t.children:void 0;if(n){e.style.overflow="hidden";for(var i=e.offsetHeight,o=0;o<n.length;o++){var r=s(i);n[o].appendChild(r),n[o].style.position="relative",d(r)}}function d(e){var t,n,i,o,r;e.addEventListener("mousedown",function(e){n=e.target.parentElement,i=n.nextElementSibling,t=e.pageX;var d=function(e){if("border-box"==l(e,"box-sizing"))return 0;var t=l(e,"padding-left"),n=l(e,"padding-right");return parseInt(t)+parseInt(n)}(n);o=n.offsetWidth-d,i&&(r=i.offsetWidth-d)}),e.addEventListener("mouseover",function(e){e.target.style.borderRight="2px solid #0000ff"}),e.addEventListener("mouseout",function(e){e.target.style.borderRight=""}),document.addEventListener("mousemove",function(e){if(n){var d=e.pageX-t;i&&(i.style.width=r-d+"px"),n.style.width=o+d+"px"}}),document.addEventListener("mouseup",function(e){n=void 0,i=void 0,t=void 0,r=void 0,o=void 0})}function s(e){var t=document.createElement("div");return t.style.top=0,t.style.right=0,t.style.width="5px",t.style.position="absolute",t.style.cursor="col-resize",t.style.userSelect="none",t.style.height=e+"px",t}function l(e,t){return window.getComputedStyle(e,null).getPropertyValue(t)}}

document.addEventListener('DOMContentLoaded', function() {

  // Intercept clicks on links to resources.
  const links=document.getElementsByTagName('a');
  for (link of links) {
    if (link.getAttribute("href").startsWith('raw')) {
      link.onclick=e=>{ window.top.postMessage({'op':'inspect', 'item':e.target.getAttribute('href').replace('\\','/')}); console.log('Sending request to view ' + e.target.getAttribute('href')); return false;}
    }
  }

//  var tables = document.getElementsByTagName('table');  for (var i=0; i<tables.length;i++){ resizableGrid(tables[i]);}

}, false);
