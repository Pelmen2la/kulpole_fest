import './../../scss/pages/main.scss'


(window.mainPageAppModule = function() {
    function init() {
        checkNavUrl();
    };

    function checkNavUrl() {
        const navTo = location.href.match(/#\S+/);
        if(navTo) {
            const link = document.querySelector(`[href="${navTo}"]`);
            if(link) {
                document.body.scrollTop = link.getBoundingClientRect().top;
            }
        }
    };

    return {
        init
    };
}().init());