(function($) {
  function PreLoad(imgs, options) {
    this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
    this.opts = $.extend({}, PreLoad.DEFAULTS, options);

    if (this.opts.type === "order") { //判断加载类型
      this._order()
    } else {
      this._unorder();
    }
  }
  PreLoad.DEFAULTS = {
    type: 'unorder', //无序预加载
    eachfun: null, //每张图片加载完毕后执行
    allfun: null //所有图片加载完后执行
  };

  PreLoad.prototype._unorder = function(){ //无序加载
    var imgs = this.imgs,
        opts = this.opts,
        count = 0,
        len = imgs.length;

    $.each(imgs, function(index, src) {
      if (typeof src !== 'string') {
        return;
      }
      var imgObj = new Image();
      $(imgObj).on('load error', function() {
        opts.eachfun && opts.eachfun(count);
        if (count >= len - 1) { //所有图片已经加载完毕
          opts.allfun && opts.allfun();
        }
        count++;
      });
      imgObj.src = src;
    });
  };
  
  PreLoad.prototype._order = function() { //有序加载
    var opts = this.opts,
        imgs = this.imgs,
        len = imgs.length,
        count = 0;

        load();
        function load() {
          var imgObj = new Image();
          $(imgObj).on('load error', function() {
              opts.eachfun && opts.eachfun(count);
              if (count >= len) { //所有图片已经加载完毕
                opts.allfun && opts.allfun();
              } else {
                load();
              }
              count++;
          });
          imgObj.src = imgs[count];
        }
  }

  $.extend({
    preload: function(imgs, opts) { //方法封装到jQuery
      new PreLoad(imgs, opts);
    }
  });
})(jQuery);
