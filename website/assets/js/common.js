
const CLASSNAME = "-visible";

const SCROLL_TRIGGER_MIDDLE = 0;
const SCROLL_TRIGGER_BOTTOM = 1;

$(function () {
    //------------------------------
    // スクロールトリガーアニメーション
    //------------------------------
    // ページ内にjs-scroll-trigger-xxあり
    if ($('.js-scroll-trigger').length) {
        scrollAnimation('.js-scroll-trigger', SCROLL_TRIGGER_MIDDLE);
    }
    if ($('.js-scroll-trigger-bottom').length) {
        scrollAnimation('.js-scroll-trigger-bottom', SCROLL_TRIGGER_BOTTOM);
    }

    //------------------------------
    // スクロールカーテンアニメーション
    //------------------------------
    // ページ内にscrollクラスあり
    if ($('.scroll').length) {
        // animation呼び出し
        scrollCurtainAnimation();
    }

    /*
     * スクロールトリガーアニメーション
     */
    function scrollAnimation( trigger, kind ) {

        // スクロール時
        $(window).scroll( function () {

            // console.log("scroll検知");

            // スクロールトリガーが指定されている要素全てに対する処理
            $(trigger).each( function () {

                //--------------------
                // 発火要否の判定
                //--------------------
                if( $(this).hasClass('is-active') ){
                    // 発火済みは対象外のため、continue
                    console.log("continue");
                    return true;
                }

                // console.log("開始");

                //---------------------------
                // 発火タイミング
                //---------------------------
                // ブラウザのスクロール位置    
                let scroll = $(window).scrollTop();
                
                // 要素のY位置
                let triggerPos = $(this).offset().top;
                // ウィンドウの高さ
                let windowHeight = $(window).height();

                // 種別に応じて、発火のタイミングを切り分け
                let triggerLine;
                if( kind == SCROLL_TRIGGER_MIDDLE ){
                    // 対象が大体画面中央までスクロールされた時
                    triggerLine = triggerPos - (windowHeight / 1.5);
                } else {
                    // 対象が画面下部にきたとき
                    triggerLine = triggerPos - windowHeight;
                }

                //---------------------
                // 発火
                //---------------------
                if (scroll > triggerLine) {
                    // アニメーション発火
                    $(this).addClass('is-active');
                }

                // console.log("終了");
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







