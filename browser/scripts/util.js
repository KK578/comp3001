// Toast Listener
window.addEventListener('toast-message', function (event) {
    var detail = event.detail;

    var toast = document.getElementById('app-toast');
    toast.text = detail.message;
    toast.show();
});
