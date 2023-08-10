/*!
  テンプレート java script
 */


var transparent = true;
var big_image;
var parallax_image;

var transparentDemo = true;
var fixedTop = false;

var navbar_initialized,
  backgroundOrange = false,
  toggle_initialized = false;

var nowuiKit,
  $navbar,
  scroll_distance,
  oVal;


/*
  ready
*/
$(document).ready(function() {

  //------------------------------------------
  // ナビバー
  //------------------------------------------
  // ナビバーの折りたたみの画像をアクティブ化
  nowuiKit.initNavbarImage();

  // 各種変数
  $navbar = $('.navbar[color-on-scroll]');
  scroll_distance = $navbar.attr('color-on-scroll') || 500;

  // カラー変更クラスあり
  if ($('.navbar[color-on-scroll]').length != 0) {
    // ナビバー背景色の制御
    nowuiKit.checkScrollForTransparentNavbar();
    
    // スクロールされたタイミングで、ナビバー背景色を制御する
    $(window).on('scroll', nowuiKit.checkScrollForTransparentNavbar)
  }

  //------------------------------------
  // サブメニューホバー背景色の制御
  //------------------------------------
  $(window).on('scroll', nowuiKit.checkScrollForSubMenu)



  //------------------------------------
  // ヘッダー画像パララックス制御
  //------------------------------------
  // ブラウザサイズが規定サイズ以上の場合
  if ($(window).width() >= 992) {
    // パララックス対象の画像を保持
    big_image = $('.page-header-image[data-parallax="true"]');

    // お試し
    parallax_image = $('.recruit_fix_bg_parallax[data-parallax="true"]');
    
    // スクロールタイミングでパララックス制御
    $(window).on('scroll', parallaxControl.checkScrollForParallax);
  }

  
  //------------------------------------
  // Carouselをアクティブに
  //------------------------------------
  $('.carousel').carousel({
    interval: 4000
  });

});


//------------------------------------
// パララックス制御
//------------------------------------
parallaxControl = {

  //------------------------------------
  // スクロールパララックス制御
  //------------------------------------
  checkScrollForParallax: debounce(function() {
    var current_scroll = $(this).scrollTop();

    // スクロール量をベースに視差効果の量を計算
    oVal = ($(window).scrollTop() / 3);

    // パララックス対象画像に視差効果を与える
    big_image.css({
      'transform': 'translate3d(0,' + oVal + 'px,0)',
      '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-ms-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-o-transform': 'translate3d(0,' + oVal + 'px,0)'
    });

    parallax_image.css({
      'transform': 'translate3d(0,' + oVal + 'px,0)',
      '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-ms-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-o-transform': 'translate3d(0,' + oVal + 'px,0)'
    });

  }, 6)

}

//------------------------------------
// debounce
//   イベント一定時間経過後処理
//------------------------------------
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

/*
  resize
*/
$(window).on('resize', function() {
  // ナビバーの折りたたみの画像をアクティブ化
  nowuiKit.initNavbarImage();
});

/*
  click
*/
$(document).on('click', '.navbar-toggler', function() {
  //-----------------------------
  // ナビバーtoggleクリック処理
  //-----------------------------
  $toggle = $(this);

  if (nowuiKit.misc.navbar_menu_visible == 1) {
    $('html').removeClass('nav-open');
    nowuiKit.misc.navbar_menu_visible = 0;
    
    $('#bodyClick').remove();
    setTimeout(function() {
      $toggle.removeClass('toggled');
    }, 550);

  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 580);
    
    div = '<div id="bodyClick"></div>';
    
    $(div).appendTo('body').click(function() {
      $('html').removeClass('nav-open');
      nowuiKit.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('#bodyClick').remove();
      }, 550);
    });

    $('html').addClass('nav-open');
    nowuiKit.misc.navbar_menu_visible = 1;
  }
});

//------------------------
// nowuiKit 処理群
//------------------------
nowuiKit = {
  // その他
  misc: {
    navbar_menu_visible: 0
  },

  //-------------------------------------
  // ナビバー色制御
  //   スクロール量に応じて色を変化させる
  //-------------------------------------
  checkScrollForTransparentNavbar: debounce(function() {
    if ($(document).scrollTop() > scroll_distance) {
      if (transparent) {
        // 透明解除
        transparent = false;
        $('.navbar[color-on-scroll]').removeClass('navbar-transparent');
      }
    } else {
      if (!transparent) {
        // 透明化
        transparent = true;
        $('.navbar[color-on-scroll]').addClass('navbar-transparent');
      }
    }
  }, 17),


  //--------------------------------------
  // サブメニューホバー背景色変更チェック
  //--------------------------------------
  checkScrollForSubMenu: debounce( function() {

    if ($(window).width() < 992) {
      return;
    }

    // サブメニュー表示中の場合
    if( $('.submenu-wrapper').hasClass('active') ){

      // スクロールがnavの背景色を変更する規定ラインを超過
      if ($(document).scrollTop() > scroll_distance) { 

        // サブメニューの背景色を入れ替え
        if( $('.submenu-parent').hasClass('none') ){
          $('.submenu-parent').removeClass("none");
          $('.submenu-parent').addClass("dark");
        }

      } else {

        // サブメニューの背景色を入れ替え
        if( $('.submenu-parent').hasClass('dark') ){
          $('.submenu-parent').removeClass("dark");
          $('.submenu-parent').addClass("none");
        }
      }
    }
  }, 17),


  //----------------------------------------
  // ナビバーの折りたたみ画像アクティブ化
  //----------------------------------------
  initNavbarImage: function() {
    var $navbar = $('.navbar').find('.navbar-translate').siblings('.navbar-collapse');
    var background_image = $navbar.data('nav-image');

    if (background_image != undefined) {
      
      if ($(window).width() < 991 || $('body').hasClass('burger-menu')) {
        $navbar.css('background', "url('" + background_image + "')")
          .removeAttr('data-nav-image')
          .css('background-size', "cover")
          .addClass('has-image');
          
      } else {
        $navbar.css('background', "")
          .attr('data-nav-image', '' + background_image + '')
          .css('background-size', "")
          .removeClass('has-image');
      }
    }
  },
}

/*
 * サブメニューホバー表示制御 
 */
$(function(){

  var nav_root = $(this).find('.nav_root');
  
  $(".submenu-hover-item").mouseover( function(){
    
    if ($(window).width() < 992) {
      return;
    }

    //------------------------------
    // サブメニュー表示
    //------------------------------
    var submenu_wrapper = $(this).find('.submenu-wrapper');
    submenu_wrapper.addClass("active");

    var submenu_parent = $(this).find('.submenu-parent')
    
    // スクロール量に応じて、背景色を選択
    if ($(document).scrollTop() > scroll_distance) {
      submenu_parent.removeClass("none");
      submenu_parent.addClass("dark");

    } else {
      submenu_parent.removeClass("dark");
      submenu_parent.addClass("none");
    }
  
  }).mouseout(function() {
      // サブメニュー閉じる
      $(this).find('.submenu-wrapper').removeClass("active");
  });
});


/*
 * サブメニュークリック表示制御：スマホサイズ版
 */
$(function(){
  $(".submenu-hover-item").click( function(){

    //------------------------------
    // ブラウザサイズ判定
    //------------------------------
    // ブラウザサイズが規定サイズ以上の場合、処理対象外
    if ($(window).width() >= 992) {
      return;
    }
    
    //------------------------------
    // サブメニュー開き中
    //------------------------------
    // 既に開いていれば、閉じて終了
    var clickedSubMenu = $(this).find('.subMenu_side');
    if( clickedSubMenu.hasClass('active') ){
      clickedSubMenu.removeClass('active')
      return;
    }

    //------------------------------
    // 開いているサブメニューをクローズ
    //------------------------------
    // メニューを全て取得
    var subMenuList = $(this).parent().children(".submenu-hover-item");
    
    // 開いているサブメニューを探す
    subMenuList.each (function() {

      var subMenu = $(this).find('.subMenu_side');

      // 開いているサブメニューをクローズ
      if( subMenu.hasClass('active') ){
        subMenu.removeClass('active');
        return false;
      }
    });

    // クリックされたメニューのサブメニューを表示
    clickedSubMenu.addClass("active");

  });
});


