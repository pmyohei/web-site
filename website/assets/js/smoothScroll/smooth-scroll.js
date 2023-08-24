/*!

 =========================================================
 * Smooth Scroll Animation js
 =========================================================

 */

{
    //---------------------
    // helper functions
    //---------------------
    const MathUtils = {
        // [a, b] から [c, d] の範囲で数字xをマップする
        map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
        // 線形補間
        lerp: (a, b, n) => (1 - n) * a + n * b
    };

    // body element
    const body = document.body;
    
    // 画面サイズの計算
    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    // サイズ変更時には再計算する
    window.addEventListener('resize', calcWinsize);

    // スクロール位置更新関数の定義
    let docScroll;
    // 「window.pageYOffset」非推奨対応
    // 「window.pageYOffset=0」だが「document.documentElement.scrollTop > 0」のとき、
    // 「document.documentElement.scrollTop」の値がdocScrollに設定されるようにする
    const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener('scroll', getPageYScroll);

    //-----------------------
    // Itemクラス
    //   画像のパララックス
    //-----------------------
    class Item {
        constructor(el) {
            // the .item element
            this.DOM = {el: el};
            // the inner image
            // this.DOM.image = this.DOM.el.querySelector('.item__img');

            // パララックス対象の画像（先頭にある画像。計算データはこの画像から代表して取得）
            this.DOM.image = this.DOM.el.querySelector('.page-header-image');
            // パララックス対象の画像リスト
            this.imageList = document.querySelectorAll('.page-header-image');
            
            this.renderedStyles = {
                // here we define which property will change as we scroll the page and the items is inside the viewport
                // in this case we will be translating the image on the y-axis
                // we interpolate between the previous and current value to achieve a smooth effect
                innerTranslationY: {
                    // interpolated value
                    previous: 0,
                    // current value
                    current: 0,
                    // amount to interpolate
                    ease: 0.1,
                    // 画像を変換する最大値は CSS変数 (--overflow) に設定される
                    maxValue: parseInt( getComputedStyle(this.DOM.image).getPropertyValue('--overflow'), 10 ),
                    // 現在地の設定。Translationの値は次のようになります。
                    // 項目の上部の値 (ビューポートを基準とした値) がウィンドウの高さと等しい場合 (項目がビューポートに入ったばかりのとき)、移動 = 最小値 (- 最大値)
                    //   (when the item's top value (relative to the viewport) equals the window's height (items just came into the viewport) the translation = minimum value (- maximum value))
                    // 項目の上部の値 (ビューポートを基準とした値) が「-項目の高さ」 (項目がビューポートから出たばかりのとき) と等しい場合、変換 = 最大値
                    //   (when the item's top value (relative to the viewport) equals "-item's height" (item just exited the viewport) the translation = maximum value)
                    setValue: () => {
                        const maxValue = this.renderedStyles.innerTranslationY.maxValue;
                        const minValue = -1 * maxValue;
                        return Math.max(
                                    Math.min(
                                        MathUtils.map(this.props.top - docScroll,
                                                    winsize.height,
                                                    -1 * this.props.height,
                                                    minValue,
                                                    maxValue),
                                        maxValue),
                                    minValue)
                    }
                }
            };
            // 初期値を設定する
            this.update();
            // IntersectionObserver API を使用して、要素がビューポート内にあるかどうかを確認します
            // その場合にのみ要素のTranslationが更新されます
            this.observer =
                new IntersectionObserver((entries) => {
                    entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
                });
            this.observer.observe(this.DOM.el);
            // init/bind events
            this.initEvents();
        }
        update() {
            // itemのheight top (ドキュメントを基準とした値) を取得
            this.getSize();
            // 初期値を設定（補間なし）
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }
            // 画像を変換
            this.layout();
        }
        getSize() {
            // 矩形としての大きさと位置を取得
            const rect = this.DOM.el.getBoundingClientRect();
            this.props = {
                // item's height
                height: rect.height,
                // ドキュメントに対するoffset top
                top: docScroll + rect.top 
            }
        }
        initEvents() {
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // on resize rest sizes and update the translation value
            this.update();
        }
        render() {
            // update the current and interpolated values
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            // and translates the image
            this.layout();
        }
        layout() {
            // translates the image
            // this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
            
            // 対象とする画像分、パララックス
            for(let i = 0; i < this.imageList.length; i++){
                this.imageList[i].style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
            }
        }
    }

    //----------------------------
    // SmoothScrollクラス
    //   ページのスムーズスクロール
    //----------------------------
    class SmoothScroll {
        constructor() {
            // the <main> element
            this.DOM = {main: document.querySelector('main')};
            // スクロール可能な要素。
            // スクロール (y 軸)するときにこの要素を移動します
            this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
            // the items on the page
            this.items = [];
            // [...this.DOM.main.querySelectorAll('.content > .item')].forEach( item => this.items.push(new Item(item)) );
            [...this.DOM.main.querySelectorAll('.page-header')].forEach( item => this.items.push(new Item(item)) );
            
            // ここでは、ページをスクロールするときにどのプロパティが変更されるかを定義します。
            // この場合、y軸上で平行移動します。
            // スムーズなスクロール効果を実現するために、以前の値と現在の値の間を補間します。
            this.renderedStyles = {
                translationY: {
                    // 補間値
                    previous: 0, 
                    // 現在値
                    current: 0, 
                    // 補間する量
                    ease: 0.1,
                    // 現在のスクロール位置となる現在値を設定
                    // この場合、translation値はドキュメントのスクロールと同じになります。
                    setValue: () => docScroll
                }
            };
            // set the body's height
            this.setSize();
            // set the initial values
            this.update();
            // the <main> element's style needs to be modified
            // <main> 要素のスタイルを変更する必要がある
            this.style();
            // init/bind events
            this.initEvents();
            // start the render loop
            requestAnimationFrame(() => this.render());
        }
        update() {
            // 初期値を設定します (補間なし) - スクロール値を変換します
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }
            // スクロール可能な要素をtranslate
            this.layout();
        }
        layout() {
            // スクロール可能要素をtranslate
            this.DOM.scrollable.style.transform = `translate3d(0,${-1*this.renderedStyles.translationY.previous}px,0)`;
        }
        setSize() {
            // スクロールバーをページ上に維持するためにbodyの高さを設定
            body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
        }
        style() {
            // <main> はスクロールせずに画面に「貼り付ける」必要があります。
            // そのために、位置を固定し、overflowをhiddenに設定します。
            this.DOM.main.style.position = 'fixed';
            this.DOM.main.style.width = this.DOM.main.style.height = '100%';
            this.DOM.main.style.top = this.DOM.main.style.left = 0;
            this.DOM.main.style.overflow = 'hidden';
        }
        initEvents() {
            // サイズ変更時にbodyの高さをリセット
            window.addEventListener('resize', () => this.setSize());
        }
        render() {
            // 現在の値と補間された値を更新
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            // スクロール可能要素をtranslate
            this.layout();
            
            // for every item
            for (const item of this.items) {
                // 項目がビューポート内にある場合は、そのレンダリング関数を呼び出します
                // これにより、ドキュメントのスクロール値とビューポート上のアイテムの位置に基づいて、アイテムの内部画像の変換が更新されます。
                if ( item.isVisible ) {
                    item.render();
                }
            }
            
            // loop..
            requestAnimationFrame(() => this.render());
        }
    }

    /***********************************/
    /********** Preload stuff **********/

    // Preload images
    // const preloadImages = () => {
    //     // 非同期処理
    //     return new Promise((resolve, reject) => {
    //         // パララックス対象の読み込みが全て完了したとき
    //         // imagesLoaded(document.querySelectorAll('.item__img'), {background: true}, resolve);
    //         imagesLoaded(document.querySelectorAll('.page-header-image'), {background: true}, resolve);
    //     });
    // };
    
    // And then..
    // preloadImages().then(() => {
    //     // Remove the loader
    //     document.body.classList.remove('loading');
    //     // スクロール位置を取得
    //     getPageYScroll();
    //     console.log("docScroll=", docScroll );
    //     // Smooth Scrollingを初期化
    //     new SmoothScroll();
    // });


    /*
      Smooth Scrolling初期化
    */
    const initSmoothScroll = () => {
        
        //---------------------------
        // スマホ／タブレット無効化判定
        //---------------------------
        if (window.matchMedia && window.matchMedia('(max-device-width: 767px)').matches) {
            // SmoothScrollなし
            return;
        }

        //---------------------------
        // SmoothScroll 初期処理
        //---------------------------
        // スクロール位置を取得
        getPageYScroll();

        // Smooth Scrollingを初期化
        new SmoothScroll();
    };

    // ページ読み込みが完了したとき、Smooth Scrollingを初期化する
    // ！こうしないと、id指定にてページ内の任意の個所にジャンプしたとき、
    //   ジャンプ先がページ最上部として計算される
    window.addEventListener('load', initSmoothScroll);
}