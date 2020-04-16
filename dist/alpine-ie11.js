(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  (function() {

    var select = HTMLSelectElement.prototype;
    if (select.hasOwnProperty("selectedOptions")) return

    Object.defineProperty(select, "selectedOptions", {
      get: function() {
        return this.querySelectorAll(":checked")
      },
      enumerable: true,
      configurable: true,
    });
  })();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  (function(){function k(){function p(a){return a?"object"===typeof a||"function"===typeof a:!1}var l=null;var n=function(a,c){function g(){}if(!p(a)||!p(c))throw new TypeError("Cannot create proxy with a non-object as target or handler");l=function(){a=null;g=function(b){throw new TypeError("Cannot perform '"+b+"' on a proxy that has been revoked");};};setTimeout(function(){l=null;},0);var f=c;c={get:null,set:null,apply:null,construct:null};for(var h in f){if(!(h in c))throw new TypeError("Proxy polyfill does not support trap '"+
  h+"'");c[h]=f[h];}"function"===typeof f&&(c.apply=f.apply.bind(f));var d=this,q=!1,r=!1;"function"===typeof a?(d=function(){var b=this&&this.constructor===d,e=Array.prototype.slice.call(arguments);g(b?"construct":"apply");return b&&c.construct?c.construct.call(this,a,e):!b&&c.apply?c.apply(a,this,e):b?(e.unshift(a),new (a.bind.apply(a,e))):a.apply(this,e)},q=!0):a instanceof Array&&(d=[],r=!0);var t=c.get?function(b){g("get");return c.get(this,b,d)}:function(b){g("get");return this[b]},w=c.set?function(b,
  e){g("set");c.set(this,b,e,d);}:function(b,e){g("set");this[b]=e;},u={};Object.getOwnPropertyNames(a).forEach(function(b){if(!((q||r)&&b in d)){var e={enumerable:!!Object.getOwnPropertyDescriptor(a,b).enumerable,get:t.bind(a,b),set:w.bind(a,b)};Object.defineProperty(d,b,e);u[b]=!0;}});f=!0;Object.setPrototypeOf?Object.setPrototypeOf(d,Object.getPrototypeOf(a)):d.__proto__?d.__proto__=a.__proto__:f=!1;if(c.get||!f)for(var m in a)u[m]||Object.defineProperty(d,m,{get:t.bind(a,m)});Object.seal(a);Object.seal(d);
  return d};n.revocable=function(a,c){return {proxy:new n(a,c),revoke:l}};return n}var v="undefined"!==typeof process&&"[object process]"==={}.toString.call(process)||"undefined"!==typeof navigator&&"ReactNative"===navigator.product?commonjsGlobal:self;v.Proxy||(v.Proxy=k(),v.Proxy.revocable=v.Proxy.revocable);})();

  !function(e){var t=e.Element.prototype;"function"!=typeof t.matches&&(t.matches=t.msMatchesSelector||t.mozMatchesSelector||t.webkitMatchesSelector||function(e){for(var t=(this.document||this.ownerDocument).querySelectorAll(e),o=0;t[o]&&t[o]!==this;)++o;return Boolean(t[o])}),"function"!=typeof t.closest&&(t.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode;}return null});}(window);

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          this.parentNode && this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype].filter(Boolean));

  /*
   * classList.js: Cross-browser full element.classList implementation.
   * 1.1.20170427
   *
   * By Eli Grey, http://eligrey.com
   * License: Dedicated to the public domain.
   *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
   */

  /*global self, document, DOMException */

  /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

  if ("document" in window.self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_")) 
  	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

  (function (view) {

  if (!('Element' in view)) return;

  var
  	  classListProp = "classList"
  	, protoProp = "prototype"
  	, elemCtrProto = view.Element[protoProp]
  	, objCtr = Object
  	, strTrim = String[protoProp].trim || function () {
  		return this.replace(/^\s+|\s+$/g, "");
  	}
  	, arrIndexOf = Array[protoProp].indexOf || function (item) {
  		var
  			  i = 0
  			, len = this.length
  		;
  		for (; i < len; i++) {
  			if (i in this && this[i] === item) {
  				return i;
  			}
  		}
  		return -1;
  	}
  	// Vendors: please allow content code to instantiate DOMExceptions
  	, DOMEx = function (type, message) {
  		this.name = type;
  		this.code = DOMException[type];
  		this.message = message;
  	}
  	, checkTokenAndGetIndex = function (classList, token) {
  		if (token === "") {
  			throw new DOMEx(
  				  "SYNTAX_ERR"
  				, "An invalid or illegal string was specified"
  			);
  		}
  		if (/\s/.test(token)) {
  			throw new DOMEx(
  				  "INVALID_CHARACTER_ERR"
  				, "String contains an invalid character"
  			);
  		}
  		return arrIndexOf.call(classList, token);
  	}
  	, ClassList = function (elem) {
  		var
  			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
  			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
  			, i = 0
  			, len = classes.length
  		;
  		for (; i < len; i++) {
  			this.push(classes[i]);
  		}
  		this._updateClassName = function () {
  			elem.setAttribute("class", this.toString());
  		};
  	}
  	, classListProto = ClassList[protoProp] = []
  	, classListGetter = function () {
  		return new ClassList(this);
  	}
  ;
  // Most DOMException implementations don't allow calling DOMException's toString()
  // on non-DOMExceptions. Error's toString() is sufficient here.
  DOMEx[protoProp] = Error[protoProp];
  classListProto.item = function (i) {
  	return this[i] || null;
  };
  classListProto.contains = function (token) {
  	token += "";
  	return checkTokenAndGetIndex(this, token) !== -1;
  };
  classListProto.add = function () {
  	var
  		  tokens = arguments
  		, i = 0
  		, l = tokens.length
  		, token
  		, updated = false
  	;
  	do {
  		token = tokens[i] + "";
  		if (checkTokenAndGetIndex(this, token) === -1) {
  			this.push(token);
  			updated = true;
  		}
  	}
  	while (++i < l);

  	if (updated) {
  		this._updateClassName();
  	}
  };
  classListProto.remove = function () {
  	var
  		  tokens = arguments
  		, i = 0
  		, l = tokens.length
  		, token
  		, updated = false
  		, index
  	;
  	do {
  		token = tokens[i] + "";
  		index = checkTokenAndGetIndex(this, token);
  		while (index !== -1) {
  			this.splice(index, 1);
  			updated = true;
  			index = checkTokenAndGetIndex(this, token);
  		}
  	}
  	while (++i < l);

  	if (updated) {
  		this._updateClassName();
  	}
  };
  classListProto.toggle = function (token, force) {
  	token += "";

  	var
  		  result = this.contains(token)
  		, method = result ?
  			force !== true && "remove"
  		:
  			force !== false && "add"
  	;

  	if (method) {
  		this[method](token);
  	}

  	if (force === true || force === false) {
  		return force;
  	} else {
  		return !result;
  	}
  };
  classListProto.toString = function () {
  	return this.join(" ");
  };

  if (objCtr.defineProperty) {
  	var classListPropDesc = {
  		  get: classListGetter
  		, enumerable: true
  		, configurable: true
  	};
  	try {
  		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  	} catch (ex) { // IE 8 doesn't support enumerable:true
  		// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
  		// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
  		if (ex.number === undefined || ex.number === -0x7FF5EC54) {
  			classListPropDesc.enumerable = false;
  			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  		}
  	}
  } else if (objCtr[protoProp].__defineGetter__) {
  	elemCtrProto.__defineGetter__(classListProp, classListGetter);
  }

  }(window.self));

  }

  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.

  (function () {

  	var testElement = document.createElement("_");

  	testElement.classList.add("c1", "c2");

  	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
  	// classList.remove exist but support only one argument at a time.
  	if (!testElement.classList.contains("c2")) {
  		var createMethod = function(method) {
  			var original = DOMTokenList.prototype[method];

  			DOMTokenList.prototype[method] = function(token) {
  				var i, len = arguments.length;

  				for (i = 0; i < len; i++) {
  					token = arguments[i];
  					original.call(this, token);
  				}
  			};
  		};
  		createMethod('add');
  		createMethod('remove');
  	}

  	testElement.classList.toggle("c3", false);

  	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  	// support the second argument.
  	if (testElement.classList.contains("c3")) {
  		var _toggle = DOMTokenList.prototype.toggle;

  		DOMTokenList.prototype.toggle = function(token, force) {
  			if (1 in arguments && !this.contains(token) === !force) {
  				return force;
  			} else {
  				return _toggle.call(this, token);
  			}
  		};

  	}

  	testElement = null;
  }());

  }

  /**
   * @license
   * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */

  // minimal template polyfill
  (function() {

    var needsTemplate = (typeof HTMLTemplateElement === 'undefined');
    var brokenDocFragment = !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment);
    var needsDocFrag = false;

    // NOTE: Replace DocumentFragment to work around IE11 bug that
    // causes children of a document fragment modified while
    // there is a mutation observer to not have a parentNode, or
    // have a broken parentNode (!?!)
    if (/Trident/.test(navigator.userAgent)) {
      (function() {

        needsDocFrag = true;

        var origCloneNode = Node.prototype.cloneNode;
        Node.prototype.cloneNode = function cloneNode(deep) {
          var newDom = origCloneNode.call(this, deep);
          if (this instanceof DocumentFragment) {
            newDom.__proto__ = DocumentFragment.prototype;
          }
          return newDom;
        };

        // IE's DocumentFragment querySelector code doesn't work when
        // called on an element instance
        DocumentFragment.prototype.querySelectorAll = HTMLElement.prototype.querySelectorAll;
        DocumentFragment.prototype.querySelector = HTMLElement.prototype.querySelector;

        Object.defineProperties(DocumentFragment.prototype, {
          'nodeType': {
            get: function () {
              return Node.DOCUMENT_FRAGMENT_NODE;
            },
            configurable: true
          },

          'localName': {
            get: function () {
              return undefined;
            },
            configurable: true
          },

          'nodeName': {
            get: function () {
              return '#document-fragment';
            },
            configurable: true
          }
        });

        var origInsertBefore = Node.prototype.insertBefore;
        function insertBefore(newNode, refNode) {
          if (newNode instanceof DocumentFragment) {
            var child;
            while ((child = newNode.firstChild)) {
              origInsertBefore.call(this, child, refNode);
            }
          } else {
            origInsertBefore.call(this, newNode, refNode);
          }
          return newNode;
        }
        Node.prototype.insertBefore = insertBefore;

        var origAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function appendChild(child) {
          if (child instanceof DocumentFragment) {
            insertBefore.call(this, child, null);
          } else {
            origAppendChild.call(this, child);
          }
          return child;
        };

        var origRemoveChild = Node.prototype.removeChild;
        var origReplaceChild = Node.prototype.replaceChild;
        Node.prototype.replaceChild = function replaceChild(newChild, oldChild) {
          if (newChild instanceof DocumentFragment) {
            insertBefore.call(this, newChild, oldChild);
            origRemoveChild.call(this, oldChild);
          } else {
            origReplaceChild.call(this, newChild, oldChild);
          }
          return oldChild;
        };

        Document.prototype.createDocumentFragment = function createDocumentFragment() {
          var frag = this.createElement('df');
          frag.__proto__ = DocumentFragment.prototype;
          return frag;
        };

        var origImportNode = Document.prototype.importNode;
        Document.prototype.importNode = function importNode(impNode, deep) {
          deep = deep || false;
          var newNode = origImportNode.call(this, impNode, deep);
          if (impNode instanceof DocumentFragment) {
            newNode.__proto__ = DocumentFragment.prototype;
          }
          return newNode;
        };
      })();
    }

    // NOTE: we rely on this cloneNode not causing element upgrade.
    // This means this polyfill must load before the CE polyfill and
    // this would need to be re-worked if a browser supports native CE
    // but not <template>.
    var capturedCloneNode = Node.prototype.cloneNode;
    var capturedCreateElement = Document.prototype.createElement;
    var capturedImportNode = Document.prototype.importNode;
    var capturedRemoveChild = Node.prototype.removeChild;
    var capturedAppendChild = Node.prototype.appendChild;
    var capturedReplaceChild = Node.prototype.replaceChild;
    var capturedParseFromString = DOMParser.prototype.parseFromString;
    var capturedHTMLElementInnerHTML = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML') || {
      /**
       * @this {!HTMLElement}
       * @return {string}
       */
      get: function() {
        return this.innerHTML;
      },
      /**
       * @this {!HTMLElement}
       * @param {string}
       */
      set: function(text) {
        this.innerHTML = text;
      }
    };
    var capturedChildNodes = Object.getOwnPropertyDescriptor(window.Node.prototype, 'childNodes') || {
      /**
       * @this {!Node}
       * @return {!NodeList}
       */
      get: function() {
        return this.childNodes;
      }
    };

    var elementQuerySelectorAll = Element.prototype.querySelectorAll;
    var docQuerySelectorAll = Document.prototype.querySelectorAll;
    var fragQuerySelectorAll = DocumentFragment.prototype.querySelectorAll;

    var scriptSelector = 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]';

    function QSA(node, selector) {
      // IE 11 throws a SyntaxError with `scriptSelector` if the node has no children due to the `:not([type])` syntax
      if (!node.childNodes.length) {
        return [];
      }
      switch (node.nodeType) {
        case Node.DOCUMENT_NODE:
          return docQuerySelectorAll.call(node, selector);
        case Node.DOCUMENT_FRAGMENT_NODE:
          return fragQuerySelectorAll.call(node, selector);
        default:
          return elementQuerySelectorAll.call(node, selector);
      }
    }

    // returns true if nested templates cannot be cloned (they cannot be on
    // some impl's like Safari 8 and Edge)
    // OR if cloning a document fragment does not result in a document fragment
    var needsCloning = (function() {
      if (!needsTemplate) {
        var t = document.createElement('template');
        var t2 = document.createElement('template');
        t2.content.appendChild(document.createElement('div'));
        t.content.appendChild(t2);
        var clone = t.cloneNode(true);
        return (clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0
          || brokenDocFragment);
      }
    })();

    var TEMPLATE_TAG = 'template';
    var PolyfilledHTMLTemplateElement = function() {};

    if (needsTemplate) {

      var contentDoc = document.implementation.createHTMLDocument('template');
      var canDecorate = true;

      var templateStyle = document.createElement('style');
      templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

      var head = document.head;
      head.insertBefore(templateStyle, head.firstElementChild);

      /**
        Provides a minimal shim for the <template> element.
      */
      PolyfilledHTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);


      // if elements do not have `innerHTML` on instances, then
      // templates can be patched by swizzling their prototypes.
      var canProtoPatch =
        !(document.createElement('div').hasOwnProperty('innerHTML'));

      /**
        The `decorate` method moves element children to the template's `content`.
        NOTE: there is no support for dynamically adding elements to templates.
      */
      PolyfilledHTMLTemplateElement.decorate = function(template) {
        // if the template is decorated or not in HTML namespace, return fast
        if (template.content ||
            template.namespaceURI !== document.documentElement.namespaceURI) {
          return;
        }
        template.content = contentDoc.createDocumentFragment();
        var child;
        while ((child = template.firstChild)) {
          capturedAppendChild.call(template.content, child);
        }
        // NOTE: prefer prototype patching for performance and
        // because on some browsers (IE11), re-defining `innerHTML`
        // can result in intermittent errors.
        if (canProtoPatch) {
          template.__proto__ = PolyfilledHTMLTemplateElement.prototype;
        } else {
          template.cloneNode = function(deep) {
            return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
          };
          // add innerHTML to template, if possible
          // Note: this throws on Safari 7
          if (canDecorate) {
            try {
              defineInnerHTML(template);
              defineOuterHTML(template);
            } catch (err) {
              canDecorate = false;
            }
          }
        }
        // bootstrap recursively
        PolyfilledHTMLTemplateElement.bootstrap(template.content);
      };

      // Taken from https://github.com/jquery/jquery/blob/73d7e6259c63ac45f42c6593da8c2796c6ce9281/src/manipulation/wrapMap.js
      var topLevelWrappingMap = {
        'option': ['select'],
        'thead': ['table'],
        'col': ['colgroup', 'table'],
        'tr': ['tbody', 'table'],
        'th': ['tr', 'tbody', 'table'],
        'td': ['tr', 'tbody', 'table']
      };

      var getTagName = function(text) {
        // Taken from https://github.com/jquery/jquery/blob/73d7e6259c63ac45f42c6593da8c2796c6ce9281/src/manipulation/var/rtagName.js
        return ( /<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(text) || ['', ''])[1].toLowerCase();
      };

      var defineInnerHTML = function defineInnerHTML(obj) {
        Object.defineProperty(obj, 'innerHTML', {
          get: function() {
            return getInnerHTML(this);
          },
          set: function(text) {
            // For IE11, wrap the text in the correct (table) context
            var wrap = topLevelWrappingMap[getTagName(text)];
            if (wrap) {
              for (var i = 0; i < wrap.length; i++) {
                text = '<' + wrap[i] + '>' + text + '</' + wrap[i] + '>';
              }
            }
            contentDoc.body.innerHTML = text;
            PolyfilledHTMLTemplateElement.bootstrap(contentDoc);
            while (this.content.firstChild) {
              capturedRemoveChild.call(this.content, this.content.firstChild);
            }
            var body = contentDoc.body;
            // If we had wrapped, get back to the original node
            if (wrap) {
              for (var j = 0; j < wrap.length; j++) {
                body = body.lastChild;
              }
            }
            while (body.firstChild) {
              capturedAppendChild.call(this.content, body.firstChild);
            }
          },
          configurable: true
        });
      };

      var defineOuterHTML = function defineOuterHTML(obj) {
        Object.defineProperty(obj, 'outerHTML', {
          get: function() {
            return '<' + TEMPLATE_TAG + '>' + this.innerHTML + '</' + TEMPLATE_TAG + '>';
          },
          set: function(innerHTML) {
            if (this.parentNode) {
              contentDoc.body.innerHTML = innerHTML;
              var docFrag = this.ownerDocument.createDocumentFragment();
              while (contentDoc.body.firstChild) {
                capturedAppendChild.call(docFrag, contentDoc.body.firstChild);
              }
              capturedReplaceChild.call(this.parentNode, docFrag, this);
            } else {
              throw new Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");
            }
          },
          configurable: true
        });
      };

      defineInnerHTML(PolyfilledHTMLTemplateElement.prototype);
      defineOuterHTML(PolyfilledHTMLTemplateElement.prototype);

      /**
        The `bootstrap` method is called automatically and "fixes" all
        <template> elements in the document referenced by the `doc` argument.
      */
      PolyfilledHTMLTemplateElement.bootstrap = function bootstrap(doc) {
        var templates = QSA(doc, TEMPLATE_TAG);
        for (var i=0, l=templates.length, t; (i<l) && (t=templates[i]); i++) {
          PolyfilledHTMLTemplateElement.decorate(t);
        }
      };

      // auto-bootstrapping for main document
      document.addEventListener('DOMContentLoaded', function() {
        PolyfilledHTMLTemplateElement.bootstrap(document);
      });

      // Patch document.createElement to ensure newly created templates have content
      Document.prototype.createElement = function createElement() {
        var el = capturedCreateElement.apply(this, arguments);
        if (el.localName === 'template') {
          PolyfilledHTMLTemplateElement.decorate(el);
        }
        return el;
      };

      DOMParser.prototype.parseFromString = function() {
        var el = capturedParseFromString.apply(this, arguments);
        PolyfilledHTMLTemplateElement.bootstrap(el);
        return el;
      };

      Object.defineProperty(HTMLElement.prototype, 'innerHTML', {
        get: function() {
          return getInnerHTML(this);
        },
        set: function(text) {
          capturedHTMLElementInnerHTML.set.call(this, text);
          PolyfilledHTMLTemplateElement.bootstrap(this);
        },
        configurable: true,
        enumerable: true
      });

      // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString
      var escapeAttrRegExp = /[&\u00A0"]/g;
      var escapeDataRegExp = /[&\u00A0<>]/g;

      var escapeReplace = function(c) {
        switch (c) {
          case '&':
            return '&amp;';
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
          case '"':
            return '&quot;';
          case '\u00A0':
            return '&nbsp;';
        }
      };

      var escapeAttr = function(s) {
        return s.replace(escapeAttrRegExp, escapeReplace);
      };

      var escapeData = function(s) {
        return s.replace(escapeDataRegExp, escapeReplace);
      };

      var makeSet = function(arr) {
        var set = {};
        for (var i = 0; i < arr.length; i++) {
          set[arr[i]] = true;
        }
        return set;
      };

      // http://www.whatwg.org/specs/web-apps/current-work/#void-elements
      var voidElements = makeSet([
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr'
      ]);

      var plaintextParents = makeSet([
        'style',
        'script',
        'xmp',
        'iframe',
        'noembed',
        'noframes',
        'plaintext',
        'noscript'
      ]);

      /**
       * @param {Node} node
       * @param {Node} parentNode
       * @param {Function=} callback
       */
      var getOuterHTML = function(node, parentNode, callback) {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE: {
            var tagName = node.localName;
            var s = '<' + tagName;
            var attrs = node.attributes;
            for (var i = 0, attr; (attr = attrs[i]); i++) {
              s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
            }
            s += '>';
            if (voidElements[tagName]) {
              return s;
            }
            return s + getInnerHTML(node, callback) + '</' + tagName + '>';
          }
          case Node.TEXT_NODE: {
            var data = /** @type {Text} */ (node).data;
            if (parentNode && plaintextParents[parentNode.localName]) {
              return data;
            }
            return escapeData(data);
          }
          case Node.COMMENT_NODE: {
            return '<!--' + /** @type {Comment} */ (node).data + '-->';
          }
          default: {
            window.console.error(node);
            throw new Error('not implemented');
          }
        }
      };

      /**
       * @param {Node} node
       * @param {Function=} callback
       */
      var getInnerHTML = function(node, callback) {
        if (node.localName === 'template') {
          node =  /** @type {HTMLTemplateElement} */ (node).content;
        }
        var s = '';
        var c$ = callback ? callback(node) : capturedChildNodes.get.call(node);
        for (var i=0, l=c$.length, child; (i<l) && (child=c$[i]); i++) {
          s += getOuterHTML(child, node, callback);
        }
        return s;
      };

    }

    // make cloning/importing work!
    if (needsTemplate || needsCloning) {

      PolyfilledHTMLTemplateElement._cloneNode = function _cloneNode(template, deep) {
        var clone = capturedCloneNode.call(template, false);
        // NOTE: decorate doesn't auto-fix children because they are already
        // decorated so they need special clone fixup.
        if (this.decorate) {
          this.decorate(clone);
        }
        if (deep) {
          // NOTE: use native clone node to make sure CE's wrapped
          // cloneNode does not cause elements to upgrade.
          capturedAppendChild.call(clone.content, capturedCloneNode.call(template.content, true));
          // now ensure nested templates are cloned correctly.
          fixClonedDom(clone.content, template.content);
        }
        return clone;
      };

      // Given a source and cloned subtree, find <template>'s in the cloned
      // subtree and replace them with cloned <template>'s from source.
      // We must do this because only the source templates have proper .content.
      var fixClonedDom = function fixClonedDom(clone, source) {
        // do nothing if cloned node is not an element
        if (!source.querySelectorAll) return;
        // these two lists should be coincident
        var s$ = QSA(source, TEMPLATE_TAG);
        if (s$.length === 0) {
          return;
        }
        var t$ = QSA(clone, TEMPLATE_TAG);
        for (var i=0, l=t$.length, t, s; i<l; i++) {
          s = s$[i];
          t = t$[i];
          if (PolyfilledHTMLTemplateElement && PolyfilledHTMLTemplateElement.decorate) {
            PolyfilledHTMLTemplateElement.decorate(s);
          }
          capturedReplaceChild.call(t.parentNode, cloneNode.call(s, true), t);
        }
      };

      // make sure scripts inside of a cloned template are executable
      var fixClonedScripts = function fixClonedScripts(fragment) {
        var scripts = QSA(fragment, scriptSelector);
        for (var ns, s, i = 0; i < scripts.length; i++) {
          s = scripts[i];
          ns = capturedCreateElement.call(document, 'script');
          ns.textContent = s.textContent;
          var attrs = s.attributes;
          for (var ai = 0, a; ai < attrs.length; ai++) {
            a = attrs[ai];
            ns.setAttribute(a.name, a.value);
          }
          capturedReplaceChild.call(s.parentNode, ns, s);
        }
      };

      // override all cloning to fix the cloned subtree to contain properly
      // cloned templates.
      var cloneNode = Node.prototype.cloneNode = function cloneNode(deep) {
        var dom;
        // workaround for Edge bug cloning documentFragments
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8619646/
        if (!needsDocFrag && brokenDocFragment && this instanceof DocumentFragment) {
          if (!deep) {
            return this.ownerDocument.createDocumentFragment();
          } else {
            dom = importNode.call(this.ownerDocument, this, true);
          }
        } else if (this.nodeType === Node.ELEMENT_NODE &&
                   this.localName === TEMPLATE_TAG &&
                   this.namespaceURI == document.documentElement.namespaceURI) {
          dom = PolyfilledHTMLTemplateElement._cloneNode(this, deep);
        } else {
          dom = capturedCloneNode.call(this, deep);
        }
        // template.content is cloned iff `deep`.
        if (deep) {
          fixClonedDom(dom, this);
        }
        return dom;
      };

      // NOTE: we are cloning instead of importing <template>'s.
      // However, the ownerDocument of the cloned template will be correct!
      // This is because the native import node creates the right document owned
      // subtree and `fixClonedDom` inserts cloned templates into this subtree,
      // thus updating the owner doc.
      var importNode = Document.prototype.importNode = function importNode(element, deep) {
        deep = deep || false;
        if (element.localName === TEMPLATE_TAG) {
          return PolyfilledHTMLTemplateElement._cloneNode(element, deep);
        } else {
          var dom = capturedImportNode.call(this, element, deep);
          if (deep) {
            fixClonedDom(dom, element);
            fixClonedScripts(dom);
          }
          return dom;
        }
      };
    }

    if (needsTemplate) {
      window.HTMLTemplateElement = PolyfilledHTMLTemplateElement;
    }

  })();

  // Polyfill for creating CustomEvents on IE9/10/11

  // code pulled from:
  // https://github.com/d4tocchini/customevent-polyfill
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

  (function() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      var ce = new window.CustomEvent('test', { cancelable: true });
      ce.preventDefault();
      if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
      }
    } catch (e) {
      var CustomEvent = function(event, params) {
        var evt, origPrevent;
        params = params || {};
        params.bubbles = !!params.bubbles;
        params.cancelable = !!params.cancelable;

        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail
        );
        origPrevent = evt.preventDefault;
        evt.preventDefault = function() {
          origPrevent.call(this);
          try {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          } catch (e) {
            this.defaultPrevented = true;
          }
        };
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent; // expose definition to window
    }
  })();

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
    // eslint-disable-next-line no-undef
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$1
  };

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  var nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$2
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    } return value;
  };

  var SHARED = '__core-js_shared__';
  var store = global_1[SHARED] || setGlobal(SHARED, {});

  var sharedStore = store;

  var functionToString = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$1 = global_1.WeakMap;

  var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

  var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.6.4',
    mode:  'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var keys = shared('keys');

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$2 = global_1.WeakMap;
  var set, get, has$1;

  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store$1 = new WeakMap$2();
    var wmget = store$1.get;
    var wmhas = store$1.has;
    var wmset = store$1.set;
    set = function (it, metadata) {
      wmset.call(store$1, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store$1, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store$1, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(String).split('String');

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global_1) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
  });
  });

  var path = global_1;

  var aFunction = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
      : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
  };

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var indexOf = arrayIncludes.indexOf;


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$4
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  var aFunction$1 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
  };

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var useSymbolAsUid = nativeSymbol
    // eslint-disable-next-line no-undef
    && !Symbol.sham
    // eslint-disable-next-line no-undef
    && typeof Symbol.iterator == 'symbol';

  var WellKnownSymbolsStore = shared('wks');
  var Symbol$1 = global_1.Symbol;
  var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

  var wellKnownSymbol = function (name) {
    if (!has(WellKnownSymbolsStore, name)) {
      if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
      else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    } return WellKnownSymbolsStore[name];
  };

  var SPECIES = wellKnownSymbol('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var push = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  var createMethod$1 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = functionBindContext(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: push.call(target, value); // filter
          } else if (IS_EVERY) return false;  // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6)
  };

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var process$1 = global_1.process;
  var versions = process$1 && process$1.versions;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  var SPECIES$1 = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$1] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var defineProperty = Object.defineProperty;
  var cache = {};

  var thrower = function (it) { throw it; };

  var arrayMethodUsesToLength = function (METHOD_NAME, options) {
    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
    if (!options) options = {};
    var method = [][METHOD_NAME];
    var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
    var argument0 = has(options, 0) ? options[0] : thrower;
    var argument1 = has(options, 1) ? options[1] : undefined;

    return cache[METHOD_NAME] = !!method && !fails(function () {
      if (ACCESSORS && !descriptors) return true;
      var O = { length: -1 };

      if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
      else O[1] = 1;

      method.call(O, argument0, argument1);
    });
  };

  var $filter = arrayIteration.filter;



  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
  // Edge 14- issue
  var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var $forEach = arrayIteration.forEach;



  var STRICT_METHOD = arrayMethodIsStrict('forEach');
  var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
    forEach: arrayForEach
  });

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterators = {};

  var ITERATOR = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = toStringTagSupport ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$1 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$1]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // `Array.from` method implementation
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();
      for (;!(step = next.call(iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$2] = function () {
      return this;
    };
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$2] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
    from: arrayFrom
  });

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$2 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this));
      var position = toInteger(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$2(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$2(true)
  };

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO = sharedKey('IE_PROTO');
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype : null;
  };

  var ITERATOR$3 = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if ( !has(IteratorPrototype, ITERATOR$3)) {
    createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO$1 = sharedKey('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      /* global ActiveXObject */
      activeXDocument = document.domain && new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  var defineProperty$1 = objectDefineProperty.f;



  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
      defineProperty$1(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
    }
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var aPossiblePrototype = function (it) {
    if (!isObject(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$4 = wellKnownSymbol('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$4]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
            createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
      createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var charAt = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global_1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
      createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
    } catch (error) {
      CollectionPrototype.forEach = arrayForEach;
    }
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$1(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  var $includes = arrayIncludes.includes;



  var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  _export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$2 }, {
    includes: function includes(el /* , fromIndex = 0 */) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('includes');

  var $map = arrayIteration.map;



  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');
  // FF49- issue
  var USES_TO_LENGTH$3 = arrayMethodUsesToLength('map');

  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3 }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  var createMethod$3 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$1(callbackfn);
      var O = toObject(that);
      var self = indexedObject(O);
      var length = toLength(O.length);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }
        index += i;
        if (IS_RIGHT ? index < 0 : length <= index) {
          throw TypeError('Reduce of empty array with no initial value');
        }
      }
      for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
        memo = callbackfn(memo, self[index], index, O);
      }
      return memo;
    };
  };

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true)
  };

  var $reduce = arrayReduce.left;



  var STRICT_METHOD$1 = arrayMethodIsStrict('reduce');
  var USES_TO_LENGTH$4 = arrayMethodUsesToLength('reduce', { 1: 0 });

  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  _export({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$4 }, {
    reduce: function reduce(callbackfn /* , initialValue */) {
      return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `SameValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-samevalue
  var sameValue = Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };

  // `Object.is` method
  // https://tc39.github.io/ecma262/#sec-object.is
  _export({ target: 'Object', stat: true }, {
    is: sameValue
  });

  var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
    keys: function keys(it) {
      return objectKeys(toObject(it));
    }
  });

  // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  var objectToString = toStringTagSupport ? {}.toString : function toString() {
    return '[object ' + classof(this) + ']';
  };

  // `Object.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  if (!toStringTagSupport) {
    redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
  }

  var nativePromiseConstructor = global_1.Promise;

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var SPECIES$2 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$2]) {
      defineProperty(Constructor, SPECIES$2, {
        configurable: true,
        get: function () { return this; }
      });
    }
  };

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var iterate_1 = createCommonjsModule(function (module) {
  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
    var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
    var iterator, iterFn, index, length, result, next, step;

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength(iterable.length); length > index; index++) {
          result = AS_ENTRIES
            ? boundFunction(anObject(step = iterable[index])[0], step[1])
            : boundFunction(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = iterFn.call(iterable);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
      if (typeof result == 'object' && result && result instanceof Result) return result;
    } return new Result(false);
  };

  iterate.stop = function (result) {
    return new Result(true, result);
  };
  });

  var SPECIES$3 = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
  };

  var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  var location = global_1.location;
  var set$1 = global_1.setImmediate;
  var clear = global_1.clearImmediate;
  var process$2 = global_1.process;
  var MessageChannel = global_1.MessageChannel;
  var Dispatch = global_1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function (id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run(id);
    };
  };

  var listener = function (event) {
    run(event.data);
  };

  var post = function (id) {
    // old engines have not location.origin
    global_1.postMessage(id + '', location.protocol + '//' + location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$1 || !clear) {
    set$1 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (classofRaw(process$2) == 'process') {
      defer = function (id) {
        process$2.nextTick(runner(id));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !engineIsIos) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = functionBindContext(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
      defer = post;
      global_1.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task = {
    set: set$1,
    clear: clear
  };

  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

  var macrotask = task.set;


  var MutationObserver$1 = global_1.MutationObserver || global_1.WebKitMutationObserver;
  var process$3 = global_1.process;
  var Promise$1 = global_1.Promise;
  var IS_NODE = classofRaw(process$3) == 'process';
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (IS_NODE && (parent = process$3.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (IS_NODE) {
      notify = function () {
        process$3.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    } else if (MutationObserver$1 && !engineIsIos) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver$1(flush).observe(node, { characterData: true });
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      then = promise.then;
      notify = function () {
        then.call(promise, flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global_1, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };

  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction$1(resolve);
    this.reject = aFunction$1(reject);
  };

  // 25.4.1.5 NewPromiseCapability(C)
  var f$5 = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
  	f: f$5
  };

  var promiseResolve = function (C, x) {
    anObject(C);
    if (isObject(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function (a, b) {
    var console = global_1.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var task$1 = task.set;










  var SPECIES$4 = wellKnownSymbol('species');
  var PROMISE = 'Promise';
  var getInternalState$1 = internalState.get;
  var setInternalState$1 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var PromiseConstructor = nativePromiseConstructor;
  var TypeError$1 = global_1.TypeError;
  var document$2 = global_1.document;
  var process$4 = global_1.process;
  var $fetch = getBuiltIn('fetch');
  var newPromiseCapability$1 = newPromiseCapability.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var IS_NODE$1 = classofRaw(process$4) == 'process';
  var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  var FORCED = isForced_1(PROMISE, function () {
    var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
    if (!GLOBAL_CORE_JS_PROMISE) {
      // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // We can't detect it synchronously, so just check versions
      if (engineV8Version === 66) return true;
      // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
    }
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
    // Detect correctness of subclassing with @@species support
    var promise = PromiseConstructor.resolve(1);
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES$4] = FakePromise;
    return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
  });

  var INCORRECT_ITERATION$1 = FORCED || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify$1 = function (promise, state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var index = 0;
      // variable length - can't use forEach
      while (chain.length > index) {
        var reaction = chain[index++];
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // can throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      }
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(promise, state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$2.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global_1.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (handler = global_1['on' + name]) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (promise, state) {
    task$1.call(global_1, function () {
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE$1) {
            process$4.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (promise, state) {
    task$1.call(global_1, function () {
      if (IS_NODE$1) {
        process$4.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function (fn, promise, state, unwrap) {
    return function (value) {
      fn(promise, state, value, unwrap);
    };
  };

  var internalReject = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(promise, state, true);
  };

  var internalResolve = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            then.call(value,
              bind(internalResolve, promise, wrapper, state),
              bind(internalReject, promise, wrapper, state)
            );
          } catch (error) {
            internalReject(promise, wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(promise, state, false);
      }
    } catch (error) {
      internalReject(promise, { done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction$1(executor);
      Internal.call(this);
      var state = getInternalState$1(this);
      try {
        executor(bind(internalResolve, this, state), bind(internalReject, this, state));
      } catch (error) {
        internalReject(this, state, error);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      setInternalState$1(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = IS_NODE$1 ? process$4.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(this, state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState$1(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, promise, state);
      this.reject = bind(internalReject, promise, state);
    };
    newPromiseCapability.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    if ( typeof nativePromiseConstructor == 'function') {
      nativeThen = nativePromiseConstructor.prototype.then;

      // wrap native Promise#then for native async functions
      redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // wrap fetch result
      if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
        // eslint-disable-next-line no-unused-vars
        fetch: function fetch(input /* , init */) {
          return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
        }
      });
    }
  }

  _export({ global: true, wrap: true, forced: FORCED }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  PromiseWrapper = getBuiltIn(PROMISE);

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED }, {
    // `Promise.reject` method
    // https://tc39.github.io/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });

  _export({ target: PROMISE, stat: true, forced:  FORCED }, {
    // `Promise.resolve` method
    // https://tc39.github.io/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve( this, x);
    }
  });

  _export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
    // `Promise.all` method
    // https://tc39.github.io/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          $promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.github.io/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1(C.resolve);
        iterate_1(iterable, function (promise) {
          $promiseResolve.call(C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.
  function RE(s, f) {
    return RegExp(s, f);
  }

  var UNSUPPORTED_Y = fails(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });

  var BROKEN_CARET = fails(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });

  var regexpStickyHelpers = {
  	UNSUPPORTED_Y: UNSUPPORTED_Y,
  	BROKEN_CARET: BROKEN_CARET
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;
      var sticky = UNSUPPORTED_Y$1 && re.sticky;
      var flags = regexpFlags.call(re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = flags.replace('y', '');
        if (flags.indexOf('g') === -1) {
          flags += 'g';
        }

        strCopy = String(str).slice(re.lastIndex);
        // Support anchored sticky behavior.
        if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
          source = '(?: ' + source + ')';
          strCopy = ' ' + strCopy;
          charsAdded++;
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp('^(?:' + source + ')', flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  _export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
    exec: regexpExec
  });

  var MATCH = wellKnownSymbol('match');

  // `IsRegExp` abstract operation
  // https://tc39.github.io/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
  };

  var notARegexp = function (it) {
    if (isRegexp(it)) {
      throw TypeError("The method doesn't accept regular expressions");
    } return it;
  };

  var MATCH$1 = wellKnownSymbol('match');

  var correctIsRegexpLogic = function (METHOD_NAME) {
    var regexp = /./;
    try {
      '/./'[METHOD_NAME](regexp);
    } catch (e) {
      try {
        regexp[MATCH$1] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (f) { /* empty */ }
    } return false;
  };

  // `String.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.includes
  _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
    includes: function includes(searchString /* , position = 0 */) {
      return !!~String(requireObjectCoercible(this))
        .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // TODO: Remove from `core-js@4` since it's moved to entry points







  var SPECIES$5 = wellKnownSymbol('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  var REPLACE_KEEPS_$0 = (function () {
    return 'a'.replace(/./, '$0') === '$0';
  })();

  var REPLACE = wellKnownSymbol('replace');
  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  })();

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol(KEY);

    var DELEGATES_TO_SYMBOL = !fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;

      if (KEY === 'split') {
        // We can't use real regex here since it causes deoptimization
        // and serious performance degradation in V8
        // https://github.com/zloirock/core-js/issues/306
        re = {};
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$5] = function () { return re; };
        re.flags = '';
        re[SYMBOL] = /./[SYMBOL];
      }

      re.exec = function () { execCalled = true; return null; };

      re[SYMBOL]('');
      return !execCalled;
    });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !(
        REPLACE_SUPPORTS_NAMED_GROUPS &&
        REPLACE_KEEPS_$0 &&
        !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      )) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }, {
        REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
        REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];

      redefine(String.prototype, KEY, stringMethod);
      redefine(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return regexMethod.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return regexMethod.call(string, this); }
      );
    }

    if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
  };

  var charAt$1 = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt$1(S, index).length : 1);
  };

  // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }

    if (classofRaw(R) !== 'RegExp') {
      throw TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  // @@match logic
  fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible(this);
        var matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        if (!rx.global) return regexpExecAbstract(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regexpExecAbstract(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var arrayPush = [].push;
  var min$2 = Math.min;
  var MAX_UINT32 = 0xFFFFFFFF;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

  // @@split logic
  fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'.split(/(b)*/)[1] == 'c' ||
      'test'.split(/(?:)/, -1).length != 4 ||
      'ab'.split(/(?:ab)*/).length != 2 ||
      '.'.split(/(.?)(.?)/).length != 4 ||
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(requireObjectCoercible(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegexp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output.length > lim ? output.slice(0, lim) : output;
      };
    // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = requireObjectCoercible(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = min$2(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  }, !SUPPORTS_Y);

  var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  };

  var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export({ target: 'Array', proto: true, forced: FORCED$1 }, {
    concat: function concat(arg) { // eslint-disable-line no-unused-vars
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var $find = arrayIteration.find;



  var FIND = 'find';
  var SKIPS_HOLES = true;

  var USES_TO_LENGTH$5 = arrayMethodUsesToLength(FIND);

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  _export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$5 }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var $indexOf = arrayIncludes.indexOf;



  var nativeIndexOf = [].indexOf;

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');
  var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  _export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$6 }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? nativeIndexOf.apply(this, arguments) || 0
        : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$2 = internalState.set;
  var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$2(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$2(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var nativeJoin = [].join;

  var ES3_STRINGS = indexedObject != Object;
  var STRICT_METHOD$3 = arrayMethodIsStrict('join', ',');

  // `Array.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.join
  _export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$3 }, {
    join: function join(separator) {
      return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
    }
  });

  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');
  var USES_TO_LENGTH$7 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

  var max$1 = Math.max;
  var min$3 = Math.min;
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$7 }, {
    splice: function splice(start, deleteCount /* , ...items */) {
      var O = toObject(this);
      var len = toLength(O.length);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$3(max$1(toInteger(deleteCount), 0), len - actualStart);
      }
      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }
      A = arraySpeciesCreate(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var defineProperty$2 = objectDefineProperty.f;

  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.github.io/ecma262/#sec-function-instances-name
  if (descriptors && !(NAME in FunctionPrototype)) {
    defineProperty$2(FunctionPrototype, NAME, {
      configurable: true,
      get: function () {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      typeof (NewTarget = dummy.constructor) == 'function' &&
      NewTarget !== Wrapper &&
      isObject(NewTargetPrototype = NewTarget.prototype) &&
      NewTargetPrototype !== Wrapper.prototype
    ) objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$');

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$4 = function (TYPE) {
    return function ($this) {
      var string = String(requireObjectCoercible($this));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
    start: createMethod$4(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$4(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$4(3)
  };

  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
  var defineProperty$3 = objectDefineProperty.f;
  var trim = stringTrim.trim;

  var NUMBER = 'Number';
  var NativeNumber = global_1[NUMBER];
  var NumberPrototype = NativeNumber.prototype;

  // Opera ~12 has broken Object#toString
  var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

  // `ToNumber` abstract operation
  // https://tc39.github.io/ecma262/#sec-tonumber
  var toNumber = function (argument) {
    var it = toPrimitive(argument, false);
    var first, third, radix, maxCode, digits, length, index, code;
    if (typeof it == 'string' && it.length > 2) {
      it = trim(it);
      first = it.charCodeAt(0);
      if (first === 43 || first === 45) {
        third = it.charCodeAt(2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
          case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
          default: return +it;
        }
        digits = it.slice(2);
        length = digits.length;
        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index);
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return NaN;
        } return parseInt(digits, radix);
      }
    } return +it;
  };

  // `Number` constructor
  // https://tc39.github.io/ecma262/#sec-number-constructor
  if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var it = arguments.length < 1 ? 0 : value;
      var dummy = this;
      return dummy instanceof NumberWrapper
        // check on 1..constructor(foo) case
        && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
          ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
    };
    for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES2015 (in case, if modules with ES2015 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), j = 0, key; keys$1.length > j; j++) {
      if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
        defineProperty$3(NumberWrapper, key, getOwnPropertyDescriptor$3(NativeNumber, key));
      }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global_1, NUMBER, NumberWrapper);
  }

  var freezing = !fails(function () {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function (module) {
  var defineProperty = objectDefineProperty.f;



  var METADATA = uid('meta');
  var id = 0;

  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var setMetadata = function (it) {
    defineProperty(it, METADATA, { value: {
      objectID: 'O' + ++id, // object ID
      weakData: {}          // weak collections IDs
    } });
  };

  var fastKey = function (it, create) {
    // return a primitive with prefix
    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMetadata(it);
    // return object ID
    } return it[METADATA].objectID;
  };

  var getWeakData = function (it, create) {
    if (!has(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMetadata(it);
    // return the store of weak collections IDs
    } return it[METADATA].weakData;
  };

  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
    return it;
  };

  var meta = module.exports = {
    REQUIRED: false,
    fastKey: fastKey,
    getWeakData: getWeakData,
    onFreeze: onFreeze
  };

  hiddenKeys[METADATA] = true;
  });
  var internalMetadata_1 = internalMetadata.REQUIRED;
  var internalMetadata_2 = internalMetadata.fastKey;
  var internalMetadata_3 = internalMetadata.getWeakData;
  var internalMetadata_4 = internalMetadata.onFreeze;

  var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
    var ADDER = IS_MAP ? 'set' : 'add';
    var NativeConstructor = global_1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var exported = {};

    var fixMethod = function (KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine(NativePrototype, KEY,
        KEY == 'add' ? function add(value) {
          nativeMethod.call(this, value === 0 ? 0 : value);
          return this;
        } : KEY == 'delete' ? function (key) {
          return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'get' ? function get(key) {
          return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'has' ? function has(key) {
          return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : function set(key, value) {
          nativeMethod.call(this, key === 0 ? 0 : key, value);
          return this;
        }
      );
    };

    // eslint-disable-next-line max-len
    if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    })))) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      internalMetadata.REQUIRED = true;
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO = !IS_WEAK && fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new NativeConstructor();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
          if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export({ global: true, forced: Constructor != NativeConstructor }, exported);

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var defineProperty$4 = objectDefineProperty.f;








  var fastKey = internalMetadata.fastKey;


  var setInternalState$3 = internalState.set;
  var internalStateGetterFor = internalState.getterFor;

  var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$3(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
        // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        } return that;
      };

      var getEntry = function (that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;
            else that.size--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;
          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (descriptors) defineProperty$4(C.prototype, 'size', {
        get: function () {
          return getInternalState(this).size;
        }
      });
      return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState$3(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last;
        // revert to the last existing entry
        while (entry && entry.removed) entry = entry.previous;
        // get next entry
        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return { value: undefined, done: true };
        }
        // return step by kind
        if (kind == 'keys') return { value: entry.key, done: false };
        if (kind == 'values') return { value: entry.value, done: false };
        return { value: [entry.key, entry.value], done: false };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // `Set` constructor
  // https://tc39.github.io/ecma262/#sec-set-objects
  var es_set = collection('Set', function (init) {
    return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var max$2 = Math.max;
  var min$4 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        if (
          (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
          (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
        ) {
          var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
          if (res.done) return res.value;
        }

        var rx = anObject(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regexpExecAbstract(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max$2(min$4(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  });

  var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;






  var nativeStartsWith = ''.startsWith;
  var min$5 = Math.min;

  var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
  // https://github.com/zloirock/core-js/pull/702
  var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
    var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'startsWith');
    return descriptor && !descriptor.writable;
  }();

  // `String.prototype.startsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
  _export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
    startsWith: function startsWith(searchString /* , position = 0 */) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var index = toLength(min$5(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = String(searchString);
      return nativeStartsWith
        ? nativeStartsWith.call(that, search, index)
        : that.slice(index, index + search.length) === search;
    }
  });

  var non = '\u200B\u0085\u180E';

  // check that a method works with the correct list
  // of whitespaces and has a correct name
  var stringTrimForced = function (METHOD_NAME) {
    return fails(function () {
      return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
    });
  };

  var $trim = stringTrim.trim;


  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  _export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var getWeakData = internalMetadata.getWeakData;








  var setInternalState$4 = internalState.set;
  var internalStateGetterFor$1 = internalState.getterFor;
  var find = arrayIteration.find;
  var findIndex = arrayIteration.findIndex;
  var id$1 = 0;

  // fallback for uncaught frozen keys
  var uncaughtFrozenStore = function (store) {
    return store.frozen || (store.frozen = new UncaughtFrozenStore());
  };

  var UncaughtFrozenStore = function () {
    this.entries = [];
  };

  var findUncaughtFrozen = function (store, key) {
    return find(store.entries, function (it) {
      return it[0] === key;
    });
  };

  UncaughtFrozenStore.prototype = {
    get: function (key) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) return entry[1];
    },
    has: function (key) {
      return !!findUncaughtFrozen(this, key);
    },
    set: function (key, value) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) entry[1] = value;
      else this.entries.push([key, value]);
    },
    'delete': function (key) {
      var index = findIndex(this.entries, function (it) {
        return it[0] === key;
      });
      if (~index) this.entries.splice(index, 1);
      return !!~index;
    }
  };

  var collectionWeak = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$4(that, {
          type: CONSTRUCTOR_NAME,
          id: id$1++,
          frozen: undefined
        });
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var data = getWeakData(anObject(key), true);
        if (data === true) uncaughtFrozenStore(state).set(key, value);
        else data[state.id] = value;
        return that;
      };

      redefineAll(C.prototype, {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function (key) {
          var state = getInternalState(this);
          if (!isObject(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state)['delete'](key);
          return data && has(data, state.id) && delete data[state.id];
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function has$1(key) {
          var state = getInternalState(this);
          if (!isObject(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).has(key);
          return data && has(data, state.id);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function get(key) {
          var state = getInternalState(this);
          if (isObject(key)) {
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state).get(key);
            return data ? data[state.id] : undefined;
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key, value);
        }
      } : {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function add(value) {
          return define(this, value, true);
        }
      });

      return C;
    }
  };

  var es_weakMap = createCommonjsModule(function (module) {






  var enforceIternalState = internalState.enforce;


  var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
  var isExtensible = Object.isExtensible;
  var InternalWeakMap;

  var wrapper = function (init) {
    return function WeakMap() {
      return init(this, arguments.length ? arguments[0] : undefined);
    };
  };

  // `WeakMap` constructor
  // https://tc39.github.io/ecma262/#sec-weakmap-constructor
  var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

  // IE11 WeakMap frozen keys fix
  // We can't use feature detection because it crash some old IE builds
  // https://github.com/zloirock/core-js/issues/485
  if (nativeWeakMap && IS_IE11) {
    InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
    internalMetadata.REQUIRED = true;
    var WeakMapPrototype = $WeakMap.prototype;
    var nativeDelete = WeakMapPrototype['delete'];
    var nativeHas = WeakMapPrototype.has;
    var nativeGet = WeakMapPrototype.get;
    var nativeSet = WeakMapPrototype.set;
    redefineAll(WeakMapPrototype, {
      'delete': function (key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeDelete.call(this, key) || state.frozen['delete'](key);
        } return nativeDelete.call(this, key);
      },
      has: function has(key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) || state.frozen.has(key);
        } return nativeHas.call(this, key);
      },
      get: function get(key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
        } return nativeGet.call(this, key);
      },
      set: function set(key, value) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
        } else nativeSet.call(this, key, value);
        return this;
      }
    });
  }
  });

  var ITERATOR$5 = wellKnownSymbol('iterator');
  var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
  var ArrayValues = es_array_iterator.values;

  for (var COLLECTION_NAME$1 in domIterables) {
    var Collection$1 = global_1[COLLECTION_NAME$1];
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
    if (CollectionPrototype$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
        createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$5, ArrayValues);
      } catch (error) {
        CollectionPrototype$1[ITERATOR$5] = ArrayValues;
      }
      if (!CollectionPrototype$1[TO_STRING_TAG$3]) {
        createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
      }
      if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
          createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
        }
      }
    }
  }

  var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return nativeGetOwnPropertyNames(it);
    } catch (error) {
      return windowNames.slice();
    }
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  var f$6 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]'
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
  	f: f$6
  };

  var f$7 = wellKnownSymbol;

  var wellKnownSymbolWrapped = {
  	f: f$7
  };

  var defineProperty$5 = objectDefineProperty.f;

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!has(Symbol, NAME)) defineProperty$5(Symbol, NAME, {
      value: wellKnownSymbolWrapped.f(NAME)
    });
  };

  var $forEach$1 = arrayIteration.forEach;

  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  var setInternalState$5 = internalState.set;
  var getInternalState$3 = internalState.getterFor(SYMBOL);
  var ObjectPrototype$1 = Object[PROTOTYPE$1];
  var $Symbol = global_1.Symbol;
  var $stringify = getBuiltIn('JSON', 'stringify');
  var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  var nativeDefineProperty$1 = objectDefineProperty.f;
  var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
  var AllSymbols = shared('symbols');
  var ObjectPrototypeSymbols = shared('op-symbols');
  var StringToSymbolRegistry = shared('string-to-symbol-registry');
  var SymbolToStringRegistry = shared('symbol-to-string-registry');
  var WellKnownSymbolsStore$1 = shared('wks');
  var QObject = global_1.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = descriptors && fails(function () {
    return objectCreate(nativeDefineProperty$1({}, 'a', {
      get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
    nativeDefineProperty$1(O, P, Attributes);
    if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
      nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty$1;

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState$5(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!descriptors) symbol.description = description;
    return symbol;
  };

  var isSymbol = useSymbolAsUid ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return Object(it) instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject(O);
    var key = toPrimitive(P, true);
    anObject(Attributes);
    if (has(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
      } return setSymbolDescriptor(O, key, Attributes);
    } return nativeDefineProperty$1(O, key, Attributes);
  };

  var $defineProperties = function defineProperties(O, Properties) {
    anObject(O);
    var properties = toIndexedObject(Properties);
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
    $forEach$1(keys, function (key) {
      if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  var $create = function create(O, Properties) {
    return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive(V, true);
    var enumerable = nativePropertyIsEnumerable$1.call(this, P);
    if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject(O);
    var key = toPrimitive(P, true);
    if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
    if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
    var result = [];
    $forEach$1(names, function (key) {
      if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
    var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
    var result = [];
    $forEach$1(names, function (key) {
      if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
        result.push(AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.github.io/ecma262/#sec-symbol-constructor
  if (!nativeSymbol) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
      var tag = uid(description);
      var setter = function (value) {
        if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };
      if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
      return wrap(tag, description);
    };

    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState$3(this).tag;
    });

    redefine($Symbol, 'withoutSetter', function (description) {
      return wrap(uid(description), description);
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
    };

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState$3(this).description;
        }
      });
      {
        redefine(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
      }
    }
  }

  _export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
    Symbol: $Symbol
  });

  $forEach$1(objectKeys(WellKnownSymbolsStore$1), function (name) {
    defineWellKnownSymbol(name);
  });

  _export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
    // `Symbol.for` method
    // https://tc39.github.io/ecma262/#sec-symbol.for
    'for': function (key) {
      var string = String(key);
      if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = $Symbol(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry[symbol] = string;
      return symbol;
    },
    // `Symbol.keyFor` method
    // https://tc39.github.io/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
      if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function () { USE_SETTER = true; },
    useSimple: function () { USE_SETTER = false; }
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
    // `Object.create` method
    // https://tc39.github.io/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  _export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return objectGetOwnPropertySymbols.f(toObject(it));
    }
  });

  // `JSON.stringify` method behavior with symbols
  // https://tc39.github.io/ecma262/#sec-json.stringify
  if ($stringify) {
    var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
      var symbol = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      return $stringify([symbol]) != '[null]'
        // WebKit converts symbol values to JSON as null
        || $stringify({ a: symbol }) != '{}'
        // V8 throws on boxed symbols
        || $stringify(Object(symbol)) != '{}';
    });

    _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
      // eslint-disable-next-line no-unused-vars
      stringify: function stringify(it, replacer, space) {
        var args = [it];
        var index = 1;
        var $replacer;
        while (arguments.length > index) args.push(arguments[index++]);
        $replacer = replacer;
        if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
        if (!isArray(replacer)) replacer = function (key, value) {
          if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
          if (!isSymbol(value)) return value;
        };
        args[1] = replacer;
        return $stringify.apply(null, args);
      }
    });
  }

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
    createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
  }
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL);

  hiddenKeys[HIDDEN] = true;

  var defineProperty$6 = objectDefineProperty.f;


  var NativeSymbol = global_1.Symbol;

  if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
    // Safari 12 bug
    NativeSymbol().description !== undefined
  )) {
    var EmptyStringDescriptionStore = {};
    // wrap Symbol constructor for correct work with undefined description
    var SymbolWrapper = function Symbol() {
      var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
      var result = this instanceof SymbolWrapper
        ? new NativeSymbol(description)
        // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
        : description === undefined ? NativeSymbol() : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };
    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
    symbolPrototype.constructor = SymbolWrapper;

    var symbolToString = symbolPrototype.toString;
    var native = String(NativeSymbol('test')) == 'Symbol(test)';
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    defineProperty$6(symbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        var symbol = isObject(this) ? this.valueOf() : this;
        var string = symbolToString.call(symbol);
        if (has(EmptyStringDescriptionStore, symbol)) return '';
        var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });

    _export({ global: true, forced: true }, {
      Symbol: SymbolWrapper
    });
  }

  // `Symbol.iterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol('iterator');

  // `FlattenIntoArray` abstract operation
  // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
  var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
    var targetIndex = start;
    var sourceIndex = 0;
    var mapFn = mapper ? functionBindContext(mapper, thisArg, 3) : false;
    var element;

    while (sourceIndex < sourceLen) {
      if (sourceIndex in source) {
        element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

        if (depth > 0 && isArray(element)) {
          targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
        } else {
          if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
          target[targetIndex] = element;
        }

        targetIndex++;
      }
      sourceIndex++;
    }
    return targetIndex;
  };

  var flattenIntoArray_1 = flattenIntoArray;

  // `Array.prototype.flat` method
  // https://github.com/tc39/proposal-flatMap
  _export({ target: 'Array', proto: true }, {
    flat: function flat(/* depthArg = 1 */) {
      var depthArg = arguments.length ? arguments[0] : undefined;
      var O = toObject(this);
      var sourceLen = toLength(O.length);
      var A = arraySpeciesCreate(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
      return A;
    }
  });

  var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('slice');
  var USES_TO_LENGTH$8 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

  var SPECIES$6 = wellKnownSymbol('species');
  var nativeSlice = [].slice;
  var max$3 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$8 }, {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = toLength(O.length);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject(Constructor)) {
          Constructor = Constructor[SPECIES$6];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === Array || Constructor === undefined) {
          return nativeSlice.call(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? Array : Constructor)(max$3(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  // this method was added to unscopables after implementation
  // in popular engines, so it's moved to a separate module


  addToUnscopables('flat');

  // `Map` constructor
  // https://tc39.github.io/ecma262/#sec-map-objects
  var es_map = collection('Map', function (init) {
    return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var nativeAssign = Object.assign;
  var defineProperty$7 = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  var objectAssign = !nativeAssign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$7({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$7(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;
    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : nativeAssign;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
    assign: objectAssign
  });

  var FAILS_ON_PRIMITIVES$1 = fails(function () { objectGetPrototypeOf(1); });

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !correctPrototypeGetter }, {
    getPrototypeOf: function getPrototypeOf(it) {
      return objectGetPrototypeOf(toObject(it));
    }
  });

  var propertyIsEnumerable = objectPropertyIsEnumerable.f;

  // `Object.{ entries, values }` methods implementation
  var createMethod$5 = function (TO_ENTRIES) {
    return function (it) {
      var O = toIndexedObject(it);
      var keys = objectKeys(O);
      var length = keys.length;
      var i = 0;
      var result = [];
      var key;
      while (length > i) {
        key = keys[i++];
        if (!descriptors || propertyIsEnumerable.call(O, key)) {
          result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
        }
      }
      return result;
    };
  };

  var objectToArray = {
    // `Object.entries` method
    // https://tc39.github.io/ecma262/#sec-object.entries
    entries: createMethod$5(true),
    // `Object.values` method
    // https://tc39.github.io/ecma262/#sec-object.values
    values: createMethod$5(false)
  };

  var $values = objectToArray.values;

  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  _export({ target: 'Object', stat: true }, {
    values: function values(O) {
      return $values(O);
    }
  });

  var defineProperty$8 = objectDefineProperty.f;
  var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;





  var setInternalState$6 = internalState.set;



  var MATCH$2 = wellKnownSymbol('match');
  var NativeRegExp = global_1.RegExp;
  var RegExpPrototype = NativeRegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;

  var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

  var FORCED$2 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$2 || fails(function () {
    re2[MATCH$2] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  })));

  // `RegExp` constructor
  // https://tc39.github.io/ecma262/#sec-regexp-constructor
  if (FORCED$2) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegexp(pattern);
      var flagsAreUndefined = flags === undefined;
      var sticky;

      if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
        return pattern;
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = regexpFlags.call(pattern);
        pattern = pattern.source;
      }

      if (UNSUPPORTED_Y$2) {
        sticky = !!flags && flags.indexOf('y') > -1;
        if (sticky) flags = flags.replace(/y/g, '');
      }

      var result = inheritIfRequired(
        CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
        thisIsRegExp ? this : RegExpPrototype,
        RegExpWrapper
      );

      if (UNSUPPORTED_Y$2 && sticky) setInternalState$6(result, { sticky: sticky });

      return result;
    };
    var proxy = function (key) {
      key in RegExpWrapper || defineProperty$8(RegExpWrapper, key, {
        configurable: true,
        get: function () { return NativeRegExp[key]; },
        set: function (it) { NativeRegExp[key] = it; }
      });
    };
    var keys$2 = getOwnPropertyNames$1(NativeRegExp);
    var index = 0;
    while (keys$2.length > index) proxy(keys$2[index++]);
    RegExpPrototype.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype;
    redefine(global_1, 'RegExp', RegExpWrapper);
  }

  // https://tc39.github.io/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  var TO_STRING = 'toString';
  var RegExpPrototype$1 = RegExp.prototype;
  var nativeToString = RegExpPrototype$1[TO_STRING];

  var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = nativeToString.name != TO_STRING;

  // `RegExp.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
      return '/' + p + '/' + f;
    }, { unsafe: true });
  }

  var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

  var defineProperty$9 = objectDefineProperty.f;





  var Int8Array$1 = global_1.Int8Array;
  var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
  var Uint8ClampedArray$1 = global_1.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
  var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
  var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
  var ObjectPrototype$2 = Object.prototype;
  var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;

  var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
  var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQIRED = false;
  var NAME$1;

  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var isView = function isView(it) {
    var klass = classof(it);
    return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
  };

  var isTypedArray = function (it) {
    return isObject(it) && has(TypedArrayConstructorsList, classof(it));
  };

  var aTypedArray = function (it) {
    if (isTypedArray(it)) return it;
    throw TypeError('Target is not a typed array');
  };

  var aTypedArrayConstructor = function (C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
      var TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
        return C;
      }
    } throw TypeError('Target is not a typed array constructor');
  };

  var exportTypedArrayMethod = function (KEY, property, forced) {
    if (!descriptors) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
        delete TypedArrayConstructor.prototype[KEY];
      }
    }
    if (!TypedArrayPrototype[KEY] || forced) {
      redefine(TypedArrayPrototype, KEY, forced ? property
        : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
    }
  };

  var exportTypedArrayStaticMethod = function (KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!descriptors) return;
    if (objectSetPrototypeOf) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global_1[ARRAY];
        if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
          delete TypedArrayConstructor[KEY];
        }
      }
      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
        } catch (error) { /* empty */ }
      } else return;
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME$1 in TypedArrayConstructorsList) {
    if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw TypeError('Incorrect invocation');
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
    }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$4)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$9(TypedArrayPrototype, TO_STRING_TAG$4, { get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    } });
    for (NAME$1 in TypedArrayConstructorsList) if (global_1[NAME$1]) {
      createNonEnumerableProperty(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
    }
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportTypedArrayMethod: exportTypedArrayMethod,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
  };

  /* eslint-disable no-new */



  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  var ArrayBuffer$1 = global_1.ArrayBuffer;
  var Int8Array$2 = global_1.Int8Array;

  var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
    Int8Array$2(1);
  }) || !fails(function () {
    new Int8Array$2(-1);
  }) || !checkCorrectnessOfIteration(function (iterable) {
    new Int8Array$2();
    new Int8Array$2(null);
    new Int8Array$2(1.5);
    new Int8Array$2(iterable);
  }, true) || fails(function () {
    // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
    return new Int8Array$2(new ArrayBuffer$1(2), 1, undefined).length !== 1;
  });

  // `ToIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-toindex
  var toIndex = function (it) {
    if (it === undefined) return 0;
    var number = toInteger(it);
    var length = toLength(number);
    if (number !== length) throw RangeError('Wrong length or index');
    return length;
  };

  // IEEE754 conversions based on https://github.com/feross/ieee754
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity$1 = 1 / 0;
  var abs = Math.abs;
  var pow = Math.pow;
  var floor$2 = Math.floor;
  var log = Math.log;
  var LN2 = Math.LN2;

  var pack = function (number, mantissaLength, bytes) {
    var buffer = new Array(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs(number);
    // eslint-disable-next-line no-self-compare
    if (number != number || number === Infinity$1) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$2(log(number) / LN2);
      if (number * (c = pow(2, -exponent)) < 1) {
        exponent--;
        c *= 2;
      }
      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow(2, 1 - eBias);
      }
      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
        exponent = 0;
      }
    }
    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;
    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpack = function (buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;
    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;
    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
    } else {
      mantissa = mantissa + pow(2, mantissaLength);
      exponent = exponent - eBias;
    } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
  };

  var ieee754 = {
    pack: pack,
    unpack: unpack
  };

  // `Array.prototype.fill` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill
  var arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = toObject(this);
    var length = toLength(O.length);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
  var defineProperty$a = objectDefineProperty.f;




  var getInternalState$4 = internalState.get;
  var setInternalState$7 = internalState.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE$2 = 'prototype';
  var WRONG_LENGTH = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global_1[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var $DataView = global_1[DATA_VIEW];
  var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
  var ObjectPrototype$3 = Object.prototype;
  var RangeError$1 = global_1.RangeError;

  var packIEEE754 = ieee754.pack;
  var unpackIEEE754 = ieee754.unpack;

  var packInt8 = function (number) {
    return [number & 0xFF];
  };

  var packInt16 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var unpackInt32 = function (buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packFloat32 = function (number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function (number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter = function (Constructor, key) {
    defineProperty$a(Constructor[PROTOTYPE$2], key, { get: function () { return getInternalState$4(this)[key]; } });
  };

  var get$1 = function (view, count, index, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$4(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$4(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState$4(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState$4(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);
    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
  };

  if (!arrayBufferNative) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = toIndex(length);
      setInternalState$7(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength
      });
      if (!descriptors) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = getInternalState$4(buffer).byteLength;
      var offset = toInteger(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
      setInternalState$7(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });
      if (!descriptors) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (descriptors) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE$2], {
      getInt8: function getInt8(byteOffset) {
        return get$1(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get$1(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set$2(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$2(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    if (!fails(function () {
      NativeArrayBuffer(1);
    }) || !fails(function () {
      new NativeArrayBuffer(-1); // eslint-disable-line no-new
    }) || fails(function () {
      new NativeArrayBuffer(); // eslint-disable-line no-new
      new NativeArrayBuffer(1.5); // eslint-disable-line no-new
      new NativeArrayBuffer(NaN); // eslint-disable-line no-new
      return NativeArrayBuffer.name != ARRAY_BUFFER;
    })) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };
      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];
      for (var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1; keys$3.length > j$1;) {
        if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
          createNonEnumerableProperty($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
        }
      }
      ArrayBufferPrototype.constructor = $ArrayBuffer;
    }

    // WebKit bug - the same parent prototype for typed arrays and data view
    if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$3) {
      objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$3);
    }

    // iOS Safari 7.x bug
    var testView = new $DataView(new $ArrayBuffer(2));
    var nativeSetInt8 = $DataViewPrototype.setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
      setInt8: function setInt8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, { unsafe: true });
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag($DataView, DATA_VIEW);

  var arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView
  };

  var toPositiveInteger = function (it) {
    var result = toInteger(it);
    if (result < 0) throw RangeError("The argument can't be less than 0");
    return result;
  };

  var toOffset = function (it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw RangeError('Wrong offset');
    return offset;
  };

  var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

  var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var i, length, result, step, iterator, next;
    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      O = [];
      while (!(step = next.call(iterator)).done) {
        O.push(step.value);
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = functionBindContext(mapfn, arguments[2], 2);
    }
    length = toLength(O.length);
    result = new (aTypedArrayConstructor$1(this))(length);
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var typedArrayConstructor = createCommonjsModule(function (module) {


















  var getOwnPropertyNames = objectGetOwnPropertyNames.f;

  var forEach = arrayIteration.forEach;






  var getInternalState = internalState.get;
  var setInternalState = internalState.set;
  var nativeDefineProperty = objectDefineProperty.f;
  var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var round = Math.round;
  var RangeError = global_1.RangeError;
  var ArrayBuffer = arrayBuffer.ArrayBuffer;
  var DataView = arrayBuffer.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
  var TypedArray = arrayBufferViewCore.TypedArray;
  var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
  var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
  var isTypedArray = arrayBufferViewCore.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH = 'Wrong length';

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key) {
    nativeDefineProperty(it, key, { get: function () {
      return getInternalState(this)[key];
    } });
  };

  var isArrayBuffer = function (it) {
    var klass;
    return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function (target, key) {
    return isTypedArray(target)
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    return isTypedArrayIndex(target, key = toPrimitive(key, true))
      ? createPropertyDescriptor(2, target[key])
      : nativeGetOwnPropertyDescriptor(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    if (isTypedArrayIndex(target, key = toPrimitive(key, true))
      && isObject(descriptor)
      && has(descriptor, 'value')
      && !has(descriptor, 'get')
      && !has(descriptor, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable
      && (!has(descriptor, 'writable') || descriptor.writable)
      && (!has(descriptor, 'enumerable') || descriptor.enumerable)
    ) {
      target[key] = descriptor.value;
      return target;
    } return nativeDefineProperty(target, key, descriptor);
  };

  if (descriptors) {
    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
      objectDefineProperty.f = wrappedDefineProperty;
      addGetter(TypedArrayPrototype, 'buffer');
      addGetter(TypedArrayPrototype, 'byteOffset');
      addGetter(TypedArrayPrototype, 'byteLength');
      addGetter(TypedArrayPrototype, 'length');
    }

    _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
      defineProperty: wrappedDefineProperty
    });

    module.exports = function (TYPE, wrapper, CLAMPED) {
      var BYTES = TYPE.match(/\d+$/)[0] / 8;
      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + TYPE;
      var SETTER = 'set' + TYPE;
      var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
      var TypedArrayConstructor = NativeTypedArrayConstructor;
      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
      var exported = {};

      var getter = function (that, index) {
        var data = getInternalState(that);
        return data.view[GETTER](index * BYTES + data.byteOffset, true);
      };

      var setter = function (that, index, value) {
        var data = getInternalState(that);
        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
      };

      var addElement = function (that, index) {
        nativeDefineProperty(that, index, {
          get: function () {
            return getter(this, index);
          },
          set: function (value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };

      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
          anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
          var index = 0;
          var byteOffset = 0;
          var buffer, byteLength, length;
          if (!isObject(data)) {
            length = toIndex(data);
            byteLength = length * BYTES;
            buffer = new ArrayBuffer(byteLength);
          } else if (isArrayBuffer(data)) {
            buffer = data;
            byteOffset = toOffset(offset, BYTES);
            var $len = data.byteLength;
            if ($length === undefined) {
              if ($len % BYTES) throw RangeError(WRONG_LENGTH);
              byteLength = $len - byteOffset;
              if (byteLength < 0) throw RangeError(WRONG_LENGTH);
            } else {
              byteLength = toLength($length) * BYTES;
              if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
            }
            length = byteLength / BYTES;
          } else if (isTypedArray(data)) {
            return fromList(TypedArrayConstructor, data);
          } else {
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }
          setInternalState(that, {
            buffer: buffer,
            byteOffset: byteOffset,
            byteLength: byteLength,
            length: length,
            view: new DataView(buffer)
          });
          while (index < length) addElement(that, index++);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
      } else if (typedArrayConstructorsRequireWrappers) {
        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
          anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
          return inheritIfRequired(function () {
            if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
            if (isArrayBuffer(data)) return $length !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
              : typedArrayOffset !== undefined
                ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
                : new NativeTypedArrayConstructor(data);
            if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }(), dummy, TypedArrayConstructor);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
          if (!(key in TypedArrayConstructor)) {
            createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
          }
        });
        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
      }

      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
        createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
      }

      if (TYPED_ARRAY_TAG) {
        createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
      }

      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

      _export({
        global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
      }, exported);

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
        createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
      }

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
        createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
      }

      setSpecies(CONSTRUCTOR_NAME);
    };
  } else module.exports = function () { /* empty */ };
  });

  // `Float32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Float32', function (init) {
    return function Float32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Float64Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Float64', function (init) {
    return function Float64Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Int8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int8', function (init) {
    return function Int8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Int16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int16', function (init) {
    return function Int16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Int32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int32', function (init) {
    return function Int32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint8ClampedArray` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', function (init) {
    return function Uint8ClampedArray(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  }, true);

  // `Uint16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint16', function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint32', function (init) {
    return function Uint32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var min$6 = Math.min;

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
  var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var to = toAbsoluteIndex(target, len);
    var from = toAbsoluteIndex(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$6((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
    var inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count-- > 0) {
      if (from in O) O[to] = O[from];
      else delete O[to];
      to += inc;
      from += inc;
    } return O;
  };

  var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
  exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
    return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var $every = arrayIteration.every;

  var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
  exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
    return $every(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
    return arrayFill.apply(aTypedArray$3(this), arguments);
  });

  var $filter$1 = arrayIteration.filter;


  var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
  exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
    var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$2(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  });

  var $find$1 = arrayIteration.find;

  var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
  exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
    return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $findIndex = arrayIteration.findIndex;

  var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
  exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
    return $findIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $forEach$2 = arrayIteration.forEach;

  var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
  exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
    $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $includes$1 = arrayIncludes.includes;

  var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
  exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
    return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $indexOf$1 = arrayIncludes.indexOf;

  var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
  exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
    return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ITERATOR$6 = wellKnownSymbol('iterator');
  var Uint8Array$1 = global_1.Uint8Array;
  var arrayValues = es_array_iterator.values;
  var arrayKeys = es_array_iterator.keys;
  var arrayEntries = es_array_iterator.entries;
  var aTypedArray$a = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
  var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$6];

  var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
    && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this));
  };

  // `%TypedArray%.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
  exportTypedArrayMethod$a('entries', function entries() {
    return arrayEntries.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
  exportTypedArrayMethod$a('keys', function keys() {
    return arrayKeys.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
  exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportTypedArrayMethod$a(ITERATOR$6, typedArrayValues, !CORRECT_ITER_NAME);

  var aTypedArray$b = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
  var $join = [].join;

  // `%TypedArray%.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$b('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  var min$7 = Math.min;
  var nativeLastIndexOf = [].lastIndexOf;
  var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  var STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf');
  // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
  var USES_TO_LENGTH$9 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });
  var FORCED$3 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$9;

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
  var arrayLastIndexOf = FORCED$3 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = min$7(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
    return -1;
  } : nativeLastIndexOf;

  var aTypedArray$c = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
    return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
  });

  var $map$1 = arrayIteration.map;


  var aTypedArray$d = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
  exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
    return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length);
    });
  });

  var $reduce$1 = arrayReduce.left;

  var aTypedArray$e = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
  exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
    return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $reduceRight = arrayReduce.right;

  var aTypedArray$f = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
  exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$g = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
  var floor$3 = Math.floor;

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
  exportTypedArrayMethod$g('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$g(that).length;
    var middle = floor$3(length / 2);
    var index = 0;
    var value;
    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    } return that;
  });

  var aTypedArray$h = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

  var FORCED$4 = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).set({});
  });

  // `%TypedArray%.prototype.set` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
  exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
    aTypedArray$h(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError('Wrong length');
    while (index < len) this[offset + index] = src[index++];
  }, FORCED$4);

  var aTypedArray$i = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
  var $slice = [].slice;

  var FORCED$5 = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice();
  });

  // `%TypedArray%.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
  exportTypedArrayMethod$i('slice', function slice(start, end) {
    var list = $slice.call(aTypedArray$i(this), start, end);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$4(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  }, FORCED$5);

  var $some = arrayIteration.some;

  var aTypedArray$j = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
  exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
    return $some(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$k = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
  var $sort = [].sort;

  // `%TypedArray%.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
  exportTypedArrayMethod$k('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$k(this), comparefn);
  });

  var aTypedArray$l = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
  exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
    var O = aTypedArray$l(this);
    var length = O.length;
    var beginIndex = toAbsoluteIndex(begin, length);
    return new (speciesConstructor(O, O.constructor))(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
    );
  });

  var Int8Array$3 = global_1.Int8Array;
  var aTypedArray$m = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
  var $toLocaleString = [].toLocaleString;
  var $slice$1 = [].slice;

  // iOS Safari 6.x fails here
  var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
    $toLocaleString.call(new Int8Array$3(1));
  });

  var FORCED$6 = fails(function () {
    return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
  }) || !fails(function () {
    Int8Array$3.prototype.toLocaleString.call([1, 2]);
  });

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
  exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
    return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
  }, FORCED$6);

  var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



  var Uint8Array$2 = global_1.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
  var arrayToString = [].toString;
  var arrayJoin = [].join;

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

  // `%TypedArray%.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
  exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  // `WeakSet` constructor
  // https://tc39.github.io/ecma262/#sec-weakset-constructor
  collection('WeakSet', function (init) {
    return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionWeak);

  var _this4 = undefined;

  var Prop = function Prop(context, prop) {
    var isConst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isGlobal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Prop);

    this.context = context;
    this.prop = prop;
    this.isConst = isConst;
    this.isGlobal = isGlobal;
  };

  var Lisp = function Lisp(obj) {
    _classCallCheck(this, Lisp);

    this.op = obj.op;
    this.a = obj.a;
    this.b = obj.b;
  };

  var If = function If(t, f) {
    _classCallCheck(this, If);

    this.t = t;
    this.f = f;
  };

  var KeyVal = function KeyVal(key, val) {
    _classCallCheck(this, KeyVal);

    this.key = key;
    this.val = val;
  };

  var ObjectFunc = function ObjectFunc(key, args, tree) {
    _classCallCheck(this, ObjectFunc);

    this.key = key;
    this.args = args;
    this.tree = tree;
  };

  var SpreadObject = function SpreadObject(item) {
    _classCallCheck(this, SpreadObject);

    this.item = item;
  };

  var SpreadArray = function SpreadArray(item) {
    _classCallCheck(this, SpreadArray);

    this.item = item;
  };

  var Scope = /*#__PURE__*/function () {
    function Scope(parent) {
      var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var functionThis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      _classCallCheck(this, Scope);

      this["const"] = {};
      this["var"] = {};
      this.globals = {};
      this.parent = parent;
      this["let"] = !parent ? {} : vars;
      this.globals = !parent ? vars : {};
      this.functionThis = functionThis || !parent;

      if (functionThis) {
        this.declare('this', 'var', functionThis);
      }
    }

    _createClass(Scope, [{
      key: "get",
      value: function get(key) {
        var functionScope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!this.parent || !functionScope || this.functionThis) {
          if (this["const"].hasOwnProperty(key)) {
            return new Prop(this["const"], key, true, key in this.globals);
          }

          if (this["var"].hasOwnProperty(key)) {
            return new Prop(this["var"], key, false, key in this.globals);
          }

          if (this["let"].hasOwnProperty(key)) {
            return new Prop(this["let"], key, false, key in this.globals);
          }

          if (!this.parent && this.globals.hasOwnProperty(key)) {
            return new Prop(this.functionThis, key, false, true);
          }

          if (!this.parent) {
            return new Prop(undefined, key);
          }
        }

        return this.parent.get(key, functionScope);
      }
    }, {
      key: "set",
      value: function set(key, val) {
        if (key === 'this') throw new SyntaxError('"this" cannot be a variable');
        var prop = this.get(key);

        if (prop.context === undefined) {
          throw new ReferenceError("Variable '".concat(key, "' was not declared."));
        }

        if (prop.isConst) {
          throw new TypeError("Cannot assign to const variable '".concat(key, "'"));
        }

        if (prop.isGlobal) {
          throw new SandboxError("Cannot override global variable '".concat(key, "'"));
        }

        prop.context[prop] = val;
        return prop;
      }
    }, {
      key: "declare",
      value: function declare(key) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
        var isGlobal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (type === 'var' && !this.functionThis && this.parent) {
          this.parent.declare(key, type, value, isGlobal);
        } else if (!(key in this["var"]) || !(key in this["let"]) || !(key in this["const"]) || !(key in this.globals)) {
          if (isGlobal) {
            this.globals[key] = value;
          }

          this[type][key] = value;
        } else {
          throw Error("Variable '".concat(key, "' already declared"));
        }
      }
    }]);

    return Scope;
  }();

  var ParseError = /*#__PURE__*/function (_Error) {
    _inherits(ParseError, _Error);

    function ParseError(message, code) {
      var _this;

      _classCallCheck(this, ParseError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ParseError).call(this, message));
      _this.code = code;
      return _this;
    }

    return ParseError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  var SandboxError = /*#__PURE__*/function (_Error2) {
    _inherits(SandboxError, _Error2);

    function SandboxError() {
      _classCallCheck(this, SandboxError);

      return _possibleConstructorReturn(this, _getPrototypeOf(SandboxError).apply(this, arguments));
    }

    return SandboxError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  var SandboxGlobal = function SandboxGlobal(globals) {
    _classCallCheck(this, SandboxGlobal);

    if (globals === globalThis) return globalThis;

    for (var i in globals) {
      this[i] = globals[i];
    }
  };

  function sandboxFunction(context) {
    return SandboxFunction;

    function SandboxFunction() {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var code = params.pop();
      var parsed = Sandbox.parse(code);
      return function () {
        var vars = {};

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;
            vars[i] = args.shift();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var res = context.sandbox.executeTree(parsed);

        if (context.options.audit) {
          var _loop = function _loop(key) {
            var _this2 = this;

            var add = res.auditReport.globalsAccess[key];
            context.auditReport.globalsAccess[key] = context.auditReport.globalsAccess[key] || new Set();
            add.forEach(function (val) {
              _newArrowCheck(this, _this2);

              context.auditReport.globalsAccess[key].add(val);
            }.bind(this));
          };

          for (var key in res.auditReport.globalsAccess) {
            _loop(key);
          }

          var _loop2 = function _loop2(Class) {
            var _this3 = this;

            var add = res.auditReport.prototypeAccess[Class];
            context.auditReport.prototypeAccess[Class] = context.auditReport.prototypeAccess[Class] || new Set();
            add.forEach(function (val) {
              _newArrowCheck(this, _this3);

              context.auditReport.prototypeAccess[Class].add(val);
            }.bind(this));
          };

          for (var Class in res.auditReport.prototypeAccess) {
            _loop2(Class);
          }
        }

        return res.result;
      };
    }
  }

  function sandboxedEval(func) {
    return sandboxEval;

    function sandboxEval(code) {
      return func(code)();
    }
  }

  function sandboxedSetTimeout(func) {
    return function sandboxSetTimeout(handler) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (typeof handler !== 'string') return setTimeout.apply(void 0, [handler].concat(args));
      return setTimeout(func(handler), args[0]);
    };
  }

  function sandboxedSetInterval(func) {
    return function sandboxSetInterval(handler) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      if (typeof handler !== 'string') return setInterval.apply(void 0, [handler].concat(args));
      return setTimeout(func(handler), args[0]);
    };
  }

  var expectTypes = {
    op: {
      types: {
        op: /^(\/|\*\*(?!\=)|\*(?!\=)|\%(?!\=))/
      },
      next: ['value', 'prop', 'exp', 'modifier', 'incrementerBefore']
    },
    splitter: {
      types: {
        split: /^(&&|&|\|\||\||<=|>=|<|>|!==|!=|===|==| instanceof | in |\+(?!\+)|\-(?!\-))(?!\=)/
      },
      next: ['value', 'prop', 'exp', 'modifier', 'incrementerBefore']
    },
    "if": {
      types: {
        "if": /^\?/,
        "else": /^:/
      },
      next: ['expEnd']
    },
    assignment: {
      types: {
        assignModify: /^(\-=|\+=|\/=|\*\*=|\*=|%=|\^=|\&=|\|=)/,
        assign: /^(=)/
      },
      next: ['value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore']
    },
    incrementerBefore: {
      types: {
        incrementerBefore: /^(\+\+|\-\-)/
      },
      next: ['prop']
    },
    incrementerAfter: {
      types: {
        incrementerAfter: /^(\+\+|\-\-)/
      },
      next: ['splitter', 'op', 'expEnd']
    },
    expEdge: {
      types: {
        arrayProp: /^[\[]/,
        call: /^[\(]/
      },
      next: ['splitter', 'op', 'expEdge', 'if', 'dot', 'expEnd']
    },
    modifier: {
      types: {
        not: /^!/,
        inverse: /^~/,
        negative: /^\-(?!\-)/,
        positive: /^\+(?!\+)/,
        "typeof": /^ typeof /
      },
      next: ['exp', 'modifier', 'value', 'prop', 'incrementerBefore']
    },
    exp: {
      types: {
        createObject: /^\{/,
        createArray: /^\[/,
        group: /^\(/
      },
      next: ['splitter', 'op', 'expEdge', 'if', 'dot', 'expEnd']
    },
    dot: {
      types: {
        dot: /^\.(?!\.)/
      },
      next: ['splitter', 'incrementerAfter', 'assignment', 'op', 'expEdge', 'if', 'dot', 'expEnd']
    },
    prop: {
      types: {
        prop: /^[a-zA-Z\$_][a-zA-Z\d\$_]*/
      },
      next: ['splitter', 'incrementerAfter', 'assignment', 'op', 'expEdge', 'if', 'dot', 'expEnd']
    },
    value: {
      types: {
        number: /^\-?\d+(\.\d+)?/,
        string: /^"(\d+)"/,
        literal: /^`(\d+)`/,
        "boolean": /^(true|false)(?![\w$_])/,
        "null": /^null(?![\w$_])/,
        und: /^undefined(?![\w$_])/,
        NaN: /^NaN(?![\w$_])/,
        Infinity: /^Infinity(?![\w$_])/
      },
      next: ['splitter', 'op', 'if', 'dot', 'expEnd']
    },
    "function": {
      types: {
        arrowFunc: /^\(?(((\.\.\.)?[a-zA-Z\$_][a-zA-Z\d\$_]*,?)*)(\))?=>({)?/
      },
      next: ['expEnd']
    },
    initialize: {
      types: {
        initialize: /^ (var|let|const) [a-zA-Z\$_][a-zA-Z\d\$_]*/
      },
      next: ['value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore', 'expEnd']
    },
    spreadObject: {
      types: {
        spreadObject: /^\.\.\./
      },
      next: ['value', 'exp', 'prop']
    },
    spreadArray: {
      types: {
        spreadArray: /^\.\.\./
      },
      next: ['value', 'exp', 'prop']
    },
    expEnd: {
      types: {},
      next: []
    },
    expStart: {
      types: {
        "return": /^ return /
      },
      next: ['value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore', 'expEnd']
    }
  };
  var closings = {
    "(": ")",
    "[": "]",
    "{": "}",
    "'": "'",
    '"': '"',
    "`": "`"
  };
  var closingsRegex = {
    "(": /^\)/,
    "[": /^\]/,
    "{": /^\}/,
    "'": /^\'/,
    '"': /^\"/,
    "`": /^\`/
  };
  var okFirstChars = /^[\+\-~ !]/;

  var _restOfExp = function restOfExp(part, tests, quote) {
    _newArrowCheck(this, _this4);

    var isStart = true;
    tests = tests || [expectTypes.op.types.op, expectTypes.splitter.types.split, expectTypes["if"].types["if"], expectTypes["if"].types["else"]];
    var escape = false;
    var done = false;
    var i;

    for (i = 0; i < part.length && !done; i++) {
      var _char = part[i];

      if (quote === '"' || quote === "'" || quote === "`") {
        if (quote === "`" && _char === "$" && part[i + 1] === "{" && !escape) {
          var skip = _restOfExp(part.substring(i + 2), [closingsRegex['{']]);

          i += skip.length + 2;
        } else if (_char === quote && !escape) {
          return part.substring(0, i);
        }

        escape = _char === "\\";
      } else if (closings[_char]) {
        var _skip = _restOfExp(part.substring(i + 1), [closingsRegex[quote]], _char);

        i += _skip.length + 1;
        isStart = false;
      } else if (!quote) {
        var sub = part.substring(i);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = tests[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var test = _step2.value;
            done = test.test(sub);
            if (done) break;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (isStart) {
          if (okFirstChars.test(sub)) {
            done = false;
          } else {
            isStart = false;
          }
        }

        if (done) break;
      } else if (_char === closings[quote]) {
        return part.substring(0, i);
      }
    }

    return part.substring(0, i);
  }.bind(undefined);

  _restOfExp.next = ['splitter', 'op', 'expEnd'];

  function assignCheck(obj) {
    if (obj.context === undefined) {
      throw new ReferenceError("Cannot assign value to undefined.");
    }

    if (_typeof(obj.context) !== 'object' && typeof obj.context !== 'function') {
      throw new SyntaxError("Cannot assign value to a primitive.");
    }

    if (obj.isConst) {
      throw new TypeError("Cannot set value to const variable '".concat(obj.prop, "'"));
    }

    if (obj.isGlobal) {
      throw new SandboxError("Cannot assign property '".concat(obj.prop, "' of a global object"));
    }

    if (typeof obj.context[obj.prop] === 'function' && !obj.context.hasOwnProperty(obj.prop)) {
      throw new SandboxError("Override prototype property '".concat(obj.prop, "' not allowed"));
    }
  }

  var ops2 = {
    'prop': function prop(a, b, obj, context, scope) {
      _newArrowCheck(this, _this4);

      if (a === null) {
        throw new TypeError("Cannot get property ".concat(b, " of null"));
      }

      var type = _typeof(a);

      if (type === 'undefined') {
        var prop = scope.get(b);
        if (prop.context === undefined) throw new ReferenceError("".concat(b, " is not defined"));

        if (prop.context === context.sandboxGlobal) {
          if (context.options.audit) {
            context.auditReport.globalsAccess.add(b);
          }

          var _rep = context.replacements.get(context.sandboxGlobal[b]);

          if (_rep) return _rep;
        }

        if (prop.context && prop.context[b] === globalThis) {
          return context.globalScope.get('this');
        }

        return prop;
      }

      var ok = false;

      if (type !== 'object') {
        if (type === 'number') {
          a = new Number(a);
        } else if (type === 'string') {
          a = new String(a);
        } else if (type === 'boolean') {
          a = new Boolean(a);
        }
      } else if (typeof a.hasOwnProperty === 'undefined') {
        return new Prop(undefined, b);
      }

      var isFunction = type === 'function';
      ok = !isFunction && (a.hasOwnProperty(b) || typeof b === 'number');

      if (context.options.audit && !ok) {
        ok = true;

        if (typeof b === 'string') {
          var prot = a.constructor.prototype;

          do {
            if (prot.hasOwnProperty(b)) {
              if (!context.auditReport.prototypeAccess[prot.constructor.name]) {
                context.auditReport.prototypeAccess[prot.constructor.name] = new Set();
              }

              context.auditReport.prototypeAccess[prot.constructor.name].add(b);
            }
          } while (prot = Object.getPrototypeOf(prot));
        }
      }

      if (!ok) {
        if (isFunction) {
          if (!['name', 'length', 'constructor'].includes(b) && a.hasOwnProperty(b)) {
            var whitelist = context.prototypeWhitelist.get(a);

            if (whitelist && (!whitelist.size || whitelist.has(b))) ; else {
              throw new SandboxError("Static method or property access not permitted: ".concat(a.name, ".").concat(b));
            }
          }
        } else if (b !== 'constructor') {
          var _prot = a.constructor.prototype;

          do {
            if (_prot.hasOwnProperty(b)) {
              var _whitelist = context.prototypeWhitelist.get(_prot.constructor);

              if (_whitelist && (!_whitelist.size || _whitelist.has(b))) {
                break;
              }

              throw new SandboxError("Method or property access not permitted: ".concat(_prot.constructor.name, ".").concat(b));
            }
          } while (_prot = Object.getPrototypeOf(_prot));
        }
      }

      var rep = context.replacements.get(a[b]);
      if (rep) return rep;

      if (a[b] === globalThis) {
        return context.globalScope.get('this');
      }

      var g = obj.isGlobal || isFunction && a.name !== 'sandboxArrowFunction' || context.globalsWhitelist.has(a);
      return new Prop(a, b, false, g);
    }.bind(undefined),
    'call': function call(a, b, obj, context, scope) {
      var _this5 = this,
          _obj$context;

      _newArrowCheck(this, _this4);

      if (context.options.forbidMethodCalls) throw new SandboxError("Method calls are not allowed");

      if (typeof a !== 'function') {
        throw new TypeError("".concat(obj.prop, " is not a function"));
      }

      var args = b.map(function (item) {
        _newArrowCheck(this, _this5);

        if (item instanceof SpreadArray) {
          return item.item;
        } else {
          return [item];
        }
      }.bind(this)).flat();

      if (typeof obj === 'function') {
        return obj.apply(void 0, _toConsumableArray(args.map(function (item) {
          _newArrowCheck(this, _this5);

          return exec(item, scope, context);
        }.bind(this))));
      }

      return (_obj$context = obj.context)[obj.prop].apply(_obj$context, _toConsumableArray(args.map(function (item) {
        _newArrowCheck(this, _this5);

        return exec(item, scope, context);
      }.bind(this))));
    }.bind(undefined),
    'createObject': function createObject(a, b, obj, context, scope) {
      _newArrowCheck(this, _this4);

      var res = {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = b[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          if (item instanceof SpreadObject) {
            res = _objectSpread2({}, res, {}, item.item);
          } else if (item instanceof ObjectFunc) {
            (function () {
              var f = item;

              res[f.key] = function () {
                var _this6 = this;

                for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                  args[_key5] = arguments[_key5];
                }

                var vars = {};
                f.args.forEach(function (arg, i) {
                  _newArrowCheck(this, _this6);

                  vars[arg] = args[i];
                }.bind(this));
                return context.sandbox.executeTree({
                  tree: f.tree,
                  strings: context.strings,
                  literals: context.literals
                }, [new Scope(scope, vars, this)]).result;
              };
            })();
          } else {
            res[item.key] = item.val;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return res;
    }.bind(undefined),
    'keyVal': function keyVal(a, b) {
      _newArrowCheck(this, _this4);

      return new KeyVal(a, b);
    }.bind(undefined),
    'createArray': function createArray(a, b, obj, context, scope) {
      var _this7 = this;

      _newArrowCheck(this, _this4);

      return b.map(function (item) {
        _newArrowCheck(this, _this7);

        if (item instanceof SpreadArray) {
          return item.item;
        } else {
          return [item];
        }
      }.bind(this)).flat().map(function (item) {
        _newArrowCheck(this, _this7);

        return exec(item, scope, context);
      }.bind(this));
    }.bind(undefined),
    'group': function group(a, b) {
      _newArrowCheck(this, _this4);

      return b;
    }.bind(undefined),
    'string': function string(a, b, obj, context) {
      _newArrowCheck(this, _this4);

      return context.strings[b];
    }.bind(undefined),
    'literal': function literal(a, b, obj, context, scope) {
      var _this8 = this;

      _newArrowCheck(this, _this4);

      var name = context.literals[b].a;
      return name.replace(/(\$\$)*(\$)?\${(\d+)}/g, function (match, $$, $, num) {
        _newArrowCheck(this, _this8);

        if ($) return match;
        var res = exec(context.literals[b].b[parseInt(num, 10)], scope, context);
        res = res instanceof Prop ? res.context[res.prop] : res;
        return ($$ ? $$ : '') + "".concat(res).replace(/\$/g, '$$');
      }.bind(this)).replace(/\$\$/g, '$');
    }.bind(undefined),
    'spreadArray': function spreadArray(a, b, obj, context, scope) {
      _newArrowCheck(this, _this4);

      return new SpreadArray(exec(b, scope, context));
    }.bind(undefined),
    'spreadObject': function spreadObject(a, b, obj, context, scope) {
      _newArrowCheck(this, _this4);

      return new SpreadObject(exec(b, scope, context));
    }.bind(undefined),
    '!': function _(a, b) {
      _newArrowCheck(this, _this4);

      return !b;
    }.bind(undefined),
    '~': function _(a, b) {
      _newArrowCheck(this, _this4);

      return ~b;
    }.bind(undefined),
    '++$': function $(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return ++obj.context[obj.prop];
    }.bind(undefined),
    '$++': function $(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop]++;
    }.bind(undefined),
    '--$': function $(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return --obj.context[obj.prop];
    }.bind(undefined),
    '$--': function $(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop]--;
    }.bind(undefined),
    '=': function _(a, b, obj, context, scope, bobj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      obj.context[obj.prop] = b;
      return new Prop(obj.context, obj.prop, false, obj.isGlobal);
    }.bind(undefined),
    '+=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] += b;
    }.bind(undefined),
    '-=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] -= b;
    }.bind(undefined),
    '/=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] /= b;
    }.bind(undefined),
    '*=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] *= b;
    }.bind(undefined),
    '**=': function _(a, b, obj) {
      var _obj$context2, _obj$prop;

      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return _obj$context2 = obj.context, _obj$prop = obj.prop, _obj$context2[_obj$prop] = Math.pow(_obj$context2[_obj$prop], b);
    }.bind(undefined),
    '%=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] %= b;
    }.bind(undefined),
    '^=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] ^= b;
    }.bind(undefined),
    '&=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] &= b;
    }.bind(undefined),
    '|=': function _(a, b, obj) {
      _newArrowCheck(this, _this4);

      assignCheck(obj);
      return obj.context[obj.prop] |= b;
    }.bind(undefined),
    '?': function _(a, b) {
      _newArrowCheck(this, _this4);

      if (!(b instanceof If)) {
        throw new SyntaxError('Invalid inline if');
      }

      return a ? b.t : b.f;
    }.bind(undefined),
    '>': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a > b;
    }.bind(undefined),
    '<': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a < b;
    }.bind(undefined),
    '>=': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a >= b;
    }.bind(undefined),
    '<=': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a <= b;
    }.bind(undefined),
    '==': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a == b;
    }.bind(undefined),
    '===': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a === b;
    }.bind(undefined),
    '!=': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a != b;
    }.bind(undefined),
    '!==': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a !== b;
    }.bind(undefined),
    '&&': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a && b;
    }.bind(undefined),
    '||': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a || b;
    }.bind(undefined),
    '&': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a & b;
    }.bind(undefined),
    '|': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a | b;
    }.bind(undefined),
    ':': function _(a, b) {
      _newArrowCheck(this, _this4);

      return new If(a, b);
    }.bind(undefined),
    '+': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a + b;
    }.bind(undefined),
    '-': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a - b;
    }.bind(undefined),
    '$+': function $(a, b) {
      _newArrowCheck(this, _this4);

      return +b;
    }.bind(undefined),
    '$-': function $(a, b) {
      _newArrowCheck(this, _this4);

      return -b;
    }.bind(undefined),
    '/': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a / b;
    }.bind(undefined),
    '*': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a * b;
    }.bind(undefined),
    '%': function _(a, b) {
      _newArrowCheck(this, _this4);

      return a % b;
    }.bind(undefined),
    ' typeof ': function _typeof(a, b) {
      _newArrowCheck(this, _this4);

      return _typeof();
    }.bind(undefined),
    ' instanceof ': function _instanceof(a, b) {
      _newArrowCheck(this, _this4);

      return a instanceof b;
    }.bind(undefined),
    ' in ': function _in(a, b) {
      _newArrowCheck(this, _this4);

      return a in b;
    }.bind(undefined),
    'return': function _return(a, b) {
      _newArrowCheck(this, _this4);

      return b;
    }.bind(undefined),
    'var': function _var(a, b, obj, context, scope, bobj) {
      _newArrowCheck(this, _this4);

      scope.declare(a, 'var', exec(b, scope, context));
      return new Prop(scope["var"], a, false, bobj && bobj.isGlobal);
    }.bind(undefined),
    'let': function _let(a, b, obj, context, scope, bobj) {
      _newArrowCheck(this, _this4);

      scope.declare(a, 'let', exec(b, scope, context), bobj && bobj.isGlobal);
      return new Prop(scope["let"], a, false, bobj && bobj.isGlobal);
    }.bind(undefined),
    'const': function _const(a, b, obj, context, scope, bobj) {
      _newArrowCheck(this, _this4);

      scope.declare(a, 'const', exec(b, scope, context));
      return new Prop(scope["const"], a, false, bobj && bobj.isGlobal);
    }.bind(undefined),
    'arrowFunc': function arrowFunc(a, b, obj, context, scope) {
      var _this9 = this;

      _newArrowCheck(this, _this4);

      var sandboxArrowFunction = function sandboxArrowFunction() {
        var _this10 = this;

        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        _newArrowCheck(this, _this9);

        var vars = {};
        a.forEach(function (arg, i) {
          _newArrowCheck(this, _this10);

          if (arg.startsWith('...')) {
            vars[arg.substring(3)] = args.slice(i);
          } else {
            vars[arg] = args[i];
          }
        }.bind(this));
        return context.sandbox.executeTree({
          tree: b,
          strings: context.strings,
          literals: context.literals
        }, [new Scope(scope, vars)]).result;
      }.bind(this);

      return sandboxArrowFunction;
    }.bind(undefined)
  };
  var ops = new Map();

  for (var op in ops2) {
    ops.set(op, ops2[op]);
  }

  var lispTypes = new Map();

  var setLispType = function setLispType(types, fn) {
    var _this11 = this;

    _newArrowCheck(this, _this4);

    types.forEach(function (type) {
      _newArrowCheck(this, _this11);

      lispTypes.set(type, fn);
    }.bind(this));
  }.bind(undefined);

  var closingsCreate = {
    'createArray': /^\]/,
    'createObject': /^\}/,
    'group': /^\)/,
    'arrayProp': /^\]/,
    'call': /^\)/
  };
  setLispType(['createArray', 'createObject', 'group', 'arrayProp', 'call'], function (type, part, res, expect, ctx) {
    var _this12 = this;

    _newArrowCheck(this, _this4);

    var extract = "";
    var arg = [];
    var end = false;
    var i = 1;

    while (i < part.length && !end) {
      extract = _restOfExp(part.substring(i), [closingsCreate[type], /^,/]);
      i += extract.length;

      if (extract) {
        arg.push(extract);
      }

      if (part[i] !== ',') {
        end = true;
      } else {
        i++;
      }
    }

    var next = ['value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore'];
    var l;
    var fFound;
    var reg2 = /^([a-zA-Z\$_][a-zA-Z\d\$_]*)\((([a-zA-Z\$_][a-zA-Z\d\$_]*,?)*)\)?{/;

    switch (type) {
      case 'group':
      case 'arrayProp':
        l = lispify(arg.pop());
        break;

      case 'call':
      case 'createArray':
        l = arg.map(function (e) {
          _newArrowCheck(this, _this12);

          return lispify(e, [].concat(next, ['spreadArray']));
        }.bind(this));
        break;

      case 'createObject':
        l = arg.map(function (str) {
          _newArrowCheck(this, _this12);

          var value;
          var key;
          fFound = reg2.exec(str);

          if (fFound) {
            var args = fFound[2] ? fFound[2].split(",") : [];

            var func = _restOfExp(str.substring(fFound.index + fFound[0].length), [/^}/]);

            return new ObjectFunc(fFound[1], args, Sandbox.parse(func, null).tree);
          } else {
            var _extract = _restOfExp(str, [/^:/]);

            key = lispify(_extract, [].concat(next, ['spreadObject']));

            if (key instanceof Lisp && key.op === 'prop') {
              key = key.b;
            }

            if (_extract.length === str.length) return key;
            value = lispify(str.substring(_extract.length + 1));
          }

          return new Lisp({
            op: 'keyVal',
            a: key,
            b: value
          });
        }.bind(this));
        break;
    }

    type = type === 'arrayProp' ? 'prop' : type;
    ctx.lispTree = lispify(part.substring(i + 1), expectTypes[expect].next, new Lisp({
      op: type,
      a: ctx.lispTree,
      b: l
    }));
  }.bind(undefined));
  setLispType(['inverse', 'not', 'negative', 'positive', 'typeof', 'op'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    var extract = _restOfExp(part.substring(res[0].length));

    ctx.lispTree = lispify(part.substring(extract.length + res[0].length), _restOfExp.next, new Lisp({
      op: ['positive', 'negative'].includes(type) ? '$' + res[0] : res[0],
      a: ctx.lispTree,
      b: lispify(extract, expectTypes[expect].next)
    }));
  }.bind(undefined));
  setLispType(['incrementerBefore'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    var extract = _restOfExp(part.substring(2));

    ctx.lispTree = lispify(part.substring(extract.length + 2), _restOfExp.next, new Lisp({
      op: res[0] + "$",
      a: lispify(extract, expectTypes[expect].next)
    }));
  }.bind(undefined));
  setLispType(['incrementerAfter'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, new Lisp({
      op: "$" + res[0],
      a: ctx.lispTree
    }));
  }.bind(undefined));
  setLispType(['assign', 'assignModify'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    ctx.lispTree = new Lisp({
      op: res[0],
      a: ctx.lispTree,
      b: lispify(part.substring(res[0].length), expectTypes[expect].next)
    });
  }.bind(undefined));
  setLispType(['split'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    var extract = _restOfExp(part.substring(res[0].length), [expectTypes.splitter.types.split, expectTypes["if"].types["if"], expectTypes["if"].types["else"]]);

    ctx.lispTree = lispify(part.substring(extract.length + res[0].length), _restOfExp.next, new Lisp({
      op: res[0],
      a: ctx.lispTree,
      b: lispify(extract, expectTypes[expect].next)
    }));
  }.bind(undefined));
  setLispType(['if'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    var found = false;
    var extract = "";
    var quoteCount = 1;

    while (!found && extract.length < part.length) {
      extract += _restOfExp(part.substring(extract.length + 1), [expectTypes["if"].types["if"], expectTypes["if"].types["else"]]);

      if (part[extract.length + 1] === '?') {
        quoteCount++;
      } else {
        quoteCount--;
      }

      if (!quoteCount) {
        found = true;
      } else {
        extract += part[extract.length + 1];
      }
    }

    ctx.lispTree = new Lisp({
      op: '?',
      a: ctx.lispTree,
      b: new Lisp({
        op: ':',
        a: lispify(extract),
        b: lispify(part.substring(res[0].length + extract.length + 1))
      })
    });
  }.bind(undefined));
  setLispType(['dot', 'prop'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    var prop = res[0];
    var index = res[0].length;

    if (res[0] === '.') {
      var matches = part.substring(res[0].length).match(expectTypes.prop.types.prop);

      if (matches.length) {
        prop = matches[0];
        index = prop.length + res[0].length;
      } else {
        throw Error('Hanging  dot:' + part);
      }
    }

    ctx.lispTree = lispify(part.substring(index), expectTypes[expect].next, new Lisp({
      op: 'prop',
      a: ctx.lispTree,
      b: prop
    }));
  }.bind(undefined));
  setLispType(['spreadArray', 'spreadObject', 'return'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    ctx.lispTree = new Lisp({
      op: type,
      b: lispify(part.substring(res[0].length), expectTypes[expect].next)
    });
  }.bind(undefined));
  setLispType(['number', 'boolean', 'null'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, JSON.parse(res[0]));
  }.bind(undefined));
  var constants = {
    NaN: NaN,
    Infinity: Infinity
  };
  setLispType(['und', 'NaN', 'Infinity'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, constants[type]);
  }.bind(undefined));
  setLispType(['string', 'literal'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, new Lisp({
      op: type,
      b: parseInt(JSON.parse(res[1]), 10)
    }));
  }.bind(undefined));
  setLispType(['initialize'], function (type, part, res, expect, ctx) {
    _newArrowCheck(this, _this4);

    var split = res[0].split(/ /g);

    if (part.length === res[0].length) {
      ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, new Lisp({
        op: split[1],
        a: split[2]
      }));
    } else {
      ctx.lispTree = new Lisp({
        op: split[1],
        a: split[2],
        b: lispify(part.substring(res[0].length + 1), expectTypes[expect].next)
      });
    }
  }.bind(undefined));
  setLispType(['arrowFunc'], function (type, part, res, expect, ctx) {
    var _this13 = this;

    _newArrowCheck(this, _this4);

    var args = res[1] ? res[1].split(",") : [];

    if (res[4]) {
      if (res[0][0] !== '(') throw new SyntaxError('Unstarted inline function brackets: ' + res[0]);
    } else if (args.length) {
      args = [args.pop()];
    }

    var ended = false;
    args.forEach(function (arg) {
      _newArrowCheck(this, _this13);

      if (ended) throw new SyntaxError('Rest parameter must be last formal parameter');
      if (arg.startsWith('...')) ended = true;
    }.bind(this));

    var func = (res[5] ? '' : ' return ') + _restOfExp(part.substring(res[0].length), res[5] ? [/^}/] : [/^[,;\)\}\]]/]);

    ctx.lispTree = lispify(part.substring(res[0].length + func.length + 1), expectTypes[expect].next, new Lisp({
      op: 'arrowFunc',
      a: args,
      b: Sandbox.parse(func, null).tree
    }));
  }.bind(undefined));
  var lastType;

  function lispify(part, expected, lispTree) {
    expected = expected || ['initialize', 'expStart', 'value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore', 'expEnd'];
    if (part === undefined) return lispTree;

    if (!part.length && !expected.includes('expEnd')) {
      throw new SyntaxError("Unexpected end of expression");
    }

    var ctx = {
      lispTree: lispTree
    };
    var res;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = expected[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var expect = _step4.value;

        if (expect === 'expEnd') {
          continue;
        }

        for (var type in expectTypes[expect].types) {
          if (type === 'expEnd') {
            continue;
          }

          if (res = expectTypes[expect].types[type].exec(part)) {
            lastType = type;
            lispTypes.get(type)(type, part, res, expect, ctx);
            break;
          }
        }

        if (res) break;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    if (!res && part.length) {
      throw Error("Unexpected token (".concat(lastType, "): ").concat(part));
    }

    return ctx.lispTree;
  }

  function exec(tree, scope, context) {
    var _this14 = this;

    if (tree instanceof Prop) {
      return tree.context[tree.prop];
    }

    if (Array.isArray(tree)) {
      return tree.map(function (item) {
        _newArrowCheck(this, _this14);

        return exec(item, scope, context);
      }.bind(this));
    }

    if (!(tree instanceof Lisp)) {
      return tree;
    }

    if (tree.op === 'arrowFunc') {
      return ops.get(tree.op)(tree.a, tree.b, undefined, context, scope);
    }

    var obj = exec(tree.a, scope, context);
    var a = obj instanceof Prop ? obj.context ? obj.context[obj.prop] : undefined : obj;
    var bobj = exec(tree.b, scope, context);
    var b = bobj instanceof Prop ? bobj.context ? bobj.context[bobj.prop] : undefined : bobj;

    if (ops.has(tree.op)) {
      var res = ops.get(tree.op)(a, b, obj, context, scope, bobj);
      return res;
    }

    throw new SyntaxError('Unknown operator: ' + tree.op);
  }

  var Sandbox = /*#__PURE__*/function () {
    function Sandbox() {
      var globals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Sandbox.SAFE_GLOBALS;
      var prototypeWhitelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Sandbox.SAFE_PROTOTYPES;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        audit: false
      };

      _classCallCheck(this, Sandbox);

      var sandboxGlobal = new SandboxGlobal(globals);
      this.context = {
        sandbox: this,
        globals: globals,
        prototypeWhitelist: prototypeWhitelist,
        globalsWhitelist: new Set(Object.values(globals)),
        options: options,
        globalScope: new Scope(null, globals, sandboxGlobal),
        sandboxGlobal: sandboxGlobal,
        replacements: new Map()
      };
      var func = sandboxFunction(this.context);
      this.context.replacements.set(Function, func);
      this.context.replacements.set(eval, sandboxedEval(func));
      this.context.replacements.set(setTimeout, sandboxedSetTimeout(func));
      this.context.replacements.set(setInterval, sandboxedSetInterval(func));
    }

    _createClass(Sandbox, [{
      key: "executeTree",
      value: function executeTree(executionTree) {
        var _this15 = this;

        var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var execTree = executionTree.tree;

        var contextb = _objectSpread2({}, this.context, {
          strings: executionTree.strings,
          literals: executionTree.literals
        });

        var scope = this.context.globalScope;
        var s;

        while (s = scopes.shift()) {
          if (_typeof(s) !== "object") continue;

          if (s instanceof Scope) {
            scope = s;
          } else {
            scope = new Scope(scope, s);
          }
        }

        var context = Object.assign({}, contextb);

        if (contextb.options.audit) {
          context.auditReport = {
            globalsAccess: new Set(),
            prototypeAccess: {}
          };
        }

        var returned = false;
        var res;
        if (!(execTree instanceof Array)) throw new SyntaxError('Bad execution tree');
        execTree.map(function (tree) {
          _newArrowCheck(this, _this15);

          if (!returned) {
            var r;

            try {
              r = exec(tree, scope, context);
            } catch (e) {
              throw new e.constructor(e.message);
            }

            if (tree instanceof Lisp && tree.op === 'return') {
              returned = true;
              res = r;
            }
          }

          return null;
        }.bind(this));
        res = res instanceof Prop ? res.context[res.prop] : res;
        return {
          auditReport: context.auditReport,
          result: res
        };
      }
    }, {
      key: "compile",
      value: function compile(code) {
        var _this16 = this;

        var executionTree = Sandbox.parse(code);
        return function () {
          _newArrowCheck(this, _this16);

          for (var _len7 = arguments.length, scopes = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            scopes[_key7] = arguments[_key7];
          }

          return this.executeTree(executionTree, scopes).result;
        }.bind(this);
      }
    }], [{
      key: "audit",
      value: function audit(code) {
        var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var allowed = new Map();
        return new Sandbox(globalThis, allowed, {
          audit: true
        }).executeTree(Sandbox.parse(code), scopes);
      }
    }, {
      key: "parse",
      value: function parse(code) {
        var _this17 = this;

        var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var literals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        if (typeof code !== 'string') throw new ParseError("Cannot parse ".concat(code), code); // console.log('parse', str);

        var str = code;
        var quote;
        var extract = "";
        var escape = false;
        var js = [];
        var currJs = [];

        if (strings) {
          var extractSkip = 0;

          for (var i = 0; i < str.length; i++) {
            var _char2 = str[i];

            if (escape) {
              if (_char2 === "$" && quote === '`') {
                extractSkip--;
                _char2 = '$$';
              } else if (_char2 === 'u') {
                var reg = /^[a-fA-F\d]{2,4}/.exec(str.substring(i + 1));
                var num = void 0;

                if (!reg) {
                  num = Array.from(/^{[a-fA-F\d]+}/.exec(str.substring(i + 1)) || [""]);
                } else {
                  num = Array.from(reg);
                }

                _char2 = JSON.parse("\"\\u".concat(num[0], "\""));
                str = str.substring(0, i - 1) + _char2 + str.substring(i + (1 + num[0].length));
                i -= 1;
              } else if (_char2 != '`') {
                _char2 = JSON.parse("\"\\".concat(_char2, "\""));
              }
            } else if (_char2 === '$' && quote === '`' && str[i + 1] !== '{') {
              extractSkip--;
              _char2 = '$$';
            }

            if (quote === "`" && _char2 === "$" && str[i + 1] === "{") {
              var skip = _restOfExp(str.substring(i + 2), [/^}/]);

              currJs.push(skip);
              extractSkip += skip.length + 3;
              extract += "${".concat(currJs.length - 1, "}");
              i += skip.length + 2;
            } else if (!quote && (_char2 === "'" || _char2 === '"' || _char2 === '`') && !escape) {
              currJs = [];
              extractSkip = 0;
              quote = _char2;
            } else if (quote === _char2 && !escape) {
              var len = void 0;

              if (quote === '`') {
                literals.push({
                  op: 'literal',
                  a: extract,
                  b: currJs
                });
                js.push(currJs);
                str = str.substring(0, i - extractSkip - 1) + "`".concat(literals.length - 1, "`") + str.substring(i + 1);
                len = (literals.length - 1).toString().length;
              } else {
                strings.push(extract);
                str = str.substring(0, i - extract.length - 1) + "\"".concat(strings.length - 1, "\"") + str.substring(i + 1);
                len = (strings.length - 1).toString().length;
              }

              quote = null;
              i -= extract.length - len;
              extract = "";
            } else if (quote && !(!escape && _char2 === "\\")) {
              extractSkip += escape ? 1 + _char2.length : _char2.length;
              extract += _char2;
            }

            escape = quote && !escape && _char2 === "\\";
          }

          str = str.replace(/([^\w_$]|^)((var|let|const|typeof|return|instanceof|in)(?=[^\w_$]|$))/g, function (match, start, keyword) {
            _newArrowCheck(this, _this17);

            if (keyword.length !== keyword.trim().length) throw new Error(keyword);
            return "".concat(start, "#").concat(keyword, "#");
          }.bind(this)).replace(/\s/g, "").replace(/#/g, " ");
          js.forEach(function (j) {
            var _this18 = this;

            _newArrowCheck(this, _this17);

            var a = j.map(function (skip) {
              _newArrowCheck(this, _this18);

              return this.parse(skip, strings, literals).tree[0];
            }.bind(this));
            j.length = 0;
            j.push.apply(j, _toConsumableArray(a));
          }.bind(this));
        }

        var parts = [];
        var part;
        var pos = 0;

        while (part = _restOfExp(str.substring(pos), [/^;/])) {
          parts.push(part);
          pos += part.length + 1;
        }

        parts = parts.filter(Boolean);
        var tree = parts.filter(function (str) {
          _newArrowCheck(this, _this17);

          return str.length;
        }.bind(this)).map(function (str) {
          _newArrowCheck(this, _this17);

          try {
            return lispify(str);
          } catch (e) {
            // throw e;
            throw new ParseError(e.message, str);
          }
        }.bind(this));
        return {
          tree: tree,
          strings: strings,
          literals: literals
        };
      }
    }, {
      key: "SAFE_GLOBALS",
      get: function get() {
        return {
          Function: Function,
          console: console,
          isFinite: isFinite,
          isNaN: isNaN,
          parseFloat: parseFloat,
          parseInt: parseInt,
          decodeURI: decodeURI,
          decodeURIComponent: decodeURIComponent,
          encodeURI: encodeURI,
          encodeURIComponent: encodeURIComponent,
          escape: escape,
          unescape: unescape,
          Boolean: Boolean,
          Number: Number,
          String: String,
          Object: Object,
          Array: Array,
          Symbol: Symbol,
          Error: Error,
          EvalError: EvalError,
          RangeError: RangeError,
          ReferenceError: ReferenceError,
          SyntaxError: SyntaxError,
          TypeError: TypeError,
          URIError: URIError,
          Int8Array: Int8Array,
          Uint8Array: Uint8Array,
          Uint8ClampedArray: Uint8ClampedArray,
          Int16Array: Int16Array,
          Uint16Array: Uint16Array,
          Int32Array: Int32Array,
          Uint32Array: Uint32Array,
          Float32Array: Float32Array,
          Float64Array: Float64Array,
          Map: Map,
          Set: Set,
          WeakMap: WeakMap,
          WeakSet: WeakSet,
          Promise: Promise,
          Intl: Intl,
          JSON: JSON,
          Math: Math
        };
      }
    }, {
      key: "SAFE_PROTOTYPES",
      get: function get() {
        var _this19 = this;

        var protos = [SandboxGlobal, Function, Boolean, Number, String, Date, RegExp, Error, Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, Map, Set, WeakMap, WeakSet, Promise];
        var map = new Map();
        protos.forEach(function (proto) {
          _newArrowCheck(this, _this19);

          map.set(proto, new Set());
        }.bind(this));
        map.set(Object, new Set(['entries', 'fromEntries', 'getOwnPropertyNames', 'is', 'keys', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'values']));
        return map;
      }
    }]);

    return Sandbox;
  }();

  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts

  function domReady() {
    var _this = this;

    return new Promise(function (resolve) {
      _newArrowCheck(this, _this);

      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    }.bind(this));
  }
  function arrayUnique(array) {
    var a = array.concat();

    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  }
  function isTesting() {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase();
  }
  function walk(el, callback) {
    if (callback(el) === false) return;
    var node = el.firstElementChild;

    while (node) {
      walk(node, callback);
      node = node.nextElementSibling;
    }
  }
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  var allowedGlobals = Sandbox.SAFE_GLOBALS;
  var allowedPrototypes = Sandbox.SAFE_PROTOTYPES;
  allowedPrototypes.set(CustomEvent, new Set());
  allowedPrototypes.set(Element, new Set());
  allowedPrototypes.set(Event, new Set());
  allowedPrototypes.set(EventTarget, new Set());
  var sandbox = new Sandbox(allowedGlobals, allowedPrototypes);
  var expressionCache = new WeakMap();

  function getExecutionTree(el, code) {
    var cache = expressionCache.get(el);

    if (!cache) {
      cache = {};
      expressionCache.set(el, cache);
    }

    if (!cache[code]) {
      cache[code] = sandbox.compile(code);
    }

    return cache[code];
  }

  function saferEval(el, expression, dataContext) {
    var additionalHelperVariables = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var code = "return ".concat(expression, ";");
    var exec = getExecutionTree(el, code);
    return exec(window, dataContext, additionalHelperVariables);
  }
  function saferEvalNoReturn(el, expression, dataContext) {
    var additionalHelperVariables = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
    // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.
    if (Object.keys(dataContext).includes(expression)) {
      var methodReference = dataContext[expression];

      if (typeof methodReference === 'function') {
        return methodReference.call(dataContext, additionalHelperVariables['$event']);
      }

      return methodReference;
    }

    var code = "".concat(expression);
    var exec = getExecutionTree(el, code);
    return exec(window, dataContext, additionalHelperVariables);
  }
  var xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)\b/;
  function isXAttr(attr) {
    var name = replaceAtAndColonWithStandardSyntax(attr.name);
    return xAttrRE.test(name);
  }
  function getXAttrs(el, type) {
    var _this2 = this;

    return Array.from(el.attributes).filter(isXAttr).map(function (attr) {
      var _this3 = this;

      _newArrowCheck(this, _this2);

      var name = replaceAtAndColonWithStandardSyntax(attr.name);
      var typeMatch = name.match(xAttrRE);
      var valueMatch = name.match(/:([a-zA-Z\-:]+)/);
      var modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map(function (i) {
          _newArrowCheck(this, _this3);

          return i.replace('.', '');
        }.bind(this)),
        expression: attr.value
      };
    }.bind(this)).filter(function (i) {
      _newArrowCheck(this, _this2);

      // If no type is passed in for filtering, bypass filter
      if (!type) return true;
      return i.type === type;
    }.bind(this));
  }
  function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    var booleanAttributes = ['disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected', 'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen', 'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer', 'nomodule'];
    return booleanAttributes.includes(attrName);
  }
  function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
      return name.replace('@', 'x-on:');
    } else if (name.startsWith(':')) {
      return name.replace(':', 'x-bind:');
    }

    return name;
  }
  function transitionIn(el, show) {
    var _this4 = this;

    var forceSkip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // We don't want to transition on the initial page load.
    if (forceSkip) return show();
    var attrs = getXAttrs(el, 'transition');
    var showAttr = getXAttrs(el, 'show')[0]; // If this is triggered by a x-show.transition.

    if (showAttr && showAttr.modifiers.includes('transition')) {
      var modifiers = showAttr.modifiers; // If x-show.transition.out, we'll skip the "in" transition.

      if (modifiers.includes('out') && !modifiers.includes('in')) return show();
      var settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out'); // If x-show.transition.in...out... only use "in" related modifiers for this transition.

      modifiers = settingBothSidesOfTransition ? modifiers.filter(function (i, index) {
        _newArrowCheck(this, _this4);

        return index < modifiers.indexOf('out');
      }.bind(this)) : modifiers;
      transitionHelperIn(el, modifiers, show); // Otherwise, we can assume x-transition:enter.
    } else if (attrs.length > 0) {
      transitionClassesIn(el, attrs, show);
    } else {
      // If neither, just show that damn thing.
      show();
    }
  }
  function transitionOut(el, hide) {
    var _this5 = this;

    var forceSkip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (forceSkip) return hide();
    var attrs = getXAttrs(el, 'transition');
    var showAttr = getXAttrs(el, 'show')[0];

    if (showAttr && showAttr.modifiers.includes('transition')) {
      var modifiers = showAttr.modifiers;
      if (modifiers.includes('in') && !modifiers.includes('out')) return hide();
      var settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out');
      modifiers = settingBothSidesOfTransition ? modifiers.filter(function (i, index) {
        _newArrowCheck(this, _this5);

        return index > modifiers.indexOf('out');
      }.bind(this)) : modifiers;
      transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide);
    } else if (attrs.length > 0) {
      transitionClassesOut(el, attrs, hide);
    } else {
      hide();
    }
  }
  function transitionHelperIn(el, modifiers, showCallback) {
    var _this6 = this;

    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    var styleValues = {
      duration: modifierValue(modifiers, 'duration', 150),
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      },
      second: {
        opacity: 1,
        scale: 100
      }
    };
    transitionHelper(el, modifiers, showCallback, function () {
      _newArrowCheck(this, _this6);
    }.bind(this), styleValues);
  }
  function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback) {
    var _this7 = this;

    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    var duration = settingBothSidesOfTransition ? modifierValue(modifiers, 'duration', 150) : modifierValue(modifiers, 'duration', 150) / 2;
    var styleValues = {
      duration: duration,
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 1,
        scale: 100
      },
      second: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      }
    };
    transitionHelper(el, modifiers, function () {
      _newArrowCheck(this, _this7);
    }.bind(this), hideCallback, styleValues);
  }

  function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback; // If it IS present, grab the value after it: x-show.transition.duration.500ms

    var rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue) return fallback;

    if (key === 'scale') {
      // Check if the very next value is NOT a number and return the fallback.
      // If x-show.transition.scale, we'll use the default scale value.
      // That is how a user opts out of the opacity transition.
      if (!isNumeric(rawValue)) return fallback;
    }

    if (key === 'duration') {
      // Support x-show.transition.duration.500ms && duration.500
      var match = rawValue.match(/([0-9]+)ms/);
      if (match) return match[1];
    }

    if (key === 'origin') {
      // Support chaining origin directions: x-show.transition.top.right
      if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ');
      }
    }

    return rawValue;
  }

  function transitionHelper(el, modifiers, hook1, hook2, styleValues) {
    // If the user set these style values, we'll put them back when we're done with them.
    var opacityCache = el.style.opacity;
    var transformCache = el.style.transform;
    var transformOriginCache = el.style.transformOrigin; // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.

    var noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale');
    var transitionOpacity = noModifiers || modifiers.includes('opacity');
    var transitionScale = noModifiers || modifiers.includes('scale'); // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.

    var stages = {
      start: function start() {
        if (transitionOpacity) el.style.opacity = styleValues.first.opacity;
        if (transitionScale) el.style.transform = "scale(".concat(styleValues.first.scale / 100, ")");
      },
      during: function during() {
        if (transitionScale) el.style.transformOrigin = styleValues.origin;
        el.style.transitionProperty = [transitionOpacity ? "opacity" : "", transitionScale ? "transform" : ""].join(' ').trim();
        el.style.transitionDuration = "".concat(styleValues.duration / 1000, "s");
        el.style.transitionTimingFunction = "cubic-bezier(0.4, 0.0, 0.2, 1)";
      },
      show: function show() {
        hook1();
      },
      end: function end() {
        if (transitionOpacity) el.style.opacity = styleValues.second.opacity;
        if (transitionScale) el.style.transform = "scale(".concat(styleValues.second.scale / 100, ")");
      },
      hide: function hide() {
        hook2();
      },
      cleanup: function cleanup() {
        if (transitionOpacity) el.style.opacity = opacityCache;
        if (transitionScale) el.style.transform = transformCache;
        if (transitionScale) el.style.transformOrigin = transformOriginCache;
        el.style.transitionProperty = null;
        el.style.transitionDuration = null;
        el.style.transitionTimingFunction = null;
      }
    };
    transition(el, stages);
  }
  function transitionClassesIn(el, directives, showCallback) {
    var _this8 = this;

    var enter = (directives.find(function (i) {
      _newArrowCheck(this, _this8);

      return i.value === 'enter';
    }.bind(this)) || {
      expression: ''
    }).expression.split(' ').filter(function (i) {
      _newArrowCheck(this, _this8);

      return i !== '';
    }.bind(this));
    var enterStart = (directives.find(function (i) {
      _newArrowCheck(this, _this8);

      return i.value === 'enter-start';
    }.bind(this)) || {
      expression: ''
    }).expression.split(' ').filter(function (i) {
      _newArrowCheck(this, _this8);

      return i !== '';
    }.bind(this));
    var enterEnd = (directives.find(function (i) {
      _newArrowCheck(this, _this8);

      return i.value === 'enter-end';
    }.bind(this)) || {
      expression: ''
    }).expression.split(' ').filter(function (i) {
      _newArrowCheck(this, _this8);

      return i !== '';
    }.bind(this));
    transitionClasses(el, enter, enterStart, enterEnd, showCallback, function () {
      _newArrowCheck(this, _this8);
    }.bind(this));
  }
  function transitionClassesOut(el, directives, hideCallback) {
    var _this9 = this;

    var leave = (directives.find(function (i) {
      _newArrowCheck(this, _this9);

      return i.value === 'leave';
    }.bind(this)) || {
      expression: ''
    }).expression.split(' ').filter(function (i) {
      _newArrowCheck(this, _this9);

      return i !== '';
    }.bind(this));
    var leaveStart = (directives.find(function (i) {
      _newArrowCheck(this, _this9);

      return i.value === 'leave-start';
    }.bind(this)) || {
      expression: ''
    }).expression.split(' ').filter(function (i) {
      _newArrowCheck(this, _this9);

      return i !== '';
    }.bind(this));
    var leaveEnd = (directives.find(function (i) {
      _newArrowCheck(this, _this9);

      return i.value === 'leave-end';
    }.bind(this)) || {
      expression: ''
    }).expression.split(' ').filter(function (i) {
      _newArrowCheck(this, _this9);

      return i !== '';
    }.bind(this));
    transitionClasses(el, leave, leaveStart, leaveEnd, function () {
      _newArrowCheck(this, _this9);
    }.bind(this), hideCallback);
  }
  function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2) {
    var originalClasses = el.__x_original_classes || [];
    var stages = {
      start: function start() {
        var _el$classList;

        (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(classesStart));
      },
      during: function during() {
        var _el$classList2;

        (_el$classList2 = el.classList).add.apply(_el$classList2, _toConsumableArray(classesDuring));
      },
      show: function show() {
        hook1();
      },
      end: function end() {
        var _el$classList3,
            _this10 = this,
            _el$classList4;

        // Don't remove classes that were in the original class attribute.
        (_el$classList3 = el.classList).remove.apply(_el$classList3, _toConsumableArray(classesStart.filter(function (i) {
          _newArrowCheck(this, _this10);

          return !originalClasses.includes(i);
        }.bind(this))));

        (_el$classList4 = el.classList).add.apply(_el$classList4, _toConsumableArray(classesEnd));
      },
      hide: function hide() {
        hook2();
      },
      cleanup: function cleanup() {
        var _el$classList5,
            _this11 = this,
            _el$classList6;

        (_el$classList5 = el.classList).remove.apply(_el$classList5, _toConsumableArray(classesDuring.filter(function (i) {
          _newArrowCheck(this, _this11);

          return !originalClasses.includes(i);
        }.bind(this))));

        (_el$classList6 = el.classList).remove.apply(_el$classList6, _toConsumableArray(classesEnd.filter(function (i) {
          _newArrowCheck(this, _this11);

          return !originalClasses.includes(i);
        }.bind(this))));
      }
    };
    transition(el, stages);
  }
  function transition(el, stages) {
    var _this12 = this;

    stages.start();
    stages.during();
    requestAnimationFrame(function () {
      var _this13 = this;

      _newArrowCheck(this, _this12);

      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      var duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;
      stages.show();
      requestAnimationFrame(function () {
        var _this14 = this;

        _newArrowCheck(this, _this13);

        stages.end();
        setTimeout(function () {
          _newArrowCheck(this, _this14);

          stages.hide(); // Adding an "isConnected" check, in case the callback
          // removed the element from the DOM.

          if (el.isConnected) {
            stages.cleanup();
          }
        }.bind(this), duration);
      }.bind(this));
    }.bind(this));
  }
  function isNumeric(subject) {
    return !isNaN(subject);
  }

  function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    var _this = this;

    warnIfNotTemplateTag(templateEl);
    var iteratorNames = parseForExpression(expression);
    var items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars); // As we walk the array, we'll also walk the DOM (updating/creating as we go).

    var currentEl = templateEl;
    items.forEach(function (item, index) {
      var _this2 = this;

      _newArrowCheck(this, _this);

      var iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items);
      var currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables);
      var nextEl = currentEl.nextElementSibling; // If there's no previously x-for processed element ahead, add one.

      if (!nextEl || nextEl.__x_for_key === undefined) {
        nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl); // And transition it in if it's not the first page load.

        transitionIn(nextEl, function () {
          _newArrowCheck(this, _this2);
        }.bind(this), initialUpdate);
        nextEl.__x_for = iterationScopeVariables;
        component.initializeElements(nextEl, function () {
          _newArrowCheck(this, _this2);

          return nextEl.__x_for;
        }.bind(this));
      } else {
        nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey); // Temporarily remove the key indicator to allow the normal "updateElements" to work

        delete nextEl.__x_for_key;
        nextEl.__x_for = iterationScopeVariables;
        component.updateElements(nextEl, function () {
          _newArrowCheck(this, _this2);

          return nextEl.__x_for;
        }.bind(this));
      }

      currentEl = nextEl;
      currentEl.__x_for_key = currentKey;
    }.bind(this));
    removeAnyLeftOverElementsFromPreviousUpdate(currentEl);
  } // This was taken from VueJS 2.* core. Thanks Vue!

  function parseForExpression(expression) {
    var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    var stripParensRE = /^\(|\)$/g;
    var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    var inMatch = expression.match(forAliasRE);
    if (!inMatch) return;
    var res = {};
    res.items = inMatch[2].trim();
    var item = inMatch[1].trim().replace(stripParensRE, '');
    var iteratorMatch = item.match(forIteratorRE);

    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, '').trim();
      res.index = iteratorMatch[1].trim();

      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }

    return res;
  }

  function getIterationScopeVariables(iteratorNames, item, index, items) {
    var scopeVariables = _defineProperty({}, iteratorNames.item, item);

    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }

  function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    var _this3 = this;

    var bindKeyAttribute = getXAttrs(el, 'bind').filter(function (attr) {
      _newArrowCheck(this, _this3);

      return attr.value === 'key';
    }.bind(this))[0]; // If the dev hasn't specified a key, just return the index of the iteration.

    if (!bindKeyAttribute) return index;
    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, function () {
      _newArrowCheck(this, _this3);

      return iterationScopeVariables;
    }.bind(this));
  }

  function warnIfNotTemplateTag(el) {
    if (el.tagName.toLowerCase() !== 'template') console.warn('Alpine: [x-for] directive should only be added to <template> tags.');
  }

  function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    var ifAttribute = getXAttrs(el, 'if')[0];

    if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
      return [];
    }

    return component.evaluateReturnExpression(el, iteratorNames.items, extraVars);
  }

  function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    var clone = document.importNode(templateEl.content, true);
    if (clone.childElementCount !== 1) console.warn('Alpine: <template> tag with [x-for] encountered with multiple element roots. Make sure <template> only has a single child node.');
    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
    return currentEl.nextElementSibling;
  }

  function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    // If the the key's DO match, no need to look ahead.
    if (nextEl.__x_for_key === currentKey) return nextEl; // If the don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.

    var tmpNextEl = nextEl;

    while (tmpNextEl) {
      if (tmpNextEl.__x_for_key === currentKey) {
        return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
      }

      tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined ? tmpNextEl.nextElementSibling : false;
    }
  }

  function removeAnyLeftOverElementsFromPreviousUpdate(currentEl) {
    var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined ? currentEl.nextElementSibling : false;

    var _loop = function _loop() {
      var _this4 = this;

      var nextElementFromOldLoopImmutable = nextElementFromOldLoop;
      var nextSibling = nextElementFromOldLoop.nextElementSibling;
      transitionOut(nextElementFromOldLoop, function () {
        _newArrowCheck(this, _this4);

        nextElementFromOldLoopImmutable.remove();
      }.bind(this));
      nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== undefined ? nextSibling : false;
    };

    while (nextElementFromOldLoop) {
      _loop();
    }
  }

  function handleAttributeBindingDirective(component, el, attrName, expression, extraVars) {
    var _this = this;

    var value = component.evaluateReturnExpression(el, expression, extraVars);

    if (attrName === 'value') {
      // If nested model key is undefined, set the default value to empty string.
      if (value === undefined && expression.match(/\./).length) {
        value = '';
      }

      if (el.type === 'radio') {
        el.checked = el.value == value;
      } else if (el.type === 'checkbox') {
        if (Array.isArray(value)) {
          // I'm purposely not using Array.includes here because it's
          // strict, and because of Numeric/String mis-casting, I
          // want the "includes" to be "fuzzy".
          var valueFound = false;
          value.forEach(function (val) {
            _newArrowCheck(this, _this);

            if (val == el.value) {
              valueFound = true;
            }
          }.bind(this));
          el.checked = valueFound;
        } else {
          el.checked = !!value;
        } // If we are explicitly binding a string to the :value, set the string,
        // If the value is a boolean, leave it alone, it will be set to "on"
        // automatically.


        if (typeof value === 'string') {
          el.value = value;
        }
      } else if (el.tagName === 'SELECT') {
        updateSelect(el, value);
      } else {
        el.value = value;
      }
    } else if (attrName === 'class') {
      if (Array.isArray(value)) {
        var originalClasses = el.__x_original_classes || [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '));
      } else if (_typeof(value) === 'object') {
        Object.keys(value).forEach(function (classNames) {
          var _this2 = this;

          _newArrowCheck(this, _this);

          if (value[classNames]) {
            classNames.split(' ').forEach(function (className) {
              _newArrowCheck(this, _this2);

              return el.classList.add(className);
            }.bind(this));
          } else {
            classNames.split(' ').forEach(function (className) {
              _newArrowCheck(this, _this2);

              return el.classList.remove(className);
            }.bind(this));
          }
        }.bind(this));
      } else {
        var _originalClasses = el.__x_original_classes || [];

        var newClasses = value.split(' ');
        el.setAttribute('class', arrayUnique(_originalClasses.concat(newClasses)).join(' '));
      }
    } else if (isBooleanAttr(attrName)) {
      // Boolean attributes have to be explicitly added and removed, not just set.
      if (!!value) {
        el.setAttribute(attrName, '');
      } else {
        el.removeAttribute(attrName);
      }
    } else {
      el.setAttribute(attrName, value);
    }
  }

  function updateSelect(el, value) {
    var _this3 = this;

    var arrayWrappedValue = [].concat(value).map(function (value) {
      _newArrowCheck(this, _this3);

      return value + '';
    }.bind(this));
    Array.from(el.options).forEach(function (option) {
      _newArrowCheck(this, _this3);

      option.selected = arrayWrappedValue.includes(option.value || option.text);
    }.bind(this));
  }

  function handleShowDirective(component, el, value, modifiers) {
    var _this = this;

    var initialUpdate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    var hide = function hide() {
      _newArrowCheck(this, _this);

      el.style.display = 'none';
    }.bind(this);

    var show = function show() {
      _newArrowCheck(this, _this);

      if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style');
      } else {
        el.style.removeProperty('display');
      }
    }.bind(this);

    if (initialUpdate === true) {
      if (value) {
        show();
      } else {
        hide();
      }

      return;
    }

    var handle = function handle(resolve) {
      var _this2 = this;

      _newArrowCheck(this, _this);

      if (!value) {
        if (el.style.display !== 'none') {
          transitionOut(el, function () {
            var _this3 = this;

            _newArrowCheck(this, _this2);

            resolve(function () {
              _newArrowCheck(this, _this3);

              hide();
            }.bind(this));
          }.bind(this));
        } else {
          resolve(function () {
            _newArrowCheck(this, _this2);
          }.bind(this));
        }
      } else {
        if (el.style.display !== '') {
          transitionIn(el, function () {
            _newArrowCheck(this, _this2);

            show();
          }.bind(this));
        } // Resolve immediately, only hold up parent `x-show`s for hidin.


        resolve(function () {
          _newArrowCheck(this, _this2);
        }.bind(this));
      }
    }.bind(this); // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.
    // If x-show.immediate, foregoe the waiting.


    if (modifiers.includes('immediate')) {
      handle(function (finish) {
        _newArrowCheck(this, _this);

        return finish();
      }.bind(this));
      return;
    } // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).


    if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
      component.executeAndClearRemainingShowDirectiveStack();
    } // We'll push the handler onto a stack to be handled later.


    component.showDirectiveStack.push(handle);
    component.showDirectiveLastElement = el;
  }

  function handleIfDirective(component, el, expressionResult, initialUpdate, extraVars) {
    var _this = this;

    if (el.nodeName.toLowerCase() !== 'template') console.warn("Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if");
    var elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

    if (expressionResult && !elementHasAlreadyBeenAdded) {
      var clone = document.importNode(el.content, true);
      el.parentElement.insertBefore(clone, el.nextElementSibling);
      transitionIn(el.nextElementSibling, function () {
        _newArrowCheck(this, _this);
      }.bind(this), initialUpdate);
      component.initializeElements(el.nextElementSibling, extraVars);
      el.nextElementSibling.__x_inserted_me = true;
    } else if (!expressionResult && elementHasAlreadyBeenAdded) {
      transitionOut(el.nextElementSibling, function () {
        _newArrowCheck(this, _this);

        el.nextElementSibling.remove();
      }.bind(this), initialUpdate);
    }
  }

  function registerListener(component, el, event, modifiers, expression) {
    var _this = this;

    var extraVars = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    if (modifiers.includes('away')) {
      var _handler = function handler(e) {
        _newArrowCheck(this, _this);

        // Don't do anything if the click came form the element or within it.
        if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

        if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
        // is from outside it, let's run the expression.

        runListenerHandler(component, expression, e, extraVars);

        if (modifiers.includes('once')) {
          document.removeEventListener(event, _handler);
        }
      }.bind(this); // Listen for this event at the root level.


      document.addEventListener(event, _handler);
    } else {
      var listenerTarget = modifiers.includes('window') ? window : modifiers.includes('document') ? document : el;

      var _handler2 = function handler(e) {
        _newArrowCheck(this, _this);

        // Remove this global event handler if the element that declared it
        // has been removed. It's now stale.
        if (listenerTarget === window || listenerTarget === document) {
          if (!document.body.contains(el)) {
            listenerTarget.removeEventListener(event, _handler2);
            return;
          }
        }

        if (isKeyEvent(event)) {
          if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
            return;
          }
        }

        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('stop')) e.stopPropagation();
        var returnValue = runListenerHandler(component, expression, e, extraVars);

        if (returnValue === false) {
          e.preventDefault();
        } else {
          if (modifiers.includes('once')) {
            listenerTarget.removeEventListener(event, _handler2);
          }
        }
      }.bind(this);

      if (modifiers.includes('debounce')) {
        var nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait';
        var wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250;
        _handler2 = debounce(_handler2, wait);
      }

      listenerTarget.addEventListener(event, _handler2);
    }
  }

  function runListenerHandler(component, expression, e, extraVars) {
    var _this2 = this;

    return component.evaluateCommandExpression(e.target, expression, function () {
      _newArrowCheck(this, _this2);

      return _objectSpread2({}, extraVars(), {
        '$event': e
      });
    }.bind(this));
  }

  function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event);
  }

  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    var _this3 = this;

    var keyModifiers = modifiers.filter(function (i) {
      _newArrowCheck(this, _this3);

      return !['window', 'document', 'prevent', 'stop'].includes(i);
    }.bind(this));

    if (keyModifiers.includes('debounce')) {
      var debounceIndex = keyModifiers.indexOf('debounce');
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    } // If no modifier is specified, we'll call it a press.


    if (keyModifiers.length === 0) return false; // If one is passed, AND it matches the key pressed, we'll call it a press.

    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false; // The user is listening for key combinations.

    var systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'];
    var selectedSystemKeyModifiers = systemKeyModifiers.filter(function (modifier) {
      _newArrowCheck(this, _this3);

      return keyModifiers.includes(modifier);
    }.bind(this));
    keyModifiers = keyModifiers.filter(function (i) {
      _newArrowCheck(this, _this3);

      return !selectedSystemKeyModifiers.includes(i);
    }.bind(this));

    if (selectedSystemKeyModifiers.length > 0) {
      var activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(function (modifier) {
        _newArrowCheck(this, _this3);

        // Alias "cmd" and "super" to "meta"
        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta';
        return e["".concat(modifier, "Key")];
      }.bind(this)); // If all the modifiers selected are pressed, ...

      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        // AND the remaining key is pressed as well. It's a press.
        if (keyModifiers[0] === keyToModifier(e.key)) return false;
      }
    } // We'll call it NOT a valid keypress.


    return true;
  }

  function keyToModifier(key) {
    switch (key) {
      case '/':
        return 'slash';

      case ' ':
      case 'Spacebar':
        return 'space';

      default:
        return kebabCase(key);
    }
  }

  function registerModelListener(component, el, modifiers, expression, extraVars) {
    var _this = this;

    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = el.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(el.type) || modifiers.includes('lazy') ? 'change' : 'input';
    var listenerExpression = "".concat(expression, " = rightSideOfExpression($event, ").concat(expression, ")");
    registerListener(component, el, event, modifiers, listenerExpression, function () {
      _newArrowCheck(this, _this);

      return _objectSpread2({}, extraVars(), {
        rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
      });
    }.bind(this));
  }

  function generateModelAssignmentFunction(el, modifiers, expression) {
    var _this2 = this;

    if (el.type === 'radio') {
      // Radio buttons only work properly when they share a name attribute.
      // People might assume we take care of that for them, because
      // they already set a shared "x-model" attribute.
      if (!el.hasAttribute('name')) el.setAttribute('name', expression);
    }

    return function (event, currentValue) {
      var _this3 = this;

      _newArrowCheck(this, _this2);

      // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
      if (event instanceof CustomEvent && event.detail) {
        return event.detail;
      } else if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle it's value inside the array.
        if (Array.isArray(currentValue)) {
          return event.target.checked ? currentValue.concat([event.target.value]) : currentValue.filter(function (i) {
            _newArrowCheck(this, _this3);

            return i !== event.target.value;
          }.bind(this));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        return modifiers.includes('number') ? Array.from(event.target.selectedOptions).map(function (option) {
          _newArrowCheck(this, _this3);

          var rawValue = option.value || option.text;
          var number = rawValue ? parseFloat(rawValue) : null;
          return isNaN(number) ? rawValue : number;
        }.bind(this)) : Array.from(event.target.selectedOptions).map(function (option) {
          _newArrowCheck(this, _this3);

          return option.value || option.text;
        }.bind(this));
      } else {
        var rawValue = event.target.value;
        var number = rawValue ? parseFloat(rawValue) : null;
        return modifiers.includes('number') ? isNaN(number) ? rawValue : number : modifiers.includes('trim') ? rawValue.trim() : rawValue;
      }
    }.bind(this);
  }

  // `Reflect.set` method
  // https://tc39.github.io/ecma262/#sec-reflect.set
  function set$3(target, propertyKey, V /* , receiver */) {
    var receiver = arguments.length < 4 ? target : arguments[3];
    var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
    var existingDescriptor, prototype;
    if (!ownDescriptor) {
      if (isObject(prototype = objectGetPrototypeOf(target))) {
        return set$3(prototype, propertyKey, V, receiver);
      }
      ownDescriptor = createPropertyDescriptor(0);
    }
    if (has(ownDescriptor, 'value')) {
      if (ownDescriptor.writable === false || !isObject(receiver)) return false;
      if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
        if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
        existingDescriptor.value = V;
        objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
      } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
      return true;
    }
    return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
  }

  // MS Edge 17-18 Reflect.set allows setting the property to object
  // with non-writable property on the prototype
  var MS_EDGE_BUG = fails(function () {
    var object = objectDefineProperty.f({}, 'a', { configurable: true });
    // eslint-disable-next-line no-undef
    return Reflect.set(objectGetPrototypeOf(object), 'a', 1, object) !== false;
  });

  _export({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
    set: set$3
  });

  function wrap$1(data, mutationCallback) {
    /* IE11-ONLY:START */
    return wrapForIe11(data, mutationCallback);
  }
  function unwrap(membrane, observable) {
    var _this = this;

    var unwrappedData = membrane.unwrapProxy(observable);
    var copy = {};
    Object.keys(unwrappedData).forEach(function (key) {
      _newArrowCheck(this, _this);

      if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return;
      copy[key] = unwrappedData[key];
    }.bind(this));
    return copy;
  }

  function wrapForIe11(data, mutationCallback) {
    var proxyHandler = {
      set: function set(target, key, value) {
        // Set the value converting it to a "Deep Proxy" when required
        // Note that if a project is not a valid object, it won't be converted to a proxy
        var setWasSuccessful = Reflect.set(target, key, deepProxy(value, proxyHandler));
        mutationCallback(target, key);
        return setWasSuccessful;
      },
      get: function get(target, key) {
        // Provide a way to determine if this object is an Alpine proxy or not.
        if (key === "$isAlpineProxy") return true; // Just return the flippin' value. Gawsh.

        return target[key];
      }
    };
    return {
      data: deepProxy(data, proxyHandler),
      membrane: {
        unwrapProxy: function unwrapProxy(proxy) {
          return proxy;
        }
      }
    };
  }

  function deepProxy(target, proxyHandler) {
    // If target is null, return it.
    if (target === null) return target; // If target is not an object, return it.

    if (_typeof(target) !== 'object') return target; // If target is a DOM node (like in the case of this.$el), return it.

    if (target instanceof Node) return target; // If target is already an Alpine proxy, return it.

    if (target['$isAlpineProxy']) return target; // Otherwise proxy the properties recursively.
    // This enables reactivity on setting nested data.
    // Note that if a project is not a valid object, it won't be converted to a proxy

    for (var property in target) {
      target[property] = deepProxy(target[property], proxyHandler);
    }

    return new Proxy(target, proxyHandler);
  }

  var Component = /*#__PURE__*/function () {
    function Component(el) {
      var _this = this;

      var seedDataForCloning = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, Component);

      this.$el = el;
      var dataAttr = this.$el.getAttribute('x-data');
      var dataExpression = dataAttr === '' ? '{}' : dataAttr;
      var initExpression = this.$el.getAttribute('x-init');
      this.unobservedData = seedDataForCloning ? seedDataForCloning : saferEval(el, dataExpression, {});
      /* IE11-ONLY:START */
      // For IE11, add our magic properties to the original data for access.
      // The Proxy polyfill does not allow properties to be added after creation.

      this.unobservedData.$el = null;
      this.unobservedData.$refs = null;
      this.unobservedData.$nextTick = null;
      this.unobservedData.$watch = null;
      /* IE11-ONLY:END */
      // Construct a Proxy-based observable. This will be used to handle reactivity.

      var _this$wrapDataInObser = this.wrapDataInObservable(this.unobservedData),
          membrane = _this$wrapDataInObser.membrane,
          data = _this$wrapDataInObser.data;

      this.$data = data;
      this.membrane = membrane; // After making user-supplied data methods reactive, we can now add
      // our magic properties to the original data for access.

      this.unobservedData.$el = this.$el;
      this.unobservedData.$refs = this.getRefsProxy();
      this.nextTickStack = [];

      this.unobservedData.$nextTick = function (callback) {
        _newArrowCheck(this, _this);

        this.nextTickStack.push(callback);
      }.bind(this);

      this.watchers = {};

      this.unobservedData.$watch = function (property, callback) {
        _newArrowCheck(this, _this);

        if (!this.watchers[property]) this.watchers[property] = [];
        this.watchers[property].push(callback);
      }.bind(this);

      this.showDirectiveStack = [];
      this.showDirectiveLastElement;
      var initReturnedCallback; // If x-init is present AND we aren't cloning (skip x-init on clone)

      if (initExpression && !seedDataForCloning) {
        // We want to allow data manipulation, but not trigger DOM updates just yet.
        // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
        this.pauseReactivity = true;
        initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression);
        this.pauseReactivity = false;
      } // Register all our listeners and set all our attribute bindings.


      this.initializeElements(this.$el); // Use mutation observer to detect new elements being added within this component at run-time.
      // Alpine's just so darn flexible amirite?

      this.listenForNewElementsToInitialize();

      if (typeof initReturnedCallback === 'function') {
        // Run the callback returned form the "x-init" hook to allow the user to do stuff after
        // Alpine's got it's grubby little paws all over everything.
        initReturnedCallback.call(this.$data);
      }
    }

    _createClass(Component, [{
      key: "getUnobservedData",
      value: function getUnobservedData() {
        return unwrap(this.membrane, this.$data);
      }
    }, {
      key: "wrapDataInObservable",
      value: function wrapDataInObservable(data) {
        var _this2 = this;

        var self = this;
        var updateDom = debounce(function () {
          self.updateElements(self.$el);
        }, 0);
        return wrap$1(data, function (target, key) {
          var _this3 = this;

          _newArrowCheck(this, _this2);

          if (self.watchers[key]) {
            // If there's a watcher for this specific key, run it.
            self.watchers[key].forEach(function (callback) {
              _newArrowCheck(this, _this3);

              return callback(target[key]);
            }.bind(this));
          } else {
            // Let's walk through the watchers with "dot-notation" (foo.bar) and see
            // if this mutation fits any of them.
            Object.keys(self.watchers).filter(function (i) {
              _newArrowCheck(this, _this3);

              return i.includes('.');
            }.bind(this)).forEach(function (fullDotNotationKey) {
              var _this4 = this;

              _newArrowCheck(this, _this3);

              var dotNotationParts = fullDotNotationKey.split('.'); // If this dot-notation watcher's last "part" doesn't match the current
              // key, then skip it early for performance reasons.

              if (key !== dotNotationParts[dotNotationParts.length - 1]) return; // Now, walk through the dot-notation "parts" recursively to find
              // a match, and call the watcher if one's found.

              dotNotationParts.reduce(function (comparisonData, part) {
                var _this5 = this;

                _newArrowCheck(this, _this4);

                if (Object.is(target, comparisonData)) {
                  // Run the watchers.
                  self.watchers[fullDotNotationKey].forEach(function (callback) {
                    _newArrowCheck(this, _this5);

                    return callback(target[key]);
                  }.bind(this));
                }

                return comparisonData[part];
              }.bind(this), self.getUnobservedData());
            }.bind(this));
          } // Don't react to data changes for cases like the `x-created` hook.


          if (self.pauseReactivity) return;
          updateDom();
        }.bind(this));
      }
    }, {
      key: "walkAndSkipNestedComponents",
      value: function walkAndSkipNestedComponents(el, callback) {
        var _this6 = this;

        var initializeComponentCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
          _newArrowCheck(this, _this6);
        }.bind(this);
        walk(el, function (el) {
          _newArrowCheck(this, _this6);

          // We've hit a component.
          if (el.hasAttribute('x-data')) {
            // If it's not the current one.
            if (!el.isSameNode(this.$el)) {
              // Initialize it if it's not.
              if (!el.__x) initializeComponentCallback(el); // Now we'll let that sub-component deal with itself.

              return false;
            }
          }

          return callback(el);
        }.bind(this));
      }
    }, {
      key: "initializeElements",
      value: function initializeElements(rootEl) {
        var _this7 = this;

        var extraVars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
          _newArrowCheck(this, _this7);
        }.bind(this);
        this.walkAndSkipNestedComponents(rootEl, function (el) {
          _newArrowCheck(this, _this7);

          // Don't touch spawns from for loop
          if (el.__x_for_key !== undefined) return false; // Don't touch spawns from if directives

          if (el.__x_inserted_me !== undefined) return false;
          this.initializeElement(el, extraVars);
        }.bind(this), function (el) {
          _newArrowCheck(this, _this7);

          el.__x = new Component(el);
        }.bind(this));
        this.executeAndClearRemainingShowDirectiveStack(); // Walk through the $nextTick stack and clear it as we go.

        while (this.nextTickStack.length > 0) {
          this.nextTickStack.shift()();
        }
      }
    }, {
      key: "initializeElement",
      value: function initializeElement(el, extraVars) {
        // To support class attribute merging, we have to know what the element's
        // original class attribute looked like for reference.
        if (el.hasAttribute('class') && getXAttrs(el).length > 0) {
          el.__x_original_classes = el.getAttribute('class').split(' ');
        }

        this.registerListeners(el, extraVars);
        this.resolveBoundAttributes(el, true, extraVars);
      }
    }, {
      key: "updateElements",
      value: function updateElements(rootEl) {
        var _this8 = this;

        var extraVars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
          _newArrowCheck(this, _this8);
        }.bind(this);
        this.walkAndSkipNestedComponents(rootEl, function (el) {
          _newArrowCheck(this, _this8);

          // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
          if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) return false;
          this.updateElement(el, extraVars);
        }.bind(this), function (el) {
          _newArrowCheck(this, _this8);

          el.__x = new Component(el);
        }.bind(this));
        this.executeAndClearRemainingShowDirectiveStack(); // Walk through the $nextTick stack and clear it as we go.

        while (this.nextTickStack.length > 0) {
          this.nextTickStack.shift()();
        }
      }
    }, {
      key: "executeAndClearRemainingShowDirectiveStack",
      value: function executeAndClearRemainingShowDirectiveStack() {
        var _this9 = this;

        // The goal here is to start all the x-show transitions
        // and build a nested promise chain so that elements
        // only hide when the children are finished hiding.
        this.showDirectiveStack.reverse().map(function (thing) {
          var _this10 = this;

          _newArrowCheck(this, _this9);

          return new Promise(function (resolve) {
            var _this11 = this;

            _newArrowCheck(this, _this10);

            thing(function (finish) {
              _newArrowCheck(this, _this11);

              resolve(finish);
            }.bind(this));
          }.bind(this));
        }.bind(this)).reduce(function (nestedPromise, promise) {
          var _this12 = this;

          _newArrowCheck(this, _this9);

          return nestedPromise.then(function () {
            var _this13 = this;

            _newArrowCheck(this, _this12);

            return promise.then(function (finish) {
              _newArrowCheck(this, _this13);

              return finish();
            }.bind(this));
          }.bind(this));
        }.bind(this), Promise.resolve(function () {
          _newArrowCheck(this, _this9);
        }.bind(this))); // We've processed the handler stack. let's clear it.

        this.showDirectiveStack = [];
        this.showDirectiveLastElement = undefined;
      }
    }, {
      key: "updateElement",
      value: function updateElement(el, extraVars) {
        this.resolveBoundAttributes(el, false, extraVars);
      }
    }, {
      key: "registerListeners",
      value: function registerListeners(el, extraVars) {
        var _this14 = this;

        getXAttrs(el).forEach(function (_ref) {
          var type = _ref.type,
              value = _ref.value,
              modifiers = _ref.modifiers,
              expression = _ref.expression;

          _newArrowCheck(this, _this14);

          switch (type) {
            case 'on':
              registerListener(this, el, value, modifiers, expression, extraVars);
              break;

            case 'model':
              registerModelListener(this, el, modifiers, expression, extraVars);
              break;
          }
        }.bind(this));
      }
    }, {
      key: "resolveBoundAttributes",
      value: function resolveBoundAttributes(el) {
        var _this15 = this;

        var initialUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var extraVars = arguments.length > 2 ? arguments[2] : undefined;
        var attrs = getXAttrs(el);
        attrs.forEach(function (_ref2) {
          var _this16 = this;

          var type = _ref2.type,
              value = _ref2.value,
              modifiers = _ref2.modifiers,
              expression = _ref2.expression;

          _newArrowCheck(this, _this15);

          switch (type) {
            case 'model':
              handleAttributeBindingDirective(this, el, 'value', expression, extraVars);
              break;

            case 'bind':
              // The :key binding on an x-for is special, ignore it.
              if (el.tagName.toLowerCase() === 'template' && value === 'key') return;
              handleAttributeBindingDirective(this, el, value, expression, extraVars);
              break;

            case 'text':
              var output = this.evaluateReturnExpression(el, expression, extraVars); // If nested model key is undefined, set the default value to empty string.

              if (output === undefined && expression.match(/\./).length) {
                output = '';
              }

              el.innerText = output;
              break;

            case 'html':
              el.innerHTML = this.evaluateReturnExpression(el, expression, extraVars);
              break;

            case 'show':
              var output = this.evaluateReturnExpression(el, expression, extraVars);
              handleShowDirective(this, el, output, modifiers, initialUpdate);
              break;

            case 'if':
              // If this element also has x-for on it, don't process x-if.
              // We will let the "x-for" directive handle the "if"ing.
              if (attrs.filter(function (i) {
                _newArrowCheck(this, _this16);

                return i.type === 'for';
              }.bind(this)).length > 0) return;
              var output = this.evaluateReturnExpression(el, expression, extraVars);
              handleIfDirective(this, el, output, initialUpdate, extraVars);
              break;

            case 'for':
              handleForDirective(this, el, expression, initialUpdate, extraVars);
              break;

            case 'cloak':
              el.removeAttribute('x-cloak');
              break;
          }
        }.bind(this));
      }
    }, {
      key: "evaluateReturnExpression",
      value: function evaluateReturnExpression(el, expression) {
        var _this17 = this;

        var extraVars = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
          _newArrowCheck(this, _this17);
        }.bind(this);
        return saferEval(el, expression, this.$data, _objectSpread2({}, extraVars(), {
          $dispatch: this.getDispatchFunction(el)
        }));
      }
    }, {
      key: "evaluateCommandExpression",
      value: function evaluateCommandExpression(el, expression) {
        var _this18 = this;

        var extraVars = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
          _newArrowCheck(this, _this18);
        }.bind(this);
        return saferEvalNoReturn(el, expression, this.$data, _objectSpread2({}, extraVars(), {
          $dispatch: this.getDispatchFunction(el)
        }));
      }
    }, {
      key: "getDispatchFunction",
      value: function getDispatchFunction(el) {
        var _this19 = this;

        return function (event) {
          var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          _newArrowCheck(this, _this19);

          el.dispatchEvent(new CustomEvent(event, {
            detail: detail,
            bubbles: true
          }));
        }.bind(this);
      }
    }, {
      key: "listenForNewElementsToInitialize",
      value: function listenForNewElementsToInitialize() {
        var _this20 = this;

        var targetNode = this.$el;
        var observerOptions = {
          childList: true,
          attributes: true,
          subtree: true
        };
        var observer = new MutationObserver(function (mutations) {
          var _this21 = this;

          _newArrowCheck(this, _this20);

          for (var i = 0; i < mutations.length; i++) {
            // Filter out mutations triggered from child components.
            var closestParentComponent = mutations[i].target.closest('[x-data]');
            if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) return;

            if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
              (function () {
                var _this22 = this;

                var rawData = saferEval(mutations[i].target, mutations[i].target.getAttribute('x-data'), {});
                Object.keys(rawData).forEach(function (key) {
                  _newArrowCheck(this, _this22);

                  if (_this21.$data[key] !== rawData[key]) {
                    _this21.$data[key] = rawData[key];
                  }
                }.bind(this));
              })();
            }

            if (mutations[i].addedNodes.length > 0) {
              mutations[i].addedNodes.forEach(function (node) {
                _newArrowCheck(this, _this21);

                if (node.nodeType !== 1 || node.__x_inserted_me) return;

                if (node.matches('[x-data]')) {
                  node.__x = new Component(node);
                  return;
                }

                this.initializeElements(node);
              }.bind(this));
            }
          }
        }.bind(this));
        observer.observe(targetNode, observerOptions);
      }
    }, {
      key: "getRefsProxy",
      value: function getRefsProxy() {
        var _this23 = this;

        var self = this;
        var refObj = {};
        /* IE11-ONLY:START */
        // Add any properties up-front that might be necessary for the Proxy polyfill.

        refObj.$isRefsProxy = false;
        refObj.$isAlpineProxy = false; // If we are in IE, since the polyfill needs all properties to be defined before building the proxy,
        // we just loop on the element, look for any x-ref and create a tmp property on a fake object.

        this.walkAndSkipNestedComponents(self.$el, function (el) {
          _newArrowCheck(this, _this23);

          if (el.hasAttribute('x-ref')) {
            refObj[el.getAttribute('x-ref')] = true;
          }
        }.bind(this));
        /* IE11-ONLY:END */
        // One of the goals of this is to not hold elements in memory, but rather re-evaluate
        // the DOM when the system needs something from it. This way, the framework is flexible and
        // friendly to outside DOM changes from libraries like Vue/Livewire.
        // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.

        return new Proxy(refObj, {
          get: function get(object, property) {
            var _this24 = this;

            if (property === '$isAlpineProxy') return true;
            if (property === 'hasOwnProperty') return function (key) {
              _newArrowCheck(this, _this24);

              return true;
            }.bind(this);
            var ref; // We can't just query the DOM because it's hard to filter out refs in
            // nested components.

            self.walkAndSkipNestedComponents(self.$el, function (el) {
              _newArrowCheck(this, _this24);

              if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
                ref = el;
              }
            }.bind(this));
            return ref;
          }
        });
      }
    }]);

    return Component;
  }();

  var Alpine = {
    start: function () {
      var _start = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (isTesting()) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return domReady();

              case 3:
                this.discoverComponents(function (el) {
                  _newArrowCheck(this, _this);

                  this.initializeComponent(el);
                }.bind(this)); // It's easier and more performant to just support Turbolinks than listen
                // to MutationObserver mutations at the document level.

                document.addEventListener("turbolinks:load", function () {
                  var _this2 = this;

                  _newArrowCheck(this, _this);

                  this.discoverUninitializedComponents(function (el) {
                    _newArrowCheck(this, _this2);

                    this.initializeComponent(el);
                  }.bind(this));
                }.bind(this));
                this.listenForNewUninitializedComponentsAtRunTime(function (el) {
                  _newArrowCheck(this, _this);

                  this.initializeComponent(el);
                }.bind(this));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }(),
    discoverComponents: function discoverComponents(callback) {
      var _this3 = this;

      var rootEls = document.querySelectorAll('[x-data]');
      rootEls.forEach(function (rootEl) {
        _newArrowCheck(this, _this3);

        callback(rootEl);
      }.bind(this));
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(callback) {
      var _this4 = this;

      var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var rootEls = (el || document).querySelectorAll('[x-data]');
      Array.from(rootEls).filter(function (el) {
        _newArrowCheck(this, _this4);

        return el.__x === undefined;
      }.bind(this)).forEach(function (rootEl) {
        _newArrowCheck(this, _this4);

        callback(rootEl);
      }.bind(this));
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime(callback) {
      var _this5 = this;

      var targetNode = document.querySelector('body');
      var observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      var observer = new MutationObserver(function (mutations) {
        var _this6 = this;

        _newArrowCheck(this, _this5);

        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(function (node) {
              var _this7 = this;

              _newArrowCheck(this, _this6);

              // Discard non-element nodes (like line-breaks)
              if (node.nodeType !== 1) return; // Discard any changes happening within an existing component.
              // They will take care of themselves.

              if (node.parentElement && node.parentElement.closest('[x-data]')) return;
              this.discoverUninitializedComponents(function (el) {
                _newArrowCheck(this, _this7);

                this.initializeComponent(el);
              }.bind(this), node.parentElement);
            }.bind(this));
          }
        }
      }.bind(this));
      observer.observe(targetNode, observerOptions);
    },
    initializeComponent: function initializeComponent(el) {
      if (!el.__x) {
        el.__x = new Component(el);
      }
    },
    clone: function clone(component, newEl) {
      if (!newEl.__x) {
        newEl.__x = new Component(newEl, component.getUnobservedData());
      }
    }
  };

  if (!isTesting()) {
    window.Alpine = Alpine;

    if (window.deferLoadingAlpine) {
      window.deferLoadingAlpine(function () {
        window.Alpine.start();
      });
    } else {
      window.Alpine.start();
    }
  }

})));
