// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build

window.openPopup = function(contentDivID) {
  const content = document.getElementById(contentDivID).innerHTML
  const popup = document.getElementById('popupDiv')
  const popupText = document.getElementById('popupText')
  popupText.innerHTML = content
  popup.style.display = "block"
}

window.closePopup = function() {
  // Hack to stop youtube vid from playing.
  // Tried various solutions but none worked, e.g.
  // ref https://magento.stackexchange.com/questions/263376/
  //    modal-window-with-youtube-video-stop-video-playing
  // They perhaps failed due to my popup method here being
  // unorthodox ... not sure.
  const popupText = document.getElementById('popupText')
  popupText.innerHTML = '<p>Closing ...</p>'  // replace existing player.
  document.getElementById('popupDiv').style.display = "none"
}
