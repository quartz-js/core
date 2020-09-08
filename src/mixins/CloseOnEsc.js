export var CloseOnEsc = {
  created() {
    var self = this;
    document.addEventListener('keyup', (e) => {
      if (e.keyCode == 27) {
        self.drawer = false
      }
    })
  }
}
