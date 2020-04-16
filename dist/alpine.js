(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Alpine = factory());
}(this, (function () { 'use strict';

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

  function ownKeys(object, enumerableOnly) {
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
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  class Prop {
      constructor(context, prop, isConst = false, isGlobal = false) {
          this.context = context;
          this.prop = prop;
          this.isConst = isConst;
          this.isGlobal = isGlobal;
      }
  }
  class Lisp {
      constructor(obj) {
          this.op = obj.op;
          this.a = obj.a;
          this.b = obj.b;
      }
  }
  class If {
      constructor(t, f) {
          this.t = t;
          this.f = f;
      }
  }
  class KeyVal {
      constructor(key, val) {
          this.key = key;
          this.val = val;
      }
  }
  class ObjectFunc {
      constructor(key, args, tree) {
          this.key = key;
          this.args = args;
          this.tree = tree;
      }
  }
  class SpreadObject {
      constructor(item) {
          this.item = item;
      }
  }
  class SpreadArray {
      constructor(item) {
          this.item = item;
      }
  }
  class Scope {
      constructor(parent, vars = {}, functionThis = undefined) {
          this.const = {};
          this.var = {};
          this.globals = {};
          this.parent = parent;
          this.let = !parent ? {} : vars;
          this.globals = !parent ? vars : {};
          this.functionThis = functionThis || !parent;
          if (functionThis) {
              this.declare('this', 'var', functionThis);
          }
      }
      get(key, functionScope = false) {
          if (!this.parent || !functionScope || this.functionThis) {
              if (this.const.hasOwnProperty(key)) {
                  return new Prop(this.const, key, true, key in this.globals);
              }
              if (this.var.hasOwnProperty(key)) {
                  return new Prop(this.var, key, false, key in this.globals);
              }
              if (this.let.hasOwnProperty(key)) {
                  return new Prop(this.let, key, false, key in this.globals);
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
      set(key, val) {
          if (key === 'this')
              throw new SyntaxError('"this" cannot be a variable');
          let prop = this.get(key);
          if (prop.context === undefined) {
              throw new ReferenceError(`Variable '${key}' was not declared.`);
          }
          if (prop.isConst) {
              throw new TypeError(`Cannot assign to const variable '${key}'`);
          }
          if (prop.isGlobal) {
              throw new SandboxError(`Cannot override global variable '${key}'`);
          }
          prop.context[prop] = val;
          return prop;
      }
      declare(key, type = null, value = undefined, isGlobal = false) {
          if (type === 'var' && !this.functionThis && this.parent) {
              this.parent.declare(key, type, value, isGlobal);
          }
          else if (!(key in this.var) || !(key in this.let) || !(key in this.const) || !(key in this.globals)) {
              if (isGlobal) {
                  this.globals[key] = value;
              }
              this[type][key] = value;
          }
          else {
              throw Error(`Variable '${key}' already declared`);
          }
      }
  }
  class ParseError extends Error {
      constructor(message, code) {
          super(message);
          this.code = code;
      }
  }
  class SandboxError extends Error {
  }
  class SandboxGlobal {
      constructor(globals) {
          if (globals === globalThis)
              return globalThis;
          for (let i in globals) {
              this[i] = globals[i];
          }
      }
  }
  function sandboxFunction(context) {
      return SandboxFunction;
      function SandboxFunction(...params) {
          let code = params.pop();
          let parsed = Sandbox.parse(code);
          return function (...args) {
              const vars = {};
              for (let i of params) {
                  vars[i] = args.shift();
              }
              const res = context.sandbox.executeTree(parsed);
              if (context.options.audit) {
                  for (let key in res.auditReport.globalsAccess) {
                      let add = res.auditReport.globalsAccess[key];
                      context.auditReport.globalsAccess[key] = context.auditReport.globalsAccess[key] || new Set();
                      add.forEach((val) => {
                          context.auditReport.globalsAccess[key].add(val);
                      });
                  }
                  for (let Class in res.auditReport.prototypeAccess) {
                      let add = res.auditReport.prototypeAccess[Class];
                      context.auditReport.prototypeAccess[Class] = context.auditReport.prototypeAccess[Class] || new Set();
                      add.forEach((val) => {
                          context.auditReport.prototypeAccess[Class].add(val);
                      });
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
      return function sandboxSetTimeout(handler, ...args) {
          if (typeof handler !== 'string')
              return setTimeout(handler, ...args);
          return setTimeout(func(handler), args[0]);
      };
  }
  function sandboxedSetInterval(func) {
      return function sandboxSetInterval(handler, ...args) {
          if (typeof handler !== 'string')
              return setInterval(handler, ...args);
          return setTimeout(func(handler), args[0]);
      };
  }
  let expectTypes = {
      op: {
          types: { op: /^(\/|\*\*(?!\=)|\*(?!\=)|\%(?!\=))/ },
          next: [
              'value',
              'prop',
              'exp',
              'modifier',
              'incrementerBefore',
          ]
      },
      splitter: {
          types: {
              split: /^(&&|&|\|\||\||<=|>=|<|>|!==|!=|===|==| instanceof | in |\+(?!\+)|\-(?!\-))(?!\=)/,
          },
          next: [
              'value',
              'prop',
              'exp',
              'modifier',
              'incrementerBefore',
          ]
      },
      if: {
          types: {
              if: /^\?/,
              else: /^:/,
          },
          next: [
              'expEnd'
          ]
      },
      assignment: {
          types: {
              assignModify: /^(\-=|\+=|\/=|\*\*=|\*=|%=|\^=|\&=|\|=)/,
              assign: /^(=)/
          },
          next: [
              'value',
              'function',
              'prop',
              'exp',
              'modifier',
              'incrementerBefore',
          ]
      },
      incrementerBefore: {
          types: { incrementerBefore: /^(\+\+|\-\-)/ },
          next: [
              'prop',
          ]
      },
      incrementerAfter: {
          types: { incrementerAfter: /^(\+\+|\-\-)/ },
          next: [
              'splitter',
              'op',
              'expEnd'
          ]
      },
      expEdge: {
          types: {
              arrayProp: /^[\[]/,
              call: /^[\(]/,
          },
          next: [
              'splitter',
              'op',
              'expEdge',
              'if',
              'dot',
              'expEnd'
          ]
      },
      modifier: {
          types: {
              not: /^!/,
              inverse: /^~/,
              negative: /^\-(?!\-)/,
              positive: /^\+(?!\+)/,
              typeof: /^ typeof /,
          },
          next: [
              'exp',
              'modifier',
              'value',
              'prop',
              'incrementerBefore',
          ]
      },
      exp: {
          types: {
              createObject: /^\{/,
              createArray: /^\[/,
              group: /^\(/,
          },
          next: [
              'splitter',
              'op',
              'expEdge',
              'if',
              'dot',
              'expEnd'
          ]
      },
      dot: {
          types: {
              dot: /^\.(?!\.)/
          },
          next: [
              'splitter',
              'incrementerAfter',
              'assignment',
              'op',
              'expEdge',
              'if',
              'dot',
              'expEnd'
          ]
      },
      prop: {
          types: {
              prop: /^[a-zA-Z\$_][a-zA-Z\d\$_]*/,
          },
          next: [
              'splitter',
              'incrementerAfter',
              'assignment',
              'op',
              'expEdge',
              'if',
              'dot',
              'expEnd'
          ]
      },
      value: {
          types: {
              number: /^\-?\d+(\.\d+)?/,
              string: /^"(\d+)"/,
              literal: /^`(\d+)`/,
              boolean: /^(true|false)(?![\w$_])/,
              null: /^null(?![\w$_])/,
              und: /^undefined(?![\w$_])/,
              NaN: /^NaN(?![\w$_])/,
              Infinity: /^Infinity(?![\w$_])/,
          },
          next: [
              'splitter',
              'op',
              'if',
              'dot',
              'expEnd'
          ]
      },
      function: {
          types: {
              arrowFunc: /^\(?(((\.\.\.)?[a-zA-Z\$_][a-zA-Z\d\$_]*,?)*)(\))?=>({)?/
          },
          next: [
              'expEnd'
          ]
      },
      initialize: {
          types: {
              initialize: /^ (var|let|const) [a-zA-Z\$_][a-zA-Z\d\$_]*/
          },
          next: [
              'value',
              'function',
              'prop',
              'exp',
              'modifier',
              'incrementerBefore',
              'expEnd'
          ]
      },
      spreadObject: {
          types: {
              spreadObject: /^\.\.\./
          },
          next: [
              'value',
              'exp',
              'prop',
          ]
      },
      spreadArray: {
          types: {
              spreadArray: /^\.\.\./
          },
          next: [
              'value',
              'exp',
              'prop',
          ]
      },
      expEnd: { types: {}, next: [] },
      expStart: {
          types: {
              return: /^ return /,
          },
          next: [
              'value',
              'function',
              'prop',
              'exp',
              'modifier',
              'incrementerBefore',
              'expEnd'
          ]
      }
  };
  let closings = {
      "(": ")",
      "[": "]",
      "{": "}",
      "'": "'",
      '"': '"',
      "`": "`"
  };
  let closingsRegex = {
      "(": /^\)/,
      "[": /^\]/,
      "{": /^\}/,
      "'": /^\'/,
      '"': /^\"/,
      "`": /^\`/
  };
  const okFirstChars = /^[\+\-~ !]/;
  const restOfExp = (part, tests, quote) => {
      let isStart = true;
      tests = tests || [
          expectTypes.op.types.op,
          expectTypes.splitter.types.split,
          expectTypes.if.types.if,
          expectTypes.if.types.else
      ];
      let escape = false;
      let done = false;
      let i;
      for (i = 0; i < part.length && !done; i++) {
          let char = part[i];
          if (quote === '"' || quote === "'" || quote === "`") {
              if (quote === "`" && char === "$" && part[i + 1] === "{" && !escape) {
                  let skip = restOfExp(part.substring(i + 2), [closingsRegex['{']]);
                  i += skip.length + 2;
              }
              else if (char === quote && !escape) {
                  return part.substring(0, i);
              }
              escape = char === "\\";
          }
          else if (closings[char]) {
              let skip = restOfExp(part.substring(i + 1), [closingsRegex[quote]], char);
              i += skip.length + 1;
              isStart = false;
          }
          else if (!quote) {
              let sub = part.substring(i);
              for (let test of tests) {
                  done = test.test(sub);
                  if (done)
                      break;
              }
              if (isStart) {
                  if (okFirstChars.test(sub)) {
                      done = false;
                  }
                  else {
                      isStart = false;
                  }
              }
              if (done)
                  break;
          }
          else if (char === closings[quote]) {
              return part.substring(0, i);
          }
      }
      return part.substring(0, i);
  };
  restOfExp.next = [
      'splitter',
      'op',
      'expEnd'
  ];
  function assignCheck(obj) {
      if (obj.context === undefined) {
          throw new ReferenceError(`Cannot assign value to undefined.`);
      }
      if (typeof obj.context !== 'object' && typeof obj.context !== 'function') {
          throw new SyntaxError(`Cannot assign value to a primitive.`);
      }
      if (obj.isConst) {
          throw new TypeError(`Cannot set value to const variable '${obj.prop}'`);
      }
      if (obj.isGlobal) {
          throw new SandboxError(`Cannot assign property '${obj.prop}' of a global object`);
      }
      if (typeof obj.context[obj.prop] === 'function' && !obj.context.hasOwnProperty(obj.prop)) {
          throw new SandboxError(`Override prototype property '${obj.prop}' not allowed`);
      }
  }
  let ops2 = {
      'prop': (a, b, obj, context, scope) => {
          if (a === null) {
              throw new TypeError(`Cannot get property ${b} of null`);
          }
          const type = typeof a;
          if (type === 'undefined') {
              let prop = scope.get(b);
              if (prop.context === undefined)
                  throw new ReferenceError(`${b} is not defined`);
              if (prop.context === context.sandboxGlobal) {
                  if (context.options.audit) {
                      context.auditReport.globalsAccess.add(b);
                  }
                  const rep = context.replacements.get(context.sandboxGlobal[b]);
                  if (rep)
                      return rep;
              }
              if (prop.context && prop.context[b] === globalThis) {
                  return context.globalScope.get('this');
              }
              return prop;
          }
          let ok = false;
          if (type !== 'object') {
              if (type === 'number') {
                  a = new Number(a);
              }
              else if (type === 'string') {
                  a = new String(a);
              }
              else if (type === 'boolean') {
                  a = new Boolean(a);
              }
          }
          else if (typeof a.hasOwnProperty === 'undefined') {
              return new Prop(undefined, b);
          }
          const isFunction = type === 'function';
          ok = !isFunction && (a.hasOwnProperty(b) || typeof b === 'number');
          if (context.options.audit && !ok) {
              ok = true;
              if (typeof b === 'string') {
                  let prot = a.constructor.prototype;
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
                      const whitelist = context.prototypeWhitelist.get(a);
                      if (whitelist && (!whitelist.size || whitelist.has(b))) ;
                      else {
                          throw new SandboxError(`Static method or property access not permitted: ${a.name}.${b}`);
                      }
                  }
              }
              else if (b !== 'constructor') {
                  let prot = a.constructor.prototype;
                  do {
                      if (prot.hasOwnProperty(b)) {
                          const whitelist = context.prototypeWhitelist.get(prot.constructor);
                          if (whitelist && (!whitelist.size || whitelist.has(b))) {
                              break;
                          }
                          throw new SandboxError(`Method or property access not permitted: ${prot.constructor.name}.${b}`);
                      }
                  } while (prot = Object.getPrototypeOf(prot));
              }
          }
          const rep = context.replacements.get(a[b]);
          if (rep)
              return rep;
          if (a[b] === globalThis) {
              return context.globalScope.get('this');
          }
          let g = obj.isGlobal || (isFunction && a.name !== 'sandboxArrowFunction') || context.globalsWhitelist.has(a);
          return new Prop(a, b, false, g);
      },
      'call': (a, b, obj, context, scope) => {
          if (context.options.forbidMethodCalls)
              throw new SandboxError("Method calls are not allowed");
          if (typeof a !== 'function') {
              throw new TypeError(`${obj.prop} is not a function`);
          }
          const args = b.map((item) => {
              if (item instanceof SpreadArray) {
                  return item.item;
              }
              else {
                  return [item];
              }
          }).flat();
          if (typeof obj === 'function') {
              return obj(...args.map((item) => exec(item, scope, context)));
          }
          return obj.context[obj.prop](...args.map((item) => exec(item, scope, context)));
      },
      'createObject': (a, b, obj, context, scope) => {
          let res = {};
          for (let item of b) {
              if (item instanceof SpreadObject) {
                  res = { ...res, ...item.item };
              }
              else if (item instanceof ObjectFunc) {
                  let f = item;
                  res[f.key] = function (...args) {
                      const vars = {};
                      (f.args).forEach((arg, i) => {
                          vars[arg] = args[i];
                      });
                      return context.sandbox.executeTree({
                          tree: f.tree,
                          strings: context.strings,
                          literals: context.literals,
                      }, [new Scope(scope, vars, this)]).result;
                  };
              }
              else {
                  res[item.key] = item.val;
              }
          }
          return res;
      },
      'keyVal': (a, b) => new KeyVal(a, b),
      'createArray': (a, b, obj, context, scope) => {
          return b.map((item) => {
              if (item instanceof SpreadArray) {
                  return item.item;
              }
              else {
                  return [item];
              }
          }).flat().map((item) => exec(item, scope, context));
      },
      'group': (a, b) => b,
      'string': (a, b, obj, context) => context.strings[b],
      'literal': (a, b, obj, context, scope) => {
          let name = context.literals[b].a;
          return name.replace(/(\$\$)*(\$)?\${(\d+)}/g, (match, $$, $, num) => {
              if ($)
                  return match;
              let res = exec(context.literals[b].b[parseInt(num, 10)], scope, context);
              res = res instanceof Prop ? res.context[res.prop] : res;
              return ($$ ? $$ : '') + `${res}`.replace(/\$/g, '$$');
          }).replace(/\$\$/g, '$');
      },
      'spreadArray': (a, b, obj, context, scope) => {
          return new SpreadArray(exec(b, scope, context));
      },
      'spreadObject': (a, b, obj, context, scope) => {
          return new SpreadObject(exec(b, scope, context));
      },
      '!': (a, b) => !b,
      '~': (a, b) => ~b,
      '++$': (a, b, obj) => {
          assignCheck(obj);
          return ++obj.context[obj.prop];
      },
      '$++': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop]++;
      },
      '--$': (a, b, obj) => {
          assignCheck(obj);
          return --obj.context[obj.prop];
      },
      '$--': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop]--;
      },
      '=': (a, b, obj, context, scope, bobj) => {
          assignCheck(obj);
          obj.context[obj.prop] = b;
          return new Prop(obj.context, obj.prop, false, obj.isGlobal);
      },
      '+=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] += b;
      },
      '-=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] -= b;
      },
      '/=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] /= b;
      },
      '*=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] *= b;
      },
      '**=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] **= b;
      },
      '%=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] %= b;
      },
      '^=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] ^= b;
      },
      '&=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] &= b;
      },
      '|=': (a, b, obj) => {
          assignCheck(obj);
          return obj.context[obj.prop] |= b;
      },
      '?': (a, b) => {
          if (!(b instanceof If)) {
              throw new SyntaxError('Invalid inline if');
          }
          return a ? b.t : b.f;
      },
      '>': (a, b) => a > b,
      '<': (a, b) => a < b,
      '>=': (a, b) => a >= b,
      '<=': (a, b) => a <= b,
      '==': (a, b) => a == b,
      '===': (a, b) => a === b,
      '!=': (a, b) => a != b,
      '!==': (a, b) => a !== b,
      '&&': (a, b) => a && b,
      '||': (a, b) => a || b,
      '&': (a, b) => a & b,
      '|': (a, b) => a | b,
      ':': (a, b) => new If(a, b),
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '$+': (a, b) => +b,
      '$-': (a, b) => -b,
      '/': (a, b) => a / b,
      '*': (a, b) => a * b,
      '%': (a, b) => a % b,
      ' typeof ': (a, b) => typeof b,
      ' instanceof ': (a, b) => a instanceof b,
      ' in ': (a, b) => a in b,
      'return': (a, b) => b,
      'var': (a, b, obj, context, scope, bobj) => {
          scope.declare(a, 'var', exec(b, scope, context));
          return new Prop(scope.var, a, false, bobj && bobj.isGlobal);
      },
      'let': (a, b, obj, context, scope, bobj) => {
          scope.declare(a, 'let', exec(b, scope, context), bobj && bobj.isGlobal);
          return new Prop(scope.let, a, false, bobj && bobj.isGlobal);
      },
      'const': (a, b, obj, context, scope, bobj) => {
          scope.declare(a, 'const', exec(b, scope, context));
          return new Prop(scope.const, a, false, bobj && bobj.isGlobal);
      },
      'arrowFunc': (a, b, obj, context, scope) => {
          const sandboxArrowFunction = (...args) => {
              const vars = {};
              a.forEach((arg, i) => {
                  if (arg.startsWith('...')) {
                      vars[arg.substring(3)] = args.slice(i);
                  }
                  else {
                      vars[arg] = args[i];
                  }
              });
              return context.sandbox.executeTree({
                  tree: b,
                  strings: context.strings,
                  literals: context.literals,
              }, [new Scope(scope, vars)]).result;
          };
          return sandboxArrowFunction;
      }
  };
  let ops = new Map();
  for (let op in ops2) {
      ops.set(op, ops2[op]);
  }
  let lispTypes = new Map();
  const setLispType = (types, fn) => {
      types.forEach((type) => {
          lispTypes.set(type, fn);
      });
  };
  const closingsCreate = {
      'createArray': /^\]/,
      'createObject': /^\}/,
      'group': /^\)/,
      'arrayProp': /^\]/,
      'call': /^\)/
  };
  setLispType(['createArray', 'createObject', 'group', 'arrayProp', 'call'], (type, part, res, expect, ctx) => {
      let extract = "";
      let arg = [];
      let end = false;
      let i = 1;
      while (i < part.length && !end) {
          extract = restOfExp(part.substring(i), [
              closingsCreate[type],
              /^,/
          ]);
          i += extract.length;
          if (extract) {
              arg.push(extract);
          }
          if (part[i] !== ',') {
              end = true;
          }
          else {
              i++;
          }
      }
      const next = ['value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore'];
      let l;
      let fFound;
      const reg2 = /^([a-zA-Z\$_][a-zA-Z\d\$_]*)\((([a-zA-Z\$_][a-zA-Z\d\$_]*,?)*)\)?{/;
      switch (type) {
          case 'group':
          case 'arrayProp':
              l = lispify(arg.pop());
              break;
          case 'call':
          case 'createArray':
              l = arg.map((e) => lispify(e, [...next, 'spreadArray']));
              break;
          case 'createObject':
              l = arg.map((str) => {
                  let value;
                  let key;
                  fFound = reg2.exec(str);
                  if (fFound) {
                      let args = fFound[2] ? fFound[2].split(",") : [];
                      const func = restOfExp(str.substring(fFound.index + fFound[0].length), [/^}/]);
                      return new ObjectFunc(fFound[1], args, Sandbox.parse(func, null).tree);
                  }
                  else {
                      let extract = restOfExp(str, [/^:/]);
                      key = lispify(extract, [...next, 'spreadObject']);
                      if (key instanceof Lisp && key.op === 'prop') {
                          key = key.b;
                      }
                      if (extract.length === str.length)
                          return key;
                      value = lispify(str.substring(extract.length + 1));
                  }
                  return new Lisp({
                      op: 'keyVal',
                      a: key,
                      b: value
                  });
              });
              break;
      }
      type = type === 'arrayProp' ? 'prop' : type;
      ctx.lispTree = lispify(part.substring(i + 1), expectTypes[expect].next, new Lisp({
          op: type,
          a: ctx.lispTree,
          b: l,
      }));
  });
  setLispType(['inverse', 'not', 'negative', 'positive', 'typeof', 'op'], (type, part, res, expect, ctx) => {
      let extract = restOfExp(part.substring(res[0].length));
      ctx.lispTree = lispify(part.substring(extract.length + res[0].length), restOfExp.next, new Lisp({
          op: ['positive', 'negative'].includes(type) ? '$' + res[0] : res[0],
          a: ctx.lispTree,
          b: lispify(extract, expectTypes[expect].next),
      }));
  });
  setLispType(['incrementerBefore'], (type, part, res, expect, ctx) => {
      let extract = restOfExp(part.substring(2));
      ctx.lispTree = lispify(part.substring(extract.length + 2), restOfExp.next, new Lisp({
          op: res[0] + "$",
          a: lispify(extract, expectTypes[expect].next),
      }));
  });
  setLispType(['incrementerAfter'], (type, part, res, expect, ctx) => {
      ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, new Lisp({
          op: "$" + res[0],
          a: ctx.lispTree,
      }));
  });
  setLispType(['assign', 'assignModify'], (type, part, res, expect, ctx) => {
      ctx.lispTree = new Lisp({
          op: res[0],
          a: ctx.lispTree,
          b: lispify(part.substring(res[0].length), expectTypes[expect].next)
      });
  });
  setLispType(['split'], (type, part, res, expect, ctx) => {
      let extract = restOfExp(part.substring(res[0].length), [
          expectTypes.splitter.types.split,
          expectTypes.if.types.if,
          expectTypes.if.types.else
      ]);
      ctx.lispTree = lispify(part.substring(extract.length + res[0].length), restOfExp.next, new Lisp({
          op: res[0],
          a: ctx.lispTree,
          b: lispify(extract, expectTypes[expect].next),
      }));
  });
  setLispType(['if'], (type, part, res, expect, ctx) => {
      let found = false;
      let extract = "";
      let quoteCount = 1;
      while (!found && extract.length < part.length) {
          extract += restOfExp(part.substring(extract.length + 1), [
              expectTypes.if.types.if,
              expectTypes.if.types.else
          ]);
          if (part[extract.length + 1] === '?') {
              quoteCount++;
          }
          else {
              quoteCount--;
          }
          if (!quoteCount) {
              found = true;
          }
          else {
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
  });
  setLispType(['dot', 'prop'], (type, part, res, expect, ctx) => {
      let prop = res[0];
      let index = res[0].length;
      if (res[0] === '.') {
          let matches = part.substring(res[0].length).match(expectTypes.prop.types.prop);
          if (matches.length) {
              prop = matches[0];
              index = prop.length + res[0].length;
          }
          else {
              throw Error('Hanging  dot:' + part);
          }
      }
      ctx.lispTree = lispify(part.substring(index), expectTypes[expect].next, new Lisp({
          op: 'prop',
          a: ctx.lispTree,
          b: prop
      }));
  });
  setLispType(['spreadArray', 'spreadObject', 'return'], (type, part, res, expect, ctx) => {
      ctx.lispTree = new Lisp({
          op: type,
          b: lispify(part.substring(res[0].length), expectTypes[expect].next)
      });
  });
  setLispType(['number', 'boolean', 'null'], (type, part, res, expect, ctx) => {
      ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, JSON.parse(res[0]));
  });
  const constants = {
      NaN,
      Infinity,
  };
  setLispType(['und', 'NaN', 'Infinity'], (type, part, res, expect, ctx) => {
      ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, constants[type]);
  });
  setLispType(['string', 'literal'], (type, part, res, expect, ctx) => {
      ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, new Lisp({
          op: type,
          b: parseInt(JSON.parse(res[1]), 10),
      }));
  });
  setLispType(['initialize'], (type, part, res, expect, ctx) => {
      const split = res[0].split(/ /g);
      if (part.length === res[0].length) {
          ctx.lispTree = lispify(part.substring(res[0].length), expectTypes[expect].next, new Lisp({
              op: split[1],
              a: split[2]
          }));
      }
      else {
          ctx.lispTree = new Lisp({
              op: split[1],
              a: split[2],
              b: lispify(part.substring(res[0].length + 1), expectTypes[expect].next)
          });
      }
  });
  setLispType(['arrowFunc'], (type, part, res, expect, ctx) => {
      let args = res[1] ? res[1].split(",") : [];
      if (res[4]) {
          if (res[0][0] !== '(')
              throw new SyntaxError('Unstarted inline function brackets: ' + res[0]);
      }
      else if (args.length) {
          args = [args.pop()];
      }
      let ended = false;
      args.forEach((arg) => {
          if (ended)
              throw new SyntaxError('Rest parameter must be last formal parameter');
          if (arg.startsWith('...'))
              ended = true;
      });
      const func = (res[5] ? '' : ' return ') + restOfExp(part.substring(res[0].length), res[5] ? [/^}/] : [/^[,;\)\}\]]/]);
      ctx.lispTree = lispify(part.substring(res[0].length + func.length + 1), expectTypes[expect].next, new Lisp({
          op: 'arrowFunc',
          a: args,
          b: Sandbox.parse(func, null).tree
      }));
  });
  let lastType;
  function lispify(part, expected, lispTree) {
      expected = expected || ['initialize', 'expStart', 'value', 'function', 'prop', 'exp', 'modifier', 'incrementerBefore', 'expEnd'];
      if (part === undefined)
          return lispTree;
      if (!part.length && !expected.includes('expEnd')) {
          throw new SyntaxError("Unexpected end of expression");
      }
      let ctx = { lispTree: lispTree };
      let res;
      for (let expect of expected) {
          if (expect === 'expEnd') {
              continue;
          }
          for (let type in expectTypes[expect].types) {
              if (type === 'expEnd') {
                  continue;
              }
              if (res = expectTypes[expect].types[type].exec(part)) {
                  lastType = type;
                  lispTypes.get(type)(type, part, res, expect, ctx);
                  break;
              }
          }
          if (res)
              break;
      }
      if (!res && part.length) {
          throw Error(`Unexpected token (${lastType}): ${part}`);
      }
      return ctx.lispTree;
  }
  function exec(tree, scope, context) {
      if (tree instanceof Prop) {
          return tree.context[tree.prop];
      }
      if (Array.isArray(tree)) {
          return tree.map((item) => exec(item, scope, context));
      }
      if (!(tree instanceof Lisp)) {
          return tree;
      }
      if (tree.op === 'arrowFunc') {
          return ops.get(tree.op)(tree.a, tree.b, undefined, context, scope);
      }
      let obj = exec(tree.a, scope, context);
      let a = obj instanceof Prop ? (obj.context ? obj.context[obj.prop] : undefined) : obj;
      let bobj = exec(tree.b, scope, context);
      let b = bobj instanceof Prop ? (bobj.context ? bobj.context[bobj.prop] : undefined) : bobj;
      if (ops.has(tree.op)) {
          let res = ops.get(tree.op)(a, b, obj, context, scope, bobj);
          return res;
      }
      throw new SyntaxError('Unknown operator: ' + tree.op);
  }
  class Sandbox {
      constructor(globals = Sandbox.SAFE_GLOBALS, prototypeWhitelist = Sandbox.SAFE_PROTOTYPES, options = { audit: false }) {
          const sandboxGlobal = new SandboxGlobal(globals);
          this.context = {
              sandbox: this,
              globals,
              prototypeWhitelist,
              globalsWhitelist: new Set(Object.values(globals)),
              options,
              globalScope: new Scope(null, globals, sandboxGlobal),
              sandboxGlobal,
              replacements: new Map()
          };
          const func = sandboxFunction(this.context);
          this.context.replacements.set(Function, func);
          this.context.replacements.set(eval, sandboxedEval(func));
          this.context.replacements.set(setTimeout, sandboxedSetTimeout(func));
          this.context.replacements.set(setInterval, sandboxedSetInterval(func));
      }
      static get SAFE_GLOBALS() {
          return {
              Function,
              console,
              isFinite,
              isNaN,
              parseFloat,
              parseInt,
              decodeURI,
              decodeURIComponent,
              encodeURI,
              encodeURIComponent,
              escape,
              unescape,
              Boolean,
              Number,
              String,
              Object,
              Array,
              Symbol,
              Error,
              EvalError,
              RangeError,
              ReferenceError,
              SyntaxError,
              TypeError,
              URIError,
              Int8Array,
              Uint8Array,
              Uint8ClampedArray,
              Int16Array,
              Uint16Array,
              Int32Array,
              Uint32Array,
              Float32Array,
              Float64Array,
              Map,
              Set,
              WeakMap,
              WeakSet,
              Promise,
              Intl,
              JSON,
              Math,
          };
      }
      static get SAFE_PROTOTYPES() {
          let protos = [
              SandboxGlobal,
              Function,
              Boolean,
              Number,
              String,
              Date,
              RegExp,
              Error,
              Array,
              Int8Array,
              Uint8Array,
              Uint8ClampedArray,
              Int16Array,
              Uint16Array,
              Int32Array,
              Uint32Array,
              Float32Array,
              Float64Array,
              Map,
              Set,
              WeakMap,
              WeakSet,
              Promise,
          ];
          let map = new Map();
          protos.forEach((proto) => {
              map.set(proto, new Set());
          });
          map.set(Object, new Set([
              'entries',
              'fromEntries',
              'getOwnPropertyNames',
              'is',
              'keys',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'toLocaleString',
              'toString',
              'valueOf',
              'values'
          ]));
          return map;
      }
      static audit(code, scopes = []) {
          let allowed = new Map();
          return new Sandbox(globalThis, allowed, {
              audit: true,
          }).executeTree(Sandbox.parse(code), scopes);
      }
      static parse(code, strings = [], literals = []) {
          if (typeof code !== 'string')
              throw new ParseError(`Cannot parse ${code}`, code);
          // console.log('parse', str);
          let str = code;
          let quote;
          let extract = "";
          let escape = false;
          let js = [];
          let currJs = [];
          if (strings) {
              let extractSkip = 0;
              for (let i = 0; i < str.length; i++) {
                  let char = str[i];
                  if (escape) {
                      if (char === "$" && quote === '`') {
                          extractSkip--;
                          char = '$$';
                      }
                      else if (char === 'u') {
                          let reg = /^[a-fA-F\d]{2,4}/.exec(str.substring(i + 1));
                          let num;
                          if (!reg) {
                              num = Array.from(/^{[a-fA-F\d]+}/.exec(str.substring(i + 1)) || [""]);
                          }
                          else {
                              num = Array.from(reg);
                          }
                          char = JSON.parse(`"\\u${num[0]}"`);
                          str = str.substring(0, i - 1) + char + str.substring(i + (1 + num[0].length));
                          i -= 1;
                      }
                      else if (char != '`') {
                          char = JSON.parse(`"\\${char}"`);
                      }
                  }
                  else if (char === '$' && quote === '`' && str[i + 1] !== '{') {
                      extractSkip--;
                      char = '$$';
                  }
                  if (quote === "`" && char === "$" && str[i + 1] === "{") {
                      let skip = restOfExp(str.substring(i + 2), [/^}/]);
                      currJs.push(skip);
                      extractSkip += skip.length + 3;
                      extract += `\${${currJs.length - 1}}`;
                      i += skip.length + 2;
                  }
                  else if (!quote && (char === "'" || char === '"' || char === '`') && !escape) {
                      currJs = [];
                      extractSkip = 0;
                      quote = char;
                  }
                  else if (quote === char && !escape) {
                      let len;
                      if (quote === '`') {
                          literals.push({
                              op: 'literal',
                              a: extract,
                              b: currJs
                          });
                          js.push(currJs);
                          str = str.substring(0, i - extractSkip - 1) + `\`${literals.length - 1}\`` + str.substring(i + 1);
                          len = (literals.length - 1).toString().length;
                      }
                      else {
                          strings.push(extract);
                          str = str.substring(0, i - extract.length - 1) + `"${strings.length - 1}"` + str.substring(i + 1);
                          len = (strings.length - 1).toString().length;
                      }
                      quote = null;
                      i -= extract.length - len;
                      extract = "";
                  }
                  else if (quote && !(!escape && char === "\\")) {
                      extractSkip += escape ? 1 + char.length : char.length;
                      extract += char;
                  }
                  escape = quote && !escape && char === "\\";
              }
              str = str.replace(/([^\w_$]|^)((var|let|const|typeof|return|instanceof|in)(?=[^\w_$]|$))/g, (match, start, keyword) => {
                  if (keyword.length !== keyword.trim().length)
                      throw new Error(keyword);
                  return `${start}#${keyword}#`;
              }).replace(/\s/g, "").replace(/#/g, " ");
              js.forEach((j) => {
                  const a = j.map((skip) => this.parse(skip, strings, literals).tree[0]);
                  j.length = 0;
                  j.push(...a);
              });
          }
          let parts = [];
          let part;
          let pos = 0;
          while ((part = restOfExp(str.substring(pos), [/^;/]))) {
              parts.push(part);
              pos += part.length + 1;
          }
          parts = parts.filter(Boolean);
          const tree = parts.filter((str) => str.length).map((str) => {
              try {
                  return lispify(str);
              }
              catch (e) {
                  // throw e;
                  throw new ParseError(e.message, str);
              }
          });
          return { tree, strings, literals };
      }
      executeTree(executionTree, scopes = []) {
          const execTree = executionTree.tree;
          const contextb = { ...this.context, strings: executionTree.strings, literals: executionTree.literals };
          let scope = this.context.globalScope;
          let s;
          while (s = scopes.shift()) {
              if (typeof s !== "object")
                  continue;
              if (s instanceof Scope) {
                  scope = s;
              }
              else {
                  scope = new Scope(scope, s);
              }
          }
          let context = Object.assign({}, contextb);
          if (contextb.options.audit) {
              context.auditReport = {
                  globalsAccess: new Set(),
                  prototypeAccess: {},
              };
          }
          let returned = false;
          let res;
          if (!(execTree instanceof Array))
              throw new SyntaxError('Bad execution tree');
          execTree.map(tree => {
              if (!returned) {
                  let r;
                  try {
                      r = exec(tree, scope, context);
                  }
                  catch (e) {
                      throw new e.constructor(e.message);
                  }
                  if (tree instanceof Lisp && tree.op === 'return') {
                      returned = true;
                      res = r;
                  }
              }
              return null;
          });
          res = res instanceof Prop ? res.context[res.prop] : res;
          return { auditReport: context.auditReport, result: res };
      }
      compile(code) {
          const executionTree = Sandbox.parse(code);
          return (...scopes) => {
              return this.executeTree(executionTree, scopes).result;
          };
      }
      ;
  }

  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts

  function domReady() {
    return new Promise(resolve => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
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
    let node = el.firstElementChild;

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
  const allowedGlobals = Sandbox.SAFE_GLOBALS;
  const allowedPrototypes = Sandbox.SAFE_PROTOTYPES;
  allowedPrototypes.set(CustomEvent, new Set());
  allowedPrototypes.set(Element, new Set());
  allowedPrototypes.set(Event, new Set());
  allowedPrototypes.set(EventTarget, new Set());
  const sandbox = new Sandbox(allowedGlobals, allowedPrototypes);
  const expressionCache = new WeakMap();

  function getCache(el) {
    let cache = expressionCache.get(el);

    if (!cache) {
      cache = {};
      expressionCache.set(el, cache);
    }

    return cache;
  }

  function saferEval(el, expression, dataContext, additionalHelperVariables = {}) {
    const code = `return ${expression};`;
    const exec = getCache(el)[code] || sandbox.compile(code);
    getCache(el)[code] = exec;
    return exec(window, dataContext, additionalHelperVariables);
  }
  function saferEvalNoReturn(el, expression, dataContext, additionalHelperVariables = {}) {
    // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
    // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.
    if (Object.keys(dataContext).includes(expression)) {
      const methodReference = dataContext[expression];

      if (typeof methodReference === 'function') {
        return methodReference.call(dataContext, additionalHelperVariables['$event']);
      }

      return methodReference;
    }

    const code = `${expression}`;
    const exec = getCache(el)[code] || sandbox.compile(code);
    getCache(el)[code] = exec;
    return exec(window, dataContext, additionalHelperVariables);
  }
  const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)\b/;
  function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name);
    return xAttrRE.test(name);
  }
  function getXAttrs(el, type) {
    return Array.from(el.attributes).filter(isXAttr).map(attr => {
      const name = replaceAtAndColonWithStandardSyntax(attr.name);
      const typeMatch = name.match(xAttrRE);
      const valueMatch = name.match(/:([a-zA-Z\-:]+)/);
      const modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map(i => i.replace('.', '')),
        expression: attr.value
      };
    }).filter(i => {
      // If no type is passed in for filtering, bypass filter
      if (!type) return true;
      return i.type === type;
    });
  }
  function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = ['disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected', 'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen', 'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer', 'nomodule'];
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
  function transitionIn(el, show, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show();
    const attrs = getXAttrs(el, 'transition');
    const showAttr = getXAttrs(el, 'show')[0]; // If this is triggered by a x-show.transition.

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers; // If x-show.transition.out, we'll skip the "in" transition.

      if (modifiers.includes('out') && !modifiers.includes('in')) return show();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out'); // If x-show.transition.in...out... only use "in" related modifiers for this transition.

      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers;
      transitionHelperIn(el, modifiers, show); // Otherwise, we can assume x-transition:enter.
    } else if (attrs.length > 0) {
      transitionClassesIn(el, attrs, show);
    } else {
      // If neither, just show that damn thing.
      show();
    }
  }
  function transitionOut(el, hide, forceSkip = false) {
    if (forceSkip) return hide();
    const attrs = getXAttrs(el, 'transition');
    const showAttr = getXAttrs(el, 'show')[0];

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers;
      if (modifiers.includes('in') && !modifiers.includes('out')) return hide();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out');
      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers;
      transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide);
    } else if (attrs.length > 0) {
      transitionClassesOut(el, attrs, hide);
    } else {
      hide();
    }
  }
  function transitionHelperIn(el, modifiers, showCallback) {
    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
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
    transitionHelper(el, modifiers, showCallback, () => {}, styleValues);
  }
  function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition ? modifierValue(modifiers, 'duration', 150) : modifierValue(modifiers, 'duration', 150) / 2;
    const styleValues = {
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
    transitionHelper(el, modifiers, () => {}, hideCallback, styleValues);
  }

  function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback; // If it IS present, grab the value after it: x-show.transition.duration.500ms

    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue) return fallback;

    if (key === 'scale') {
      // Check if the very next value is NOT a number and return the fallback.
      // If x-show.transition.scale, we'll use the default scale value.
      // That is how a user opts out of the opacity transition.
      if (!isNumeric(rawValue)) return fallback;
    }

    if (key === 'duration') {
      // Support x-show.transition.duration.500ms && duration.500
      let match = rawValue.match(/([0-9]+)ms/);
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
    const opacityCache = el.style.opacity;
    const transformCache = el.style.transform;
    const transformOriginCache = el.style.transformOrigin; // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.

    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale');
    const transitionOpacity = noModifiers || modifiers.includes('opacity');
    const transitionScale = noModifiers || modifiers.includes('scale'); // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.

    const stages = {
      start() {
        if (transitionOpacity) el.style.opacity = styleValues.first.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.first.scale / 100})`;
      },

      during() {
        if (transitionScale) el.style.transformOrigin = styleValues.origin;
        el.style.transitionProperty = [transitionOpacity ? `opacity` : ``, transitionScale ? `transform` : ``].join(' ').trim();
        el.style.transitionDuration = `${styleValues.duration / 1000}s`;
        el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
      },

      show() {
        hook1();
      },

      end() {
        if (transitionOpacity) el.style.opacity = styleValues.second.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`;
      },

      hide() {
        hook2();
      },

      cleanup() {
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
    const enter = (directives.find(i => i.value === 'enter') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const enterStart = (directives.find(i => i.value === 'enter-start') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const enterEnd = (directives.find(i => i.value === 'enter-end') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {});
  }
  function transitionClassesOut(el, directives, hideCallback) {
    const leave = (directives.find(i => i.value === 'leave') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const leaveStart = (directives.find(i => i.value === 'leave-start') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const leaveEnd = (directives.find(i => i.value === 'leave-end') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback);
  }
  function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2) {
    const originalClasses = el.__x_original_classes || [];
    const stages = {
      start() {
        el.classList.add(...classesStart);
      },

      during() {
        el.classList.add(...classesDuring);
      },

      show() {
        hook1();
      },

      end() {
        // Don't remove classes that were in the original class attribute.
        el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)));
        el.classList.add(...classesEnd);
      },

      hide() {
        hook2();
      },

      cleanup() {
        el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)));
        el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)));
      }

    };
    transition(el, stages);
  }
  function transition(el, stages) {
    stages.start();
    stages.during();
    requestAnimationFrame(() => {
      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;
      stages.show();
      requestAnimationFrame(() => {
        stages.end();
        setTimeout(() => {
          stages.hide(); // Adding an "isConnected" check, in case the callback
          // removed the element from the DOM.

          if (el.isConnected) {
            stages.cleanup();
          }
        }, duration);
      });
    });
  }
  function isNumeric(subject) {
    return !isNaN(subject);
  }

  function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfNotTemplateTag(templateEl);
    let iteratorNames = parseForExpression(expression);
    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars); // As we walk the array, we'll also walk the DOM (updating/creating as we go).

    let currentEl = templateEl;
    items.forEach((item, index) => {
      let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items);
      let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables);
      let nextEl = currentEl.nextElementSibling; // If there's no previously x-for processed element ahead, add one.

      if (!nextEl || nextEl.__x_for_key === undefined) {
        nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl); // And transition it in if it's not the first page load.

        transitionIn(nextEl, () => {}, initialUpdate);
        nextEl.__x_for = iterationScopeVariables;
        component.initializeElements(nextEl, () => nextEl.__x_for);
      } else {
        nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey); // Temporarily remove the key indicator to allow the normal "updateElements" to work

        delete nextEl.__x_for_key;
        nextEl.__x_for = iterationScopeVariables;
        component.updateElements(nextEl, () => nextEl.__x_for);
      }

      currentEl = nextEl;
      currentEl.__x_for_key = currentKey;
    });
    removeAnyLeftOverElementsFromPreviousUpdate(currentEl);
  } // This was taken from VueJS 2.* core. Thanks Vue!

  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\(|\)$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch) return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].trim().replace(stripParensRE, '');
    let iteratorMatch = item.match(forIteratorRE);

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
    let scopeVariables = {
      [iteratorNames.item]: item
    };
    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }

  function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    let bindKeyAttribute = getXAttrs(el, 'bind').filter(attr => attr.value === 'key')[0]; // If the dev hasn't specified a key, just return the index of the iteration.

    if (!bindKeyAttribute) return index;
    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables);
  }

  function warnIfNotTemplateTag(el) {
    if (el.tagName.toLowerCase() !== 'template') console.warn('Alpine: [x-for] directive should only be added to <template> tags.');
  }

  function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, 'if')[0];

    if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
      return [];
    }

    return component.evaluateReturnExpression(el, iteratorNames.items, extraVars);
  }

  function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true);
    if (clone.childElementCount !== 1) console.warn('Alpine: <template> tag with [x-for] encountered with multiple element roots. Make sure <template> only has a single child node.');
    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
    return currentEl.nextElementSibling;
  }

  function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    // If the the key's DO match, no need to look ahead.
    if (nextEl.__x_for_key === currentKey) return nextEl; // If the don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.

    let tmpNextEl = nextEl;

    while (tmpNextEl) {
      if (tmpNextEl.__x_for_key === currentKey) {
        return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
      }

      tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined ? tmpNextEl.nextElementSibling : false;
    }
  }

  function removeAnyLeftOverElementsFromPreviousUpdate(currentEl) {
    var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined ? currentEl.nextElementSibling : false;

    while (nextElementFromOldLoop) {
      let nextElementFromOldLoopImmutable = nextElementFromOldLoop;
      let nextSibling = nextElementFromOldLoop.nextElementSibling;
      transitionOut(nextElementFromOldLoop, () => {
        nextElementFromOldLoopImmutable.remove();
      });
      nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== undefined ? nextSibling : false;
    }
  }

  function handleAttributeBindingDirective(component, el, attrName, expression, extraVars) {
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
          let valueFound = false;
          value.forEach(val => {
            if (val == el.value) {
              valueFound = true;
            }
          });
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
        const originalClasses = el.__x_original_classes || [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '));
      } else if (typeof value === 'object') {
        Object.keys(value).forEach(classNames => {
          if (value[classNames]) {
            classNames.split(' ').forEach(className => el.classList.add(className));
          } else {
            classNames.split(' ').forEach(className => el.classList.remove(className));
          }
        });
      } else {
        const originalClasses = el.__x_original_classes || [];
        const newClasses = value.split(' ');
        el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '));
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
    const arrayWrappedValue = [].concat(value).map(value => {
      return value + '';
    });
    Array.from(el.options).forEach(option => {
      option.selected = arrayWrappedValue.includes(option.value || option.text);
    });
  }

  function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    const hide = () => {
      el.style.display = 'none';
    };

    const show = () => {
      if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style');
      } else {
        el.style.removeProperty('display');
      }
    };

    if (initialUpdate === true) {
      if (value) {
        show();
      } else {
        hide();
      }

      return;
    }

    const handle = resolve => {
      if (!value) {
        if (el.style.display !== 'none') {
          transitionOut(el, () => {
            resolve(() => {
              hide();
            });
          });
        } else {
          resolve(() => {});
        }
      } else {
        if (el.style.display !== '') {
          transitionIn(el, () => {
            show();
          });
        } // Resolve immediately, only hold up parent `x-show`s for hidin.


        resolve(() => {});
      }
    }; // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.
    // If x-show.immediate, foregoe the waiting.


    if (modifiers.includes('immediate')) {
      handle(finish => finish());
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
    if (el.nodeName.toLowerCase() !== 'template') console.warn(`Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if`);
    const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

    if (expressionResult && !elementHasAlreadyBeenAdded) {
      const clone = document.importNode(el.content, true);
      el.parentElement.insertBefore(clone, el.nextElementSibling);
      transitionIn(el.nextElementSibling, () => {}, initialUpdate);
      component.initializeElements(el.nextElementSibling, extraVars);
      el.nextElementSibling.__x_inserted_me = true;
    } else if (!expressionResult && elementHasAlreadyBeenAdded) {
      transitionOut(el.nextElementSibling, () => {
        el.nextElementSibling.remove();
      }, initialUpdate);
    }
  }

  function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
    if (modifiers.includes('away')) {
      let handler = e => {
        // Don't do anything if the click came form the element or within it.
        if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

        if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
        // is from outside it, let's run the expression.

        runListenerHandler(component, expression, e, extraVars);

        if (modifiers.includes('once')) {
          document.removeEventListener(event, handler);
        }
      }; // Listen for this event at the root level.


      document.addEventListener(event, handler);
    } else {
      let listenerTarget = modifiers.includes('window') ? window : modifiers.includes('document') ? document : el;

      let handler = e => {
        // Remove this global event handler if the element that declared it
        // has been removed. It's now stale.
        if (listenerTarget === window || listenerTarget === document) {
          if (!document.body.contains(el)) {
            listenerTarget.removeEventListener(event, handler);
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
        const returnValue = runListenerHandler(component, expression, e, extraVars);

        if (returnValue === false) {
          e.preventDefault();
        } else {
          if (modifiers.includes('once')) {
            listenerTarget.removeEventListener(event, handler);
          }
        }
      };

      if (modifiers.includes('debounce')) {
        let nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait';
        let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250;
        handler = debounce(handler, wait);
      }

      listenerTarget.addEventListener(event, handler);
    }
  }

  function runListenerHandler(component, expression, e, extraVars) {
    return component.evaluateCommandExpression(e.target, expression, () => {
      return _objectSpread2({}, extraVars(), {
        '$event': e
      });
    });
  }

  function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event);
  }

  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
      return !['window', 'document', 'prevent', 'stop'].includes(i);
    });

    if (keyModifiers.includes('debounce')) {
      let debounceIndex = keyModifiers.indexOf('debounce');
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    } // If no modifier is specified, we'll call it a press.


    if (keyModifiers.length === 0) return false; // If one is passed, AND it matches the key pressed, we'll call it a press.

    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false; // The user is listening for key combinations.

    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter(i => !selectedSystemKeyModifiers.includes(i));

    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
        // Alias "cmd" and "super" to "meta"
        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta';
        return e[`${modifier}Key`];
      }); // If all the modifiers selected are pressed, ...

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
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = el.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(el.type) || modifiers.includes('lazy') ? 'change' : 'input';
    const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    registerListener(component, el, event, modifiers, listenerExpression, () => {
      return _objectSpread2({}, extraVars(), {
        rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
      });
    });
  }

  function generateModelAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
      // Radio buttons only work properly when they share a name attribute.
      // People might assume we take care of that for them, because
      // they already set a shared "x-model" attribute.
      if (!el.hasAttribute('name')) el.setAttribute('name', expression);
    }

    return (event, currentValue) => {
      // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
      if (event instanceof CustomEvent && event.detail) {
        return event.detail;
      } else if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle it's value inside the array.
        if (Array.isArray(currentValue)) {
          return event.target.checked ? currentValue.concat([event.target.value]) : currentValue.filter(i => i !== event.target.value);
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        return modifiers.includes('number') ? Array.from(event.target.selectedOptions).map(option => {
          const rawValue = option.value || option.text;
          const number = rawValue ? parseFloat(rawValue) : null;
          return isNaN(number) ? rawValue : number;
        }) : Array.from(event.target.selectedOptions).map(option => {
          return option.value || option.text;
        });
      } else {
        const rawValue = event.target.value;
        const number = rawValue ? parseFloat(rawValue) : null;
        return modifiers.includes('number') ? isNaN(number) ? rawValue : number : modifiers.includes('trim') ? rawValue.trim() : rawValue;
      }
    };
  }

  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */
  const { isArray } = Array;
  const { getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty, } = Object;
  const { push: ArrayPush, concat: ArrayConcat, map: ArrayMap, } = Array.prototype;
  function isUndefined(obj) {
      return obj === undefined;
  }
  function isFunction(obj) {
      return typeof obj === 'function';
  }
  function isObject(obj) {
      return typeof obj === 'object';
  }
  const proxyToValueMap = new WeakMap();
  function registerProxy(proxy, value) {
      proxyToValueMap.set(proxy, value);
  }
  const unwrap = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */
  function unwrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = unwrap(descriptor.value);
      }
      return descriptor;
  }
  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
      const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      targetKeys.forEach((key) => {
          let descriptor = getOwnPropertyDescriptor(originalTarget, key);
          // We do not need to wrap the descriptor if configurable
          // Because we can deal with wrapping it when user goes through
          // Get own property descriptor. There is also a chance that this descriptor
          // could change sometime in the future, so we can defer wrapping
          // until we need to
          if (!descriptor.configurable) {
              descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
          }
          ObjectDefineProperty(shadowTarget, key, descriptor);
      });
      preventExtensions(shadowTarget);
  }
  class ReactiveProxyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getProxy(value);
      }
      set(shadowTarget, key, value) {
          const { originalTarget, membrane: { valueMutated } } = this;
          const oldValue = originalTarget[key];
          if (oldValue !== value) {
              originalTarget[key] = value;
              valueMutated(originalTarget, key);
          }
          else if (key === 'length' && isArray(originalTarget)) {
              // fix for issue #236: push will add the new index, and by the time length
              // is updated, the internal length is already equal to the new length value
              // therefore, the oldValue is equal to the value. This is the forking logic
              // to support this use case.
              valueMutated(originalTarget, key);
          }
          return true;
      }
      deleteProperty(shadowTarget, key) {
          const { originalTarget, membrane: { valueMutated } } = this;
          delete originalTarget[key];
          valueMutated(originalTarget, key);
          return true;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      isExtensible(shadowTarget) {
          const shadowIsExtensible = isExtensible(shadowTarget);
          if (!shadowIsExtensible) {
              return shadowIsExtensible;
          }
          const { originalTarget, membrane } = this;
          const targetIsExtensible = isExtensible(originalTarget);
          if (!targetIsExtensible) {
              lockShadowTarget(membrane, shadowTarget, originalTarget);
          }
          return targetIsExtensible;
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getPrototypeOf(shadowTarget) {
          const { originalTarget } = this;
          return getPrototypeOf(originalTarget);
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = this.membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value, setter or getter (if available) cannot observe
          // mutations, just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapValue);
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          const { originalTarget, membrane } = this;
          lockShadowTarget(membrane, shadowTarget, originalTarget);
          preventExtensions(originalTarget);
          return true;
      }
      defineProperty(shadowTarget, key, descriptor) {
          const { originalTarget, membrane } = this;
          const { valueMutated } = membrane;
          const { configurable } = descriptor;
          // We have to check for value in descriptor
          // because Object.freeze(proxy) calls this method
          // with only { configurable: false, writeable: false }
          // Additionally, method will only be called with writeable:false
          // if the descriptor has a value, as opposed to getter/setter
          // So we can just check if writable is present and then see if
          // value is present. This eliminates getter and setter descriptors
          if (hasOwnProperty.call(descriptor, 'writable') && !hasOwnProperty.call(descriptor, 'value')) {
              const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
              descriptor.value = originalDescriptor.value;
          }
          ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
          if (configurable === false) {
              ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
          }
          valueMutated(originalTarget, key);
          return true;
      }
  }

  function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }
  class ReadOnlyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { membrane, originalTarget } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getReadOnlyProxy(value);
      }
      set(shadowTarget, key, value) {
          return false;
      }
      deleteProperty(shadowTarget, key) {
          return false;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value or getter (if available) cannot be observed,
          // just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);
          if (hasOwnProperty.call(desc, 'set')) {
              desc.set = undefined; // readOnly membrane does not allow setters
          }
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          return false;
      }
      defineProperty(shadowTarget, key, descriptor) {
          return false;
      }
  }
  function createShadowTarget(value) {
      let shadowTarget = undefined;
      if (isArray(value)) {
          shadowTarget = [];
      }
      else if (isObject(value)) {
          shadowTarget = {};
      }
      return shadowTarget;
  }
  const ObjectDotPrototype = Object.prototype;
  function defaultValueIsObservable(value) {
      // intentionally checking for null
      if (value === null) {
          return false;
      }
      // treat all non-object types, including undefined, as non-observable values
      if (typeof value !== 'object') {
          return false;
      }
      if (isArray(value)) {
          return true;
      }
      const proto = getPrototypeOf(value);
      return (proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null);
  }
  const defaultValueObserved = (obj, key) => {
      /* do nothing */
  };
  const defaultValueMutated = (obj, key) => {
      /* do nothing */
  };
  const defaultValueDistortion = (value) => value;
  function wrapDescriptor(membrane, descriptor, getValue) {
      const { set, get } = descriptor;
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = getValue(membrane, descriptor.value);
      }
      else {
          if (!isUndefined(get)) {
              descriptor.get = function () {
                  // invoking the original getter with the original target
                  return getValue(membrane, get.call(unwrap(this)));
              };
          }
          if (!isUndefined(set)) {
              descriptor.set = function (value) {
                  // At this point we don't have a clear indication of whether
                  // or not a valid mutation will occur, we don't have the key,
                  // and we are not sure why and how they are invoking this setter.
                  // Nevertheless we preserve the original semantics by invoking the
                  // original setter with the original target and the unwrapped value
                  set.call(unwrap(this), membrane.unwrapProxy(value));
              };
          }
      }
      return descriptor;
  }
  class ReactiveMembrane {
      constructor(options) {
          this.valueDistortion = defaultValueDistortion;
          this.valueMutated = defaultValueMutated;
          this.valueObserved = defaultValueObserved;
          this.valueIsObservable = defaultValueIsObservable;
          this.objectGraph = new WeakMap();
          if (!isUndefined(options)) {
              const { valueDistortion, valueMutated, valueObserved, valueIsObservable } = options;
              this.valueDistortion = isFunction(valueDistortion) ? valueDistortion : defaultValueDistortion;
              this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
              this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
              this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
          }
      }
      getProxy(value) {
          const unwrappedValue = unwrap(value);
          const distorted = this.valueDistortion(unwrappedValue);
          if (this.valueIsObservable(distorted)) {
              const o = this.getReactiveState(unwrappedValue, distorted);
              // when trying to extract the writable version of a readonly
              // we return the readonly.
              return o.readOnly === value ? value : o.reactive;
          }
          return distorted;
      }
      getReadOnlyProxy(value) {
          value = unwrap(value);
          const distorted = this.valueDistortion(value);
          if (this.valueIsObservable(distorted)) {
              return this.getReactiveState(value, distorted).readOnly;
          }
          return distorted;
      }
      unwrapProxy(p) {
          return unwrap(p);
      }
      getReactiveState(value, distortedValue) {
          const { objectGraph, } = this;
          let reactiveState = objectGraph.get(distortedValue);
          if (reactiveState) {
              return reactiveState;
          }
          const membrane = this;
          reactiveState = {
              get reactive() {
                  const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue);
                  // caching the reactive proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'reactive', { value: proxy });
                  return proxy;
              },
              get readOnly() {
                  const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue);
                  // caching the readOnly proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'readOnly', { value: proxy });
                  return proxy;
              }
          };
          objectGraph.set(distortedValue, reactiveState);
          return reactiveState;
      }
  }
  /** version: 0.26.0 */

  function wrap(data, mutationCallback) {

    let membrane = new ReactiveMembrane({
      valueMutated(target, key) {
        mutationCallback(target, key);
      }

    });
    return {
      data: membrane.getProxy(data),
      membrane: membrane
    };
  }
  function unwrap$1(membrane, observable) {
    let unwrappedData = membrane.unwrapProxy(observable);
    let copy = {};
    Object.keys(unwrappedData).forEach(key => {
      if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return;
      copy[key] = unwrappedData[key];
    });
    return copy;
  }

  class Component {
    constructor(el, seedDataForCloning = null) {
      this.$el = el;
      const dataAttr = this.$el.getAttribute('x-data');
      const dataExpression = dataAttr === '' ? '{}' : dataAttr;
      const initExpression = this.$el.getAttribute('x-init');
      this.unobservedData = seedDataForCloning ? seedDataForCloning : saferEval(el, dataExpression, {});
      // Construct a Proxy-based observable. This will be used to handle reactivity.

      let {
        membrane,
        data
      } = this.wrapDataInObservable(this.unobservedData);
      this.$data = data;
      this.membrane = membrane; // After making user-supplied data methods reactive, we can now add
      // our magic properties to the original data for access.

      this.unobservedData.$el = this.$el;
      this.unobservedData.$refs = this.getRefsProxy();
      this.nextTickStack = [];

      this.unobservedData.$nextTick = callback => {
        this.nextTickStack.push(callback);
      };

      this.watchers = {};

      this.unobservedData.$watch = (property, callback) => {
        if (!this.watchers[property]) this.watchers[property] = [];
        this.watchers[property].push(callback);
      };

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

    getUnobservedData() {
      return unwrap$1(this.membrane, this.$data);
    }

    wrapDataInObservable(data) {
      var self = this;
      let updateDom = debounce(function () {
        self.updateElements(self.$el);
      }, 0);
      return wrap(data, (target, key) => {
        if (self.watchers[key]) {
          // If there's a watcher for this specific key, run it.
          self.watchers[key].forEach(callback => callback(target[key]));
        } else {
          // Let's walk through the watchers with "dot-notation" (foo.bar) and see
          // if this mutation fits any of them.
          Object.keys(self.watchers).filter(i => i.includes('.')).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // If this dot-notation watcher's last "part" doesn't match the current
            // key, then skip it early for performance reasons.

            if (key !== dotNotationParts[dotNotationParts.length - 1]) return; // Now, walk through the dot-notation "parts" recursively to find
            // a match, and call the watcher if one's found.

            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData)) {
                // Run the watchers.
                self.watchers[fullDotNotationKey].forEach(callback => callback(target[key]));
              }

              return comparisonData[part];
            }, self.getUnobservedData());
          });
        } // Don't react to data changes for cases like the `x-created` hook.


        if (self.pauseReactivity) return;
        updateDom();
      });
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {}) {
      walk(el, el => {
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
      });
    }

    initializeElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop
        if (el.__x_for_key !== undefined) return false; // Don't touch spawns from if directives

        if (el.__x_inserted_me !== undefined) return false;
        this.initializeElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack(); // Walk through the $nextTick stack and clear it as we go.

      while (this.nextTickStack.length > 0) {
        this.nextTickStack.shift()();
      }
    }

    initializeElement(el, extraVars) {
      // To support class attribute merging, we have to know what the element's
      // original class attribute looked like for reference.
      if (el.hasAttribute('class') && getXAttrs(el).length > 0) {
        el.__x_original_classes = el.getAttribute('class').split(' ');
      }

      this.registerListeners(el, extraVars);
      this.resolveBoundAttributes(el, true, extraVars);
    }

    updateElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
        if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) return false;
        this.updateElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack(); // Walk through the $nextTick stack and clear it as we go.

      while (this.nextTickStack.length > 0) {
        this.nextTickStack.shift()();
      }
    }

    executeAndClearRemainingShowDirectiveStack() {
      // The goal here is to start all the x-show transitions
      // and build a nested promise chain so that elements
      // only hide when the children are finished hiding.
      this.showDirectiveStack.reverse().map(thing => {
        return new Promise(resolve => {
          thing(finish => {
            resolve(finish);
          });
        });
      }).reduce((nestedPromise, promise) => {
        return nestedPromise.then(() => {
          return promise.then(finish => finish());
        });
      }, Promise.resolve(() => {})); // We've processed the handler stack. let's clear it.

      this.showDirectiveStack = [];
      this.showDirectiveLastElement = undefined;
    }

    updateElement(el, extraVars) {
      this.resolveBoundAttributes(el, false, extraVars);
    }

    registerListeners(el, extraVars) {
      getXAttrs(el).forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'on':
            registerListener(this, el, value, modifiers, expression, extraVars);
            break;

          case 'model':
            registerModelListener(this, el, modifiers, expression, extraVars);
            break;
        }
      });
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
      let attrs = getXAttrs(el);
      attrs.forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
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
            if (attrs.filter(i => i.type === 'for').length > 0) return;
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
      });
    }

    evaluateReturnExpression(el, expression, extraVars = () => {}) {
      return saferEval(el, expression, this.$data, _objectSpread2({}, extraVars(), {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    evaluateCommandExpression(el, expression, extraVars = () => {}) {
      return saferEvalNoReturn(el, expression, this.$data, _objectSpread2({}, extraVars(), {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    getDispatchFunction(el) {
      return (event, detail = {}) => {
        el.dispatchEvent(new CustomEvent(event, {
          detail,
          bubbles: true
        }));
      };
    }

    listenForNewElementsToInitialize() {
      const targetNode = this.$el;
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          // Filter out mutations triggered from child components.
          const closestParentComponent = mutations[i].target.closest('[x-data]');
          if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) return;

          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
            const rawData = saferEval(mutations[i].target, mutations[i].target.getAttribute('x-data'), {});
            Object.keys(rawData).forEach(key => {
              if (this.$data[key] !== rawData[key]) {
                this.$data[key] = rawData[key];
              }
            });
          }

          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              if (node.nodeType !== 1 || node.__x_inserted_me) return;

              if (node.matches('[x-data]')) {
                node.__x = new Component(node);
                return;
              }

              this.initializeElements(node);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    }

    getRefsProxy() {
      var self = this;
      var refObj = {};
      // One of the goals of this is to not hold elements in memory, but rather re-evaluate
      // the DOM when the system needs something from it. This way, the framework is flexible and
      // friendly to outside DOM changes from libraries like Vue/Livewire.
      // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.

      return new Proxy(refObj, {
        get(object, property) {
          if (property === '$isAlpineProxy') return true;
          if (property === 'hasOwnProperty') return key => true;
          var ref; // We can't just query the DOM because it's hard to filter out refs in
          // nested components.

          self.walkAndSkipNestedComponents(self.$el, el => {
            if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
              ref = el;
            }
          });
          return ref;
        }

      });
    }

  }

  const Alpine = {
    start: async function start() {
      if (!isTesting()) {
        await domReady();
      }

      this.discoverComponents(el => {
        this.initializeComponent(el);
      }); // It's easier and more performant to just support Turbolinks than listen
      // to MutationObserver mutations at the document level.

      document.addEventListener("turbolinks:load", () => {
        this.discoverUninitializedComponents(el => {
          this.initializeComponent(el);
        });
      });
      this.listenForNewUninitializedComponentsAtRunTime(el => {
        this.initializeComponent(el);
      });
    },
    discoverComponents: function discoverComponents(callback) {
      const rootEls = document.querySelectorAll('[x-data]');
      rootEls.forEach(rootEl => {
        callback(rootEl);
      });
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(callback, el = null) {
      const rootEls = (el || document).querySelectorAll('[x-data]');
      Array.from(rootEls).filter(el => el.__x === undefined).forEach(rootEl => {
        callback(rootEl);
      });
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime(callback) {
      const targetNode = document.querySelector('body');
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              // Discard non-element nodes (like line-breaks)
              if (node.nodeType !== 1) return; // Discard any changes happening within an existing component.
              // They will take care of themselves.

              if (node.parentElement && node.parentElement.closest('[x-data]')) return;
              this.discoverUninitializedComponents(el => {
                this.initializeComponent(el);
              }, node.parentElement);
            });
          }
        }
      });
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

  return Alpine;

})));
