
const CLASSNAME = "-visible";

$(function () {
    // ページ内にjs-scroll-triggerクラスが存在した場合
    if ($('.js-scroll-trigger').length) {
        // animation呼び出し
        scrollAnimation( 100 );
    }

    if ($('.js-scroll-trigger-bottom').length) {
        // animation呼び出し
        scrollAnimationDelay( 400 );
    }

    // ページ内にscrollクラスが存在した場合
    if ($('.scroll').length) {
        // animation呼び出し
        scrollCurtainAnimation();
    }

    /*
    * animation関数
    */
    function scrollAnimation( activeLine ) {

        // スクロール時
        $(window).scroll( function () {

            // スクロールトリガーが指定されている要素全てに対する処理
            $(".js-scroll-trigger").each( function () {
                
                // 要素のY位置
                let position = $(this).offset().top,
                // ブラウザのスクロール位置    
                scroll = $(window).scrollTop(),
                // ウィンドウの高さ
                windowHeight = $(window).height();

                // 要素が画面下部xxxpxに達した場合
                if (scroll > position - windowHeight + activeLine) {
                    // アニメーション発火
                    $(this).addClass('is-active');
                }
            });
        });
    }
    
    
    function scrollAnimationDelay( activeLine ) {

        // スクロール時
        $(window).scroll( function () {

            // スクロールトリガーが指定されている要素全てに対する処理
            $(".js-scroll-trigger-bottom").each( function () {
                
                // 要素のY位置
                let position = $(this).offset().top,
                // ブラウザのスクロール位置    
                scroll = $(window).scrollTop(),
                // ウィンドウの高さ
                windowHeight = $(window).height();

                // 要素が画面下部xxxpxに達した場合
                if (scroll > position - windowHeight + activeLine) {
                    // アニメーション発火
                    $(this).addClass('is-active');
                }
            });
        });
    }



    /*
    * animation関数
    */
    function scrollCurtainAnimation() {

        // スクロール時
        $(window).scroll( function () {

            $scroll = $('.scroll');

            // スクロールトリガーが指定されている要素全てに対する処理
            $scroll.each( function () {
                
                scroll_volume = $scroll.attr('scroll-volume');
                console.log( scroll_volume );
                // console.log( "test" );

                // 要素のY位置
                let position = $(this).offset().top,
                // ブラウザのスクロール位置    
                scroll = $(window).scrollTop(),
                // ウィンドウの高さ
                windowHeight = $(window).height();

                // 要素が画面下部200pxに達した場合
                if (scroll > position - windowHeight + 400) {
                    // アニメーション発火
                    $(this).addClass(CLASSNAME);
                }
            });
        });
    }

    // JavaScript ファイルが読み込まれた際に意図的にスクロールイベントを発生
    // ※リロード対策
    $(window).trigger('scroll');
});







