// document.ENV will rewrite process.env configs

document.ENV = document.ENV || Object.freeze({
  /* ... */
})

//TODO: FIND BETTER PLACE FOR THIS
window.Browser = {
  T: () => {}
}
