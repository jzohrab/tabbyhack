// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build

window.openPopup = function(contentDivID) {
  const content = document.getElementById(contentDivID).innerHTML
  const popup = document.getElementById('popupDiv')
  const popupText = document.getElementById('popupText')
  popupText.innerHTML = content
  popup.style.display = "block";
}

window.closePopup = function() {
  document.getElementById('popupDiv').style.display = "none";
}
