$(document).ready(function () {
    const $terminalWrapper = $('.terminal-wrapper');
    $('.red-btn').click(function () {
        $('.terminal-wrapper').slideUp();
    });

    $('.yellow-btn').click(function () {

        let height = $terminalWrapper.height();
        height = height === 20 ? 400 : 20;
        $terminalWrapper.animate({height: height});
    });

    $('.green-btn').click(function () {
        console.log("test");
        // someother changes
        const windowHeight = $(window).height();
        console.log(windowHeight);

        let height = $terminalWrapper.height();
        height = height < windowHeight ? windowHeight : 400;
        $('.terminal-wrapper').css({
            'height': height,
        });

    });
});
