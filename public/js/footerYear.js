try {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
} catch (error) {
    console.error('Error setting the current year in the footer:', error);
}

// Scroll to top function
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });