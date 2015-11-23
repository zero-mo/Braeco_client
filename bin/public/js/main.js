var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(window, document) {
  var Activity, Category, Individual, LocStor, Lock, Menu, addClass, addListener, ajax, append, callpay, clientHeight, clientWidth, compatibleCSSConfig, createDom, deepCopy, getById, getElementsByClassName, getJSON, getObjectURL, hasClass, hashRoute, hidePhone, initDishJSON, innerCallback, isPhone, prepend, query, querys, ref, remove, removeClass, removeListener, rotateDisplay, toggleClass;
  ref = [util.addListener, util.removeListener, util.hasClass, util.addClass, util.removeClass, util.ajax, util.getElementsByClassName, util.isPhone, util.hidePhone, util.query, util.querys, util.remove, util.append, util.prepend, util.toggleClass, util.getObjectURL, util.deepCopy, util.getById, util.createDom], addListener = ref[0], removeListener = ref[1], hasClass = ref[2], addClass = ref[3], removeClass = ref[4], ajax = ref[5], getElementsByClassName = ref[6], isPhone = ref[7], hidePhone = ref[8], query = ref[9], querys = ref[10], remove = ref[11], append = ref[12], prepend = ref[13], toggleClass = ref[14], getObjectURL = ref[15], deepCopy = ref[16], getById = ref[17], createDom = ref[18];
  clientWidth = document.body.clientWidth;
  clientHeight = document.documentElement.clientHeight;
  compatibleCSSConfig = ["", "-webkit-", "-moz-", "-ms-", "-o-"];
  getJSON = function(json) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    return json;
  };
  Lock = (function() {})();
  Category = (function() {

    /*
    		* 六个静态私有变量
    		* 1. 用于首页展示的ul的Dom, 里面存放displayDom
    		* 2. 用于点餐页面顶栏ul的Dom, 里面存放bookCategoryDom
    		* 3. 点餐页面用于给顶栏ul纪录调整宽度的值
    		* 4. 所有category类的容器
    		* 5. 当前选中的品类
    		* 6. 调整宽度按照字符来计算, 1个字母为10px, 1个数字为11px, 1个空格为6px, 1个中文为16px
     */
    var _categoryBookCategoryUlDom, _categoryBookCategoryUlWidth, _cateogries, _catergoryDisplayUlDom, _chooseBookCategoryByCurrentChoose, _currentChoose, _getBookCategoryDom, _getDisplayDom, _getWidthByContent, _unChooseAllBookCategoryDom, _updateBookCategoryDomWidth, _widthByContent;

    _catergoryDisplayUlDom = query("#Menu-page .category-display-list");

    _categoryBookCategoryUlDom = query("#book-category-wrap .tag-list");

    _categoryBookCategoryUlWidth = 0;

    _cateogries = [];

    _currentChoose = 0;

    _widthByContent = {
      "letter": 10,
      "number": 11,
      "space": 6,
      "chinese": 16
    };


    /*
    		* 静态私有函数
    		* 创建和返回displayDom, 并投放到_catergoryDisplayUlDom中
    		* @param {Object} category类变量
     */

    _getDisplayDom = function(category) {
      var dom, imgDomStr, nameDomStr, url;
      dom = createDom("li");
      dom.id = "category-" + category.seqNum;
      url = category.url || "";
      imgDomStr = "<img alt='标签' class='category-img' src=" + url + ">";
      nameDomStr = "<div class='category-name-field'><p class='category-name'>" + category.name + "</div>";
      dom.innerHTML = "" + imgDomStr + nameDomStr;
      append(_catergoryDisplayUlDom, dom);
      return dom;
    };


    /*
    		* 静态私有函数
    		* 创建和返回bookbookCategory的dom, 并投放在_categoryBookCategoryUlDom中
    		* @param {Object} category类变量
     */

    _getBookCategoryDom = function(category) {
      var dom, width;
      dom = createDom("li");
      dom.id = "tag-list-" + category.seqNum;
      dom.innerHTML = category.name;
      width = _getWidthByContent(category.name);
      dom.style.width = width + "px";
      append(_categoryBookCategoryUlDom, dom);
      _categoryBookCategoryUlWidth += width + 30;
      return dom;
    };


    /*
    		* 静态私有函数
    		* 得到对应的dom的长度
    		* @param {String} dom的内容
     */

    _getWidthByContent = function(str) {
      var allChineseWordLength, allLetter, allLetterLength, allNumber, allNumberLength, allSpace, allSpaceLength;
      allLetter = str.match(/[a-z]/ig) || [];
      allNumber = str.match(/[0-9]/ig) || [];
      allSpace = str.match(/\s/ig) || [];
      allLetterLength = allLetter.length;
      allNumberLength = allNumber.length;
      allSpaceLength = allSpace.length;
      allChineseWordLength = str.length - allLetterLength - allNumberLength - allSpaceLength;
      return _widthByContent["letter"] * allLetterLength + _widthByContent["number"] * allNumberLength + _widthByContent["space"] * allSpaceLength + _widthByContent["chinese"] * allChineseWordLength + 1;
    };

    _updateBookCategoryDomWidth = function() {
      return _categoryBookCategoryUlDom.style.width = _categoryBookCategoryUlWidth + "px";
    };

    _unChooseAllBookCategoryDom = function() {
      var dom, j, len, ref1, results;
      ref1 = querys("li", _categoryBookCategoryUlDom);
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        dom = ref1[j];
        results.push(removeClass(dom, "choose"));
      }
      return results;
    };

    _chooseBookCategoryByCurrentChoose = function() {
      _unChooseAllBookCategoryDom();
      return addClass(_cateogries[_currentChoose].bookCategoryDom, "choose");
    };

    function Category(options) {
      deepCopy(options, this);
      this.init();
      _updateBookCategoryDomWidth();
      _cateogries.push(this);
    }

    Category.prototype.init = function() {
      this.initDisplayDom();
      this.initBookCategoryDom();
      return this.initEvent();
    };

    Category.prototype.initDisplayDom = function() {
      return this.displayDom = _getDisplayDom(this);
    };

    Category.prototype.initBookCategoryDom = function() {
      return this.bookCategoryDom = _getBookCategoryDom(this);
    };

    Category.prototype.initEvent = function() {
      var self;
      self = this;
      addListener(self.displayDom, "click", function() {
        return hashRoute.hashJump("-Detail-Book-bookCol");
      });
      return addListener(self.bookCategoryDom, "click", function() {
        _currentChoose = self.seqNum;
        return _chooseBookCategoryByCurrentChoose();
      });
    };

    Category.getCurrentChoose = function() {};

    return Category;

  })();
  initDishJSON = function() {
    var category, dishJSON, i, j, len, results, tempOuter;
    dishJSON = getJSON(getDishJSON());
    results = [];
    for (i = j = 0, len = dishJSON.length; j < len; i = ++j) {
      tempOuter = dishJSON[i];
      results.push(category = new Category({
        name: tempOuter.categoryname,
        id: tempOuter.id,
        seqNum: i
      }));
    }
    return results;
  };
  Activity = (function() {
    var _activityInfoImgDom, _activityInformationDom, dom, j, len, ref1;

    function Activity() {}

    _activityInformationDom = query(".Activity-information-field");

    _activityInfoImgDom = query("#activity-info-img-field", _activityInformationDom);

    _activityInfoImgDom.style.height = (clientWidth * 0.9 * 167 / 343) + "px";

    ref1 = querys("#Activity-container-column li");
    for (j = 0, len = ref1.length; j < len; j++) {
      dom = ref1[j];
      addListener(dom, "click", function() {
        return hashRoute.pushHashStr("activityInfo");
      });
    }

    return Activity;

  })();
  rotateDisplay = (function() {
    var _autoRotateEvent, _getCompatibleTranslateCss, _touchEnd, _touchMove, _touchStart;

    _getCompatibleTranslateCss = function(ver, hor) {
      var config, j, len, result_;
      result_ = {};
      for (j = 0, len = compatibleCSSConfig.length; j < len; j++) {
        config = compatibleCSSConfig[j];
        result_[config + "transform"] = "translate(" + ver + ", " + hor + ")";
      }
      return result_;
    };

    _autoRotateEvent = function(rotateDisplay) {
      var index, self;
      self = rotateDisplay;

      /*
      			* 监视autoFlag
       */
      if (!self.autoFlag) {
        self.autoFlag = true;
      } else {
        index = (self.currentChoose + 1) % self.activityNum;
        self.setCurrentChooseAndTranslate(index);
      }
      return setTimeout(function() {
        return _autoRotateEvent(self);
      }, self.delay);
    };


    /*
    		* 触摸开始的时候记录初始坐标位置
     */

    _touchStart = function(e, rotateDisplay) {
      rotateDisplay.autoFlag = false;
      rotateDisplay.startX = e.touches[0].clientX;
      rotateDisplay.startY = e.touches[0].clientY;
      rotateDisplay.currentX = e.touches[0].clientX;
      return rotateDisplay.currentY = e.touches[0].clientY;
    };


    /*
    		* 触摸的过程记录触摸所到达的坐标
     */

    _touchMove = function(e, rotateDisplay) {
      rotateDisplay.autoFlag = false;
      rotateDisplay.currentX = e.touches[0].clientX;
      rotateDisplay.currentY = e.touches[0].clientY;
      e.preventDefault();
      return e.stopPropagation();
    };


    /*
    		* 比较判断用户是倾向于左右滑动还是上下滑动
    		* 若为左右滑动，则根据用户滑动的地方，反向轮转播放动画(符合正常的滑动逻辑)
     */

    _touchEnd = function(e, rotateDisplay) {
      var activityNum, currentChoose, currentX, currentY, startX, startY, transIndex;
      rotateDisplay.autoFlag = false;
      currentX = rotateDisplay.currentX;
      currentY = rotateDisplay.currentY;
      startX = rotateDisplay.startX;
      startY = rotateDisplay.startY;
      if (Math.abs(currentY - startY) >= Math.abs(currentX - startX)) {
        return;
      }
      currentChoose = rotateDisplay.currentChoose;
      activityNum = rotateDisplay.activityNum;
      if (currentX < startX) {
        transIndex = (currentChoose + 1) % activityNum;
      } else if (currentX > startX) {
        transIndex = (currentChoose - 1 + activityNum) % activityNum;
      }
      return rotateDisplay.setCurrentChooseAndTranslate(transIndex);
    };


    /*
    		* 图片轮转播放
    		* @param {Object} options: 组件配置
    		*
    		* 调用方法:
    		* 直接通过构造函数，传入对应的对象配置即可。
    		* displayCSSSelector为图片所在的ul的css选择器
    		* chooseCSSSelector为图片对应的标号索引所在的ul的css选择器
    		* delay为图片每次轮转的时间
     */

    function rotateDisplay(options) {
      var dom, j, len, ref1;
      this.displayUlDom = query(options.displayCSSSelector);
      this.chooseUlDom = query(options.chooseCSSSelector);
      this.delay = options.delay;
      ref1 = querys("img", this.displayUlDom);
      for (j = 0, len = ref1.length; j < len; j++) {
        dom = ref1[j];
        dom.style.height = (options.scale * clientWidth) + "px";
      }
      this.init();
    }

    rotateDisplay.prototype.init = function() {
      this.initDisplay();
      this.initChoose();
      this.initAutoRotate();
      return this.initTouchEvent();
    };

    rotateDisplay.prototype.initDisplay = function() {
      var dom, j, len, ref1;
      this.displayContainerDom = this.displayUlDom.parentNode;
      this.displayContainerDom.style.overflowX = "auto";
      this.allDisplayDom = querys("li", this.displayUlDom);

      /*
      			* 让所有的图片的宽度都能适应屏幕
       */
      ref1 = this.allDisplayDom;
      for (j = 0, len = ref1.length; j < len; j++) {
        dom = ref1[j];
        dom.style.width = clientWidth + "px";
      }
      this.activityNum = this.allDisplayDom.length;

      /*
      			* 扩充图片所在ul的长度
       */
      return this.displayUlDom.style.width = (clientWidth * this.activityNum) + "px";
    };

    rotateDisplay.prototype.initChoose = function() {
      var dom, i, j, len, ref1, results, self;
      this.chooseUlDom.parentNode.style.overflow = "hidden";
      self = this;
      this.allChooseDom = querys("li", this.chooseUlDom);
      this.currentChoose = 0;
      ref1 = this.allChooseDom;
      results = [];
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        dom = ref1[i];
        results.push(addListener(dom, "click", (function(i) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.autoFlag = false;
            return self.setCurrentChooseAndTranslate(i);
          };
        })(i)));
      }
      return results;
    };

    rotateDisplay.prototype.initAutoRotate = function() {

      /*
      			* autoFlag用于监视是否有人工操作，如果有，则当前最近一次不做播放，重新设置autoFlag，使得下一次播放正常进行
       */
      var self;
      self = this;
      this.autoFlag = true;
      return setTimeout(function() {
        return _autoRotateEvent(self);
      }, self.delay);
    };

    rotateDisplay.prototype.initTouchEvent = function() {
      var self;
      self = this;
      addListener(this.displayContainerDom, "touchstart", function(e) {
        return _touchStart(e, self);
      });
      addListener(this.displayContainerDom, "touchmove", function(e) {
        return _touchMove(e, self);
      });
      return addListener(this.displayContainerDom, "touchend", function(e) {
        return _touchEnd(e, self);
      });
    };

    rotateDisplay.prototype.setCurrentChoose = function(index) {
      this.allChooseDom[this.currentChoose].className = "inactive";
      this.allChooseDom[index].className = "active";
      return this.currentChoose = index;
    };

    rotateDisplay.prototype.setCurrentChooseAndTranslate = function(index) {
      var compatibleTranslateCss, key, transIndex, value;
      if (index < 0 || index >= this.activityNum || index === this.currentChoose) {
        return;
      }
      transIndex = -1 * index;
      compatibleTranslateCss = _getCompatibleTranslateCss((transIndex * clientWidth) + "px", 0);
      for (key in compatibleTranslateCss) {
        value = compatibleTranslateCss[key];
        this.displayUlDom.style[key] = value;
      }
      return this.setCurrentChoose(index);
    };

    return rotateDisplay;

  })();
  Menu = (function() {
    var _allDishDoms, dom, j, len, results;
    _allDishDoms = querys("#book-dish-wrap .food-list-wrap li");
    results = [];
    for (j = 0, len = _allDishDoms.length; j < len; j++) {
      dom = _allDishDoms[j];
      results.push(addListener(dom, "click", function() {
        return hashRoute.pushHashStr("bookInfo");
      }));
    }
    return results;
  })();
  Individual = (function() {
    var _confirmRechargebtn, _rechargeFuncDom;
    _rechargeFuncDom = getById("Recharge-func");
    addListener(_rechargeFuncDom, "click", function() {
      return hashRoute.pushHashStr("Extra-extraContent-Recharge");
    });
    _confirmRechargebtn = getById("recharge-confirm-column");
    return addListener(_confirmRechargebtn, "click", function() {
      return hashRoute.pushHashStr("choosePaymentMethod");
    });
  })();
  hashRoute = (function() {
    var HomeBottom, HomeMenu, _activityInfoDom, _allExtraContentDoms, _allExtraContentId, _allExtraDoms, _allExtraFormDoms, _allExtraFormId, _allMainDetailDoms, _allMainDetailId, _allMainDoms, _allMainHomeDoms, _allMainHomeId, _allSecondary, _dynamicShowTarget, _extraMainDom, _getHashStr, _hashStateFunc, _hideAllExtra, _hideAllExtraContentPage, _hideAllExtraFormPage, _hideAllExtraPage, _hideAllMain, _hideAllMainDetailPage, _hideAllMainHomePage, _hideAllMainPage, _hideSecondaryPage, _hideTarget, _loc, _modifyTitle, _parseAndExecuteHash, _recentHash, _secondaryInfo, _staticShowTarget, _switchExtraPage, _switchFirstPage, _switchSecondaryPage, _titleDom, hashJump, popHashStr, pushHashStr;
    HomeBottom = (function() {
      var _allDoms, _state, bottomTouchEventTrigger, uncheckAllForBottomAndHideTarget;
      _state = "";
      _allDoms = querys("#nav-field .bottom-field div");
      uncheckAllForBottomAndHideTarget = function() {
        var dom, id, j, len, results;
        results = [];
        for (j = 0, len = _allDoms.length; j < len; j++) {
          dom = _allDoms[j];
          id = dom.id;
          dom.className = id + "-unchecked";
          results.push(_hideTarget(id + "-page"));
        }
        return results;
      };
      bottomTouchEventTrigger = function(id) {
        if (_state !== id) {

          /*
          					*WebSocketxxxxx
           */
        }
        _state = id;
        uncheckAllForBottomAndHideTarget();
        getById(id).className = id + "-checked";
        return _staticShowTarget(id + "-page");
      };
      return {
        bottomTouchEventTrigger: bottomTouchEventTrigger,
        uncheckAllForBottomAndHideTarget: uncheckAllForBottomAndHideTarget
      };
    })();
    HomeMenu = (function() {
      var _activityColumnDom;
      _activityColumnDom = query("#Menu-page .activity-wrapper");
      return addListener(_activityColumnDom, "click", function() {
        return hashJump("-Detail-Activity");
      });
    })();
    _extraMainDom = getById("#extra");
    _allMainDoms = querys(".main-page");
    _allMainHomeDoms = querys(".main-home-page");
    _allMainDetailDoms = querys(".main-detail-page");
    _allExtraDoms = querys(".extra-page");
    _allExtraFormDoms = querys(".extra-form-page");
    _allExtraContentDoms = querys(".extra-content-page");
    _activityInfoDom = query(".Activity-information-field");
    _allSecondary = ["activityInfo"];
    _secondaryInfo = {
      "Activity": ["activityInfo"]
    };
    _allMainHomeId = ["Menu-page", "Already-page", "Individual-page"];
    _allMainDetailId = ["Book-page", "Activity-page"];
    _allExtraFormId = ["login-page", "book-choose-page", "remark-for-trolley-page", "alert-page", "confirm-page"];
    _allExtraContentId = ["Recharge-page", "Choose-payment-method-page"];
    _loc = window.location;
    _hashStateFunc = {
      "Home": {
        "push": function() {
          return _staticShowTarget("brae-home-page");
        },
        "pop": function() {
          return _hideAllMain();
        }
      },
      "Menu": {
        "push": function() {
          return HomeBottom.bottomTouchEventTrigger("Menu");
        },
        "pop": HomeBottom.uncheckAllForBottomAndHideTarget,
        "title": "餐牌"
      },
      "Already": {
        "push": function() {
          return HomeBottom.bottomTouchEventTrigger("Already");
        },
        "pop": HomeBottom.uncheckAllForBottomAndHideTarget,
        "title": "已点订单"
      },
      "Individual": {
        "push": function() {
          return HomeBottom.bottomTouchEventTrigger("Individual");
        },
        "pop": HomeBottom.uncheckAllForBottomAndHideTarget,
        "title": "个人信息"
      },
      "Detail": {
        "push": function() {
          return _staticShowTarget("brae-detail-page");
        },
        "pop": function() {
          return _hideAllMain();
        }
      },
      "Book": {
        "push": function() {
          return _staticShowTarget("Book-page");
        },
        "pop": function() {
          return _hideTarget("Book-page");
        }
      },
      "bookCol": {
        "push": function() {
          return _staticShowTarget("book-order-column");
        },
        "pop": function() {
          return _hideTarget("book-order-column");
        }
      },
      "bookInfo": {
        "push": function() {
          return _dynamicShowTarget("book-info-wrap", "hide-right");
        },
        "pop": function() {
          return _hideTarget("book-info-wrap", "hide-right");
        }
      },
      "Activity": {
        "push": function() {
          return _staticShowTarget("Activity-page");
        },
        "pop": function() {
          return _hideTarget("Activity-page");
        }
      },
      "activityInfo": {
        "push": function() {
          return _switchSecondaryPage("activityInfo", "Activity", _activityInfoDom);
        },
        "pop": function() {
          return _hideSecondaryPage(_activityInfoDom);
        }
      },
      "Extra": {
        "push": function() {
          return _staticShowTarget("extra");
        },
        "pop": function() {
          return _hideTarget("extra");
        }
      },
      "extraContent": {
        "push": function() {
          return _staticShowTarget("brae-payment-page");
        },
        "pop": function() {
          return _hideTarget("brae-payment-page");
        }
      },
      "Recharge": {
        "push": function() {
          return _staticShowTarget("Recharge-page");
        },
        "pop": function() {
          return _hideTarget("Recharge-page");
        }
      },
      "choosePaymentMethod": {
        "push": function() {
          return _staticShowTarget("Choose-payment-method-page");
        },
        "pop": function() {
          return _hideTarget("Choose-payment-method-page");
        }
      },
      "x": {
        "push": function() {
          return setTimeout(function() {
            return popHashStr("x");
          }, 0);
        },
        "pop": function() {
          return setTimeout(function() {
            return popHashStr("x");
          }, 0);
        }
      }
    };
    addListener(window, "popstate", function() {
      return _parseAndExecuteHash(_getHashStr());
    });
    _titleDom = util.query("title");
    _recentHash = _loc.hash.replace("#", "");
    _switchExtraPage = function(id) {
      setTimeout(function() {
        return _staticShowTarget("extra");
      }, 0);
      if (indexOf.call(_allExtraContentId, id) >= 0) {
        setTimeout(function() {
          return _staticShowTarget("brae-payment-page");
        }, 50);
        return setTimeout(function() {
          return _dynamicShowTarget(id, "hide");
        }, 100);
      } else if (indexOf.call(_allExtraFormId, id) >= 0) {
        return _staticShowTarget("brae-form-page");
      }
    };
    _hideAllExtraPage = function() {
      var dom, j, len, results;
      results = [];
      for (j = 0, len = _allExtraDoms.length; j < len; j++) {
        dom = _allExtraDoms[j];
        results.push(addClass(dom, "hide"));
      }
      return results;
    };
    _hideAllExtraFormPage = function() {
      var dom, j, len, results;
      results = [];
      for (j = 0, len = _allExtraFormDoms.length; j < len; j++) {
        dom = _allExtraFormDoms[j];
        results.push(addClass(dom, "hide"));
      }
      return results;
    };
    _hideAllExtraContentPage = function() {
      var dom, j, len, results;
      results = [];
      for (j = 0, len = _allExtraContentDoms.length; j < len; j++) {
        dom = _allExtraContentDoms[j];
        results.push(addClass(dom, "hide"));
      }
      return results;
    };
    _hideAllExtra = function(async) {
      _hideAllExtraFormPage();
      _hideAllExtraContentPage();
      _hideAllExtraPage();
      return _hideTarget("extra");
    };
    _switchFirstPage = function(id) {
      _hideAllMain();
      if (indexOf.call(_allMainHomeId, id) >= 0) {
        _staticShowTarget("brae-home-page");
      } else if (indexOf.call(_allMainDetailId, id) >= 0) {
        _staticShowTarget("brae-detail-page");
      }
      _staticShowTarget(id);
      return setTimeout("scrollTo(0, 0)", 0);
    };
    _switchSecondaryPage = function(currentState, previousState, pageDom) {
      if (indexOf.call(_secondaryInfo[previousState], currentState) >= 0) {
        return removeClass(pageDom, "hide-right");
      }
    };
    _hideSecondaryPage = function(pageDom) {
      return addClass(pageDom, "hide-right");
    };
    _hideAllMainPage = function() {
      var dom, j, len, results;
      results = [];
      for (j = 0, len = _allMainDoms.length; j < len; j++) {
        dom = _allMainDoms[j];
        results.push(addClass(dom, "hide"));
      }
      return results;
    };
    _hideAllMainHomePage = function() {
      var dom, j, len, results;
      results = [];
      for (j = 0, len = _allMainHomeDoms.length; j < len; j++) {
        dom = _allMainHomeDoms[j];
        results.push(addClass(dom, "hide"));
      }
      return results;
    };
    _hideAllMainDetailPage = function() {
      var dom, j, len, results;
      results = [];
      for (j = 0, len = _allMainDetailDoms.length; j < len; j++) {
        dom = _allMainDetailDoms[j];
        results.push(addClass(dom, "hide"));
      }
      return results;
    };
    _hideAllMain = function() {
      _hideAllMainHomePage();
      _hideAllMainDetailPage();
      return _hideAllMainPage();
    };
    _staticShowTarget = function(id) {
      removeClass(getById(id), "hide");
      return setTimeout("scrollTo(0, 0)", 0);
    };
    _dynamicShowTarget = function(id, className) {
      removeClass(getById(id), className);
      return setTimeout("scrollTo(0, 0)", 0);
    };
    _hideTarget = function(id, className) {
      var _target;
      _target = getById(id);
      if (className) {
        addClass(_target, className);
      } else {
        addClass(_target, "hide");
      }
      return setTimeout("scrollTo(0, 0)", 0);
    };
    _getHashStr = function() {
      return _loc.hash.replace("#", "");
    };
    _modifyTitle = function(str) {
      return _titleDom.innerHTML = str;
    };
    _parseAndExecuteHash = function(str) {
      var base, base1, base2, entry, hash_arr, i, j, k, l, last_state, len, len1, len2, m, n, old_arr, ref1, ref2, ref3, ref4, temp_counter;
      hash_arr = str.split("-");
      if (hash_arr.length <= 1 && hash_arr[0] === "") {
        return;
      }
      old_arr = _recentHash.split("-");
      hash_arr.splice(0, 1);
      old_arr.splice(0, 1);
      last_state = hash_arr[hash_arr.length - 1];
      if (str === _recentHash) {
        for (i = j = 0, len = hash_arr.length; j < len; i = ++j) {
          entry = hash_arr[i];
          if (entry && _hashStateFunc[entry]) {
            setTimeout(function() {
              var base;
              return typeof (base = _hashStateFunc[entry])["push"] === "function" ? base["push"]() : void 0;
            }, i * 100);
          }
        }
        return;
      }
      temp_counter = {};
      for (k = 0, len1 = old_arr.length; k < len1; k++) {
        entry = old_arr[k];
        if (entry) {
          temp_counter[entry] = 1;
        }
      }
      for (l = 0, len2 = hash_arr.length; l < len2; l++) {
        entry = hash_arr[l];
        if (!entry) {
          continue;
        }
        if (temp_counter[entry]) {
          temp_counter[entry]++;
        } else {
          temp_counter[entry] = 1;
        }
      }
      for (i = m = ref1 = old_arr.length - 1; ref1 <= 0 ? m <= 0 : m >= 0; i = ref1 <= 0 ? ++m : --m) {
        if (old_arr[i] && _hashStateFunc[old_arr[i]] && temp_counter[old_arr[i]] === 1) {
          if (typeof (base = _hashStateFunc[old_arr[i]])["pop"] === "function") {
            base["pop"]();
          }
        }
      }
      for (i = n = 0, ref2 = hash_arr.length - 1; 0 <= ref2 ? n <= ref2 : n >= ref2; i = 0 <= ref2 ? ++n : --n) {
        if (hash_arr[i] && _hashStateFunc[hash_arr[i]] && temp_counter[hash_arr[i]] === 1) {
          if (ref3 = hash_arr[i], indexOf.call(_allSecondary, ref3) >= 0) {
            if (ref4 = hash_arr[i], indexOf.call(_secondaryInfo[hash_arr[i - 1]], ref4) >= 0) {
              if (typeof (base1 = _hashStateFunc[hash_arr[i]])["push"] === "function") {
                base1["push"]();
              }
            }
            continue;
          }
          if (typeof (base2 = _hashStateFunc[hash_arr[i]])["push"] === "function") {
            base2["push"]();
          }
        }
      }
      return _recentHash = str;
    };
    pushHashStr = function(str) {
      return _loc.hash = _recentHash + "-" + str;
    };
    popHashStr = function(str) {
      return _loc.hash = _recentHash.replace("-" + str, "");
    };
    hashJump = function(str) {
      return _loc.hash = str;
    };
    return {
      ahead: function() {
        return history.go(1);
      },
      back: function() {
        return history.go(-1);
      },
      refresh: function() {
        return _loc.reload();
      },
      pushHashStr: pushHashStr,
      popHashStr: popHashStr,
      hashJump: hashJump,
      HomeBottom: HomeBottom,
      _switchExtraPage: _switchExtraPage
    };
  })();
  LocStor = (function() {
    var doc, store;
    store = window.localStorage;
    doc = document.documentElement;
    if (!store) {
      doc.type.behavior = 'url(#default#userData)';
    }
    return {
      set: function(key, val, context) {
        if (store) {
          return store.setItem(key, val, context);
        } else {
          doc.setAttribute(key, value);
          return doc.save(context || 'default');
        }
      },
      get: function(key, context) {
        if (store) {
          return store.getItem(key, context);
        } else {
          doc.load(context || 'default');
          return doc.getAttribute(key) || '';
        }
      },
      rm: function(key, context) {
        if (store) {
          return store.removeItem(key, context);
        } else {
          context = context || 'default';
          doc.load(context);
          doc.removeAttribute(key);
          return doc.save(context);
        }
      },
      clear: function() {
        if (store) {
          return store.clear();
        } else {
          return doc.expires = -1;
        }
      }
    };
  })();
  callpay = function(options) {
    var self, wxConfigFailed;
    self = this;
    if (typeof wx !== "undefined") {
      wxConfigFailed = false;
      wx.config({
        debug: false,
        appId: "" + options.appid,
        timestamp: options.timestamp,
        nonceStr: "" + options.noncestr,
        signature: "" + options.signature,
        jsApiList: ['chooseWXPay']
      });
      wx.ready(function() {
        if (wxConfigFailed) {
          return;
        }
        return wx.chooseWXPay({
          timestamp: options.timestamp,
          nonceStr: "" + options.noncestr,
          "package": "" + options["package"],
          signType: 'MD5',
          paySign: "" + options.signMD,
          success: function(res) {
            if (typeof options.always === "function") {
              options.always();
            }
            if (res.errMsg === "chooseWXPay:ok") {
              innerCallback("success");
              return typeof options.callback === "function" ? options.callback() : void 0;
            } else {
              return innerCallback("fail", error("wx_result_fail", res.errMsg));
            }
          },
          cancel: function(res) {
            if (typeof options.always === "function") {
              options.always();
            }
            return innerCallback("cancel");
          },
          fail: function(res) {
            if (typeof options.always === "function") {
              options.always();
            }
            return innerCallback("fail", error("wx_config_fail", res.errMsg));
          }
        });
      });
      return wx.error(function(res) {
        if (typeof options.always === "function") {
          options.always();
        }
        wxConfigFailed = true;
        return innerCallback("fail", error("wx_config_error", res.errMsg));
      });
    }
  };
  innerCallback = function(result, err) {
    if (typeof this._resultCallback === "function") {
      if (typeof err === "undefined") {
        err = this._error();
      }
      return this._resultCallback(result, err);
    }
  };
  return window.onload = function() {
    initDishJSON();
    hashRoute.hashJump("-Home");
    setTimeout(function() {
      hashRoute.pushHashStr("Menu");
      return setTimeout(function() {
        return hashRoute.pushHashStr("x");

        /*
        				setTimeout(->
        					hashRoute.hashJump("-Detail-Book-bookCol")
        					setTimeout(->
        						hashRoute.pushHashStr("bookInfo")
        					, 100)
        				, 100)
         */
      }, 100);
    }, 100);
    new rotateDisplay({
      displayCSSSelector: "#Menu-page .activity-display-list",
      chooseCSSSelector: "#Menu-page .choose-dot-list",
      scale: 110 / 377,
      delay: 3000
    });
    return new rotateDisplay({
      displayCSSSelector: "#Activity-page .header-display-list",
      chooseCSSSelector: "#Activity-page .choose-dot-list",
      scale: 200 / 375,
      delay: 3000
    });
  };
})(window, document);
