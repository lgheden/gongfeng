/**
 * CodeMirror 语言模式集合
 * 为代码美化工具提供多语言支持
 */

// CSS 模式
CodeMirror.defineMode("css", function(config, parserConfig) {
  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks || {},
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {
        "align-content": true, "align-items": true, "align-self": true, "animation": true,
        "background": true, "background-color": true, "background-image": true, "border": true,
        "border-radius": true, "color": true, "display": true, "flex": true, "font": true,
        "font-size": true, "height": true, "margin": true, "padding": true, "position": true,
        "width": true, "z-index": true, "opacity": true, "transform": true, "transition": true
      },
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {
        "red": true, "green": true, "blue": true, "white": true, "black": true,
        "transparent": true, "inherit": true, "initial": true, "unset": true
      },
      valueKeywords = parserConfig.valueKeywords || {
        "block": true, "inline": true, "flex": true, "grid": true, "none": true,
        "auto": true, "center": true, "left": true, "right": true, "absolute": true,
        "relative": true, "fixed": true, "static": true, "sticky": true
      },
      allowNested = parserConfig.allowNested,
      lineComment = parserConfig.lineComment,
      supportsAtComponent = parserConfig.supportsAtComponent === true;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]+/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if (stream.match(/[\w\\\-]+/)) {
      var word = stream.current();
      if (propertyKeywords.hasOwnProperty(word)) {
        return ret("property", "property");
      } else if (colorKeywords.hasOwnProperty(word)) {
        return ret("keyword", "color");
      } else if (valueKeywords.hasOwnProperty(word)) {
        return ret("atom", "value");
      }
      return ret("variable", "variable");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  return {
    startState: function(base) {
      return {tokenize: null,
              state: "top",
              stateArg: null,
              context: new Context("top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      return style;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          indent = Math.max(0, cx.indent - indentUnit);
          cx = cx.prev;
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: lineComment,
    fold: "brace"
  };

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }
});

// XML 模式
CodeMirror.defineMode("xml", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var multilineTagIndentFactor = parserConfig.multilineTagIndentFactor || 1;
  var multilineTagIndentPastTag = parserConfig.multilineTagIndentPastTag;
  if (multilineTagIndentPastTag == null) multilineTagIndentPastTag = true;

  var Kludges = {
    autoSelfClosers: {},
    implicitlyClosed: {},
    contextGrabbers: {},
    doNotIndent: {},
    allowUnquoted: false,
    allowMissing: false,
    caseFold: false
  };

  var alignCDATA = parserConfig.alignCDATA;

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-\:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/>]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    };
  }

  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (Kludges.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (state.context) {
      parentTagName = state.context.tagName;
      if (!Kludges.contextGrabbers.hasOwnProperty(parentTagName) ||
          !Kludges.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          Kludges.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if ((state.context && state.context.tagName == tagName) || Kludges.matchClosing === false) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else {
      setStyle = "error";
      return closeTagNameState;
    }
  }

  function closeState(type, stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          Kludges.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!Kludges.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && Kludges.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function(baseIndent) {
      var state = {tokenize: inText,
                   state: baseState,
                   indented: baseIndent || 0,
                   tagName: null, tagStart: null,
                   context: null};
      if (baseIndent != null) state.baseIndent = baseIndent;
      return state;
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^\s*/) ? 0 : CodeMirror.Pass : 0;
      if (state.tagName) {
        if (multilineTagIndentPastTag !== false)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * multilineTagIndentFactor;
      }
      if (alignCDATA && /<\!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && textAfter.match(/^<(\/?)(\w+)/);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (Kludges.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = Kludges.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && context.prev && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return state.baseIndent || 0;
    },

    electricInput: /<\/?\w+\s*>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: parserConfig.htmlMode ? "html" : "xml",
    helperType: parserConfig.htmlMode ? "html" : "xml",

    skipAttribute: function(state) {
      if (state.state == attrValueState)
        state.state = attrState;
    }
  };
});

// SQL 模式
CodeMirror.defineMode("sql", function(config, parserConfig) {
  var defaultBuiltin = "bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric".split(" ");
  var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit".split(" ");
  
  function set(words) {
    var obj = {};
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  
  var client         = parserConfig.client || {},
      atoms          = parserConfig.atoms || {"false": true, "true": true, "null": true},
      builtin        = parserConfig.builtin || set(defaultBuiltin),
      keywords       = parserConfig.keywords || set(sqlKeywords),
      operatorChars  = parserConfig.operatorChars || /^[*+\-%<>!=&|~^]/,
      support        = parserConfig.support || {},
      hooks          = parserConfig.hooks || {},
      dateSQL        = parserConfig.dateSQL || {"date" : true, "time" : true, "timestamp" : true},
      backslashStringEscapes = parserConfig.backslashStringEscapes !== false,
      brackets       = parserConfig.brackets || /^[\{\}\(\)\[\]]/,
      punctuation    = parserConfig.punctuation || /^[;\.,:]/ ;

  function tokenBase(stream, state) {
    var ch = stream.next();

    // call hooks from the mime type
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }

    if (support.hexNumber &&
      ((ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/))
      || (ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]+'/))) {
      // hex
      // ref: http://dev.mysql.com/doc/refman/5.6/en/hexadecimal-literals.html
      return "number";
    } else if (support.binaryNumber &&
      (((ch == "b" || ch == "B") && stream.match(/^'[01]+'/)) ||
       (ch == "0" && stream.match(/^b[01]+/)))) {
      // bitstring
      // ref: http://dev.mysql.com/doc/refman/5.6/en/bit-field-literals.html
      return "number";
    } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
      // numbers
      // ref: http://dev.mysql.com/doc/refman/5.6/en/number-literals.html
      stream.match(/^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.match(/^\.[0-9]+([eE][-+]?[0-9]+)?/);
      return "number";
    } else if (ch == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
      // placeholders
      return "variable-3";
    } else if (ch == "'" || (ch == '"' && support.doubleQuote)) {
      // strings
      // ref: http://dev.mysql.com/doc/refman/5.6/en/string-literals.html
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    } else if ((((support.nCharCast && (ch == "n" || ch == "N"))
                || (support.charsetCast && ch == "_" && stream.match(/[a-z][a-z0-9]*/i)))
               && (stream.peek() == "'" || stream.peek() == '"'))
              || (support.commentSlashSlash && ch == "/" && stream.eat("/"))
              || (support.commentHash && ch == "#")
              || (ch == "-" && stream.eat("-") && (!support.commentSpaceRequired || stream.eat(" ")))) {
      // charset casting: _utf8'str', N'str'
      // ref: http://dev.mysql.com/doc/refman/5.6/en/string-literals.html

      // line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      stream.skipToEnd();
      return "comment";
    } else if (ch == "/" && stream.eat("*")) {
      // block comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      state.tokenize = tokenComment;
      return state.tokenize(stream, state);
    } else if (ch == ".") {
      // .1 for 0.1
      if (support.zerolessFloat && stream.match(/^\d+/)) {
        return "number";
      }
      if (stream.match(/^\d+/)) {
        return "number";
      }
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable && stream.match(/^[\w\d_]+/)) {
        return "variable-2";
      }
    } else if (operatorChars.test(ch)) {
      // operators
      stream.eatWhile(operatorChars);
      return "operator";
    } else if (brackets.test(ch)) {
      // brackets
      return "bracket";
    } else if (punctuation.test(ch)) {
      // punctuation
      stream.eatWhile(punctuation);
      return "punctuation";
    } else if (ch == '{' &&
               (stream.match(/^\s*\w*\s*}/) || stream.match(/^\s*\w*\s*:\s*\w*\s*}/))) {
      // variables
      // ref: http://dev.mysql.com/doc/refman/5.6/en/user-variables.html
      return "variable-2";
    } else {
      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();
      // dates (standard SQL syntax)
      // ref: http://dev.mysql.com/doc/refman/5.6/en/date-and-time-literals.html
      if (dateSQL.hasOwnProperty(word) && (stream.match(/^\s*'[^']*'/) || stream.match(/^\s*"[^"]*"/)))
        return "number";
      if (atoms.hasOwnProperty(word)) return "atom";
      if (builtin.hasOwnProperty(word)) return "builtin";
      if (keywords.hasOwnProperty(word)) return "keyword";
      if (client.hasOwnProperty(word)) return "string-2";
      return null;
    }
  }

  // 'string', with char specified in quote escaped by '\'
  function tokenLiteral(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = backslashStringEscapes && !escaped && ch == "\\";
      }
      return "string";
    };
  }
  function tokenComment(stream, state) {
    while (true) {
      if (stream.skipTo("*")) {
        stream.next();
        if (stream.eat("/")) {
          state.tokenize = tokenBase;
          break;
        }
      } else {
        stream.skipToEnd();
        break;
      }
    }
    return "comment";
  }

  function pushContext(stream, state, type) {
    state.context = {
      prev: state.context,
      indent: stream.indentation(),
      col: stream.column(),
      type: type
    };
  }

  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function() {
      return {tokenize: tokenBase, context: null};
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null)
          state.context.align = false;
      }
      if (stream.eatSpace()) return null;

      var style = state.tokenize(stream, state);
      if (style == "comment") return style;

      if (state.context && state.context.align == null)
        state.context.align = true;

      var tok = stream.current();
      if (tok == "(")
        pushContext(stream, state, ")");
      else if (tok == "[")
        pushContext(stream, state, "]");
      else if (state.context && state.context.type == tok)
        popContext(state);
      return style;
    },

    indent: function(state, textAfter) {
      var cx = state.context;
      if (!cx) return CodeMirror.Pass;
      var closing = textAfter.charAt(0) == cx.type;
      if (cx.align) return cx.col + (closing ? 0 : 1);
      else return cx.indent + (closing ? 0 : config.indentUnit);
    },

    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--"
  };


});

// Python 模式
CodeMirror.defineMode("python", function(conf, parserConf) {
  var ERRORCLASS = "error";
  var hangingIndent = parserConf.hangingIndent || conf.indentUnit;

  function wordRegexp(words) {
    return new RegExp("^((" + words.join(")|(")+"))\\b");
  }

  var keywords = wordRegexp([
    "and", "as", "assert", "break", "class", "continue", "def",
    "del", "elif", "else", "except", "exec", "finally", "for", "from",
    "global", "if", "import", "in", "is", "lambda", "not", "or",
    "pass", "print", "raise", "return", "try", "while", "with", "yield"
  ]);

  var builtins = wordRegexp([
    "abs", "all", "any", "bin", "bool", "bytearray", "callable", "chr",
    "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod",
    "enumerate", "eval", "filter", "float", "format", "frozenset",
    "getattr", "globals", "hasattr", "hash", "help", "hex", "id",
    "input", "int", "isinstance", "issubclass", "iter", "len",
    "list", "locals", "map", "max", "memoryview", "min", "next",
    "object", "oct", "open", "ord", "pow", "property", "range",
    "repr", "reversed", "round", "set", "setattr", "slice",
    "sorted", "staticmethod", "str", "sum", "super", "tuple",
    "type", "vars", "zip", "__import__", "NotImplemented",
    "Ellipsis", "__debug__"
  ]);

  var stringPrefixes = new RegExp("^((r|u|ur|R|U|UR|Ur|uR|b|B|br|Br|bR|BR|rb|rB|Rb|RB)?)(['\"])");
  var operators = parserConf.operators || /^(\+|\-|\*|\/|\/\/|%|<<|>>|&|\||\^|~|<|>|<=|>=|==|!=|<>|=)/;
  var delimiters = parserConf.delimiters || /^(\(|\)|\[|\]|\{|\}|@|,|:|`|=|;|\+=|\-=|\*=|\/=|\/\/=|%=|&=|\|=|\^=|>>=|<<=|\*\*=)/;

  var tripleDelimited = {"'''":true, '"""':true};
  var singleDelimited = {"'":true, '"':true};

  function tokenBase(stream, state) {
    if (stream.sol()) state.indent = stream.indentation();
    // Handle scope changes
    if (stream.sol() && top(state).type == "py") {
      var scopeOffset = top(state).offset;
      if (stream.eatSpace()) {
        var lineOffset = stream.indentation();
        if (lineOffset > scopeOffset)
          pushPyScope(state);
        else if (lineOffset < scopeOffset && dedent(stream, state))
          state.errorToken = true;
        return null;
      } else {
        var style = tokenBaseInner(stream, state);
        if (scopeOffset > 0 && dedent(stream, state))
          style += " " + ERRORCLASS;
        return style;
      }
    }
    return tokenBaseInner(stream, state);
  }

  function tokenBaseInner(stream, state) {
    if (stream.eatSpace()) return null;

    var ch = stream.peek();

    // Handle Comments
    if (ch == "#") {
      stream.skipToEnd();
      return "comment";
    }

    // Handle Number Literals
    if (stream.match(/^[0-9\.]/)) {
      var floatLiteral = false;
      // Floats
      if (stream.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)) { floatLiteral = true; }
      if (stream.match(/^\d+\.(?!\d)/)) { floatLiteral = true; }
      if (stream.match(/^\.\d+/)) { floatLiteral = true; }
      if (floatLiteral) {
        // Float literals may be "imaginary"
        stream.eat(/J/i);
        return "number";
      }
      // Integers
      var intLiteral = false;
      // Hex
      if (stream.match(/^0x[0-9a-f]+/i)) intLiteral = true;
      // Binary
      if (stream.match(/^0b[01]+/i)) intLiteral = true;
      // Octal
      if (stream.match(/^0o[0-7]+/i)) intLiteral = true;
      // Decimal
      if (stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)) {
        // Decimal literals may be "imaginary"
        stream.eat(/J/i);
        // TODO - Can you have imaginary longs?
        intLiteral = true;
      }
      // Zero by itself with no other piece of number.
      if (stream.match(/^0(?!\d)/)) intLiteral = true;
      if (intLiteral) {
        // Integer literals may be "long"
        stream.eat(/L/i);
        return "number";
      }
    }

    // Handle Strings
    if (stream.match(stringPrefixes)) {
      var isFmtString = stream.current().toLowerCase().indexOf('f') !== -1;
      state.tokenize = tokenStringFactory(stream.current(), isFmtString);
      return state.tokenize(stream, state);
    }

    for (var i = 0; i < operators.length; i++)
      if (stream.match(operators[i])) return "operator"

    for (var i = 0; i < delimiters.length; i++)
      if (stream.match(delimiters[i])) return "punctuation"

    if (stream.match(keywords)) return "keyword";
    if (stream.match(builtins)) return "builtin";

    if (stream.match(/^(self|cls)\b/)) return "variable-2";

    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      if (state.lastToken == "def" || state.lastToken == "class")
        return "def";
      return "variable";
    }

    // Handle non-detected items
    stream.next();
    return ERRORCLASS;
  }

  function tokenStringFactory(delimiter, isFmtString) {
    while ("rub".indexOf(delimiter.charAt(0).toLowerCase()) >= 0)
      delimiter = delimiter.substr(1);

    var singleline = delimiter.length == 1;
    var OUTCLASS = "string";

    function tokenString(stream, state) {
      while (!stream.eol()) {
        stream.eatWhile(/[^'"\\]/);
        if (stream.eat("\\")) {
          stream.next();
          if (singleline && stream.eol())
            return OUTCLASS;
        } else if (stream.match(delimiter)) {
          state.tokenize = tokenBase;
          return OUTCLASS;
        } else {
          stream.eat(/['"]/);
        }
      }
      if (singleline) {
        if (parserConf.singleLineStringErrors)
          return ERRORCLASS;
        else
          state.tokenize = tokenBase;
      }
      return OUTCLASS;
    }
    tokenString.isString = true;
    return tokenString;
  }

  function pushPyScope(state) {
    while (top(state).type != "py") state.scopes.pop()
    state.scopes.push({offset: top(state).offset + conf.indentUnit,
                       type: "py",
                       align: null})
  }

  function pushBracketScope(stream, state, type) {
    var align = stream.match(/^([\s\[\{\(]|#.*)*$/, false) ? null : stream.column() + 1
    state.scopes.push({offset: state.indent + hangingIndent,
                       type: type,
                       align: align})
  }

  function dedent(stream, state) {
    var indented = stream.indentation();
    while (state.scopes.length > 1 && top(state).offset > indented) {
      if (top(state).type != "py") return true;
      state.scopes.pop();
    }
    return top(state).offset != indented;
  }

  function tokenLexer(stream, state) {
    if (stream.sol()) {
      state.beginningOfLine = true;
    }

    var style = state.tokenize(stream, state);
    var current = stream.current();

    // Handle decorators
    if (state.beginningOfLine && current == "@")
      return stream.match(identifiers, false) ? "meta" : py3 ? "operator" : ERRORCLASS;

    if (/\S/.test(current)) state.beginningOfLine = false;

    if ((style == "variable" || style == "builtin")
        && state.lastToken == "meta")
      style = "meta";

    // Handle scope changes.
    if (current == "pass" || current == "return")
      state.dedent += 1;

    if (current == "lambda") state.lambda = true;
    if (current == ":" && !state.lambda && top(state).type == "py")
      pushPyScope(state);

    var delimiter_index = current.length == 1 ? "[({" : "[({".indexOf(current.slice(-1))
    if (delimiter_index != -1)
      pushBracketScope(stream, state, "])}"[delimiter_index]);

    delimiter_index = "])}" .indexOf(current)
    if (delimiter_index != -1) {
      if (top(state).type == current) state.indent = state.scopes.pop().offset - hangingIndent
      else return ERRORCLASS;
    }
    if (state.dedent > 0 && stream.eol() && top(state).type == "py") {
      if (state.scopes.length > 1) state.scopes.pop();
      state.dedent -= 1;
    }

    return style;
  }

  var external = {
    startState: function(basecolumn) {
      return {
        tokenize: tokenBase,
        scopes: [{offset: basecolumn || 0, type: "py", align: null}],
        indent: basecolumn || 0,
        lastToken: null,
        lambda: false,
        dedent: 0
      };
    },

    token: function(stream, state) {
      var addErr = state.errorToken;
      if (addErr) state.errorToken = false;
      var style = tokenLexer(stream, state);

      if (stream.eol() && stream.lambda)
        state.lambda = false;
      return style + (addErr ? " " + ERRORCLASS : "");
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase)
        return state.tokenize.isString ? CodeMirror.Pass : 0;

      var scope = top(state), closing = scope.type == textAfter.charAt(0)
      if (scope.align != null)
        return scope.align - (closing ? 1 : 0)
      else
        return scope.offset - (closing ? hangingIndent : 0)
    },

    electricInput: /^\s*[\}\]\)]$/,
    closeBrackets: {triples: '"""'},
    lineComment: "#",
    fold: "indent"
  };
  return external;

  function top(state) {
    return state.scopes[state.scopes.length - 1];
  }
});

// HTML混合模式
CodeMirror.defineMode("htmlmixed", function (config, parserConfig) {
  var htmlMode = CodeMirror.getMode(config, {
    name: "xml",
    htmlMode: true,
    multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
    multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
  });

  var tags = {};
  var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
  // 尝试添加JavaScript模式，如果不存在则跳过
  addTags(tags, "script", "javascript");
  addTags(tags, "style", "css");
  if (configTags) addTags(tags, configTags);
  if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
    tags.script && tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

  function html(stream, state) {
    var startPos = stream.pos
    var style = htmlMode.token(stream, state.htmlState), tag = /\btag\b/.test(style), tagName
    
    // 确保流至少前进了一个字符，防止死循环
    if (stream.pos === startPos) {
      stream.next()
      style = style || "error"
    }
    
    if (tag && !/[<>\s\/]/.test(stream.current()) &&
        (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&
        tags.hasOwnProperty(tagName)) {
      state.inTag = tagName + " "
    } else if (state.inTag && tag && />$/.test(stream.current())) {
      var inTag = /^(\S+)\s*(.*)/.exec(state.inTag)
      state.inTag = null
      var modeSpec = stream.current() == ">" && getMode(tags[inTag[1]], inTag[2])
      if (modeSpec) {
        var mode = modeSpec.mode || modeSpec
        try {
          // 验证模式是否有效
          if (!mode) {
            throw new Error("Mode is null or undefined")
          }
          
          // 检查模式是否有startState方法
          if (typeof mode.startState !== 'function' && typeof mode !== 'function') {
            throw new Error("Mode does not have a valid startState method")
          }
          
          state.localMode = mode
          state.localState = CodeMirror.startState(mode)
          
          // 验证状态是否成功创建
          if (!state.localState) {
            throw new Error("Failed to create local state")
          }
          
          state.token = local(modeSpec, mode)
        } catch (e) {
          console.warn("Error starting mode for tag '" + inTag[1] + "':", e)
          // 回退到HTML模式
          state.localMode = null
          state.localState = null
          state.token = html
        }
      }
    } else if (state.inTag) {
      state.inTag += stream.current()
      if (stream.eol()) state.inTag += " "
    }
    return style
  }

  function maybeBackup(stream, pat, style) {
    if (!pat) return style
    var cur = stream.current(), close = cur.search(pat)
    if (close > -1) {
      stream.backUp(cur.length - close)
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length)
      if (!stream.match(pat, false)) stream.match(cur)
    }
    return style
  }

  function local(modeSpec, mode) {
    return function(stream, state) {
      var close = modeSpec.close, style, pat
      var startPos = stream.pos
      
      // 检查模式和状态的有效性
      if (!mode || !state.localState) {
        console.warn("Invalid mode or state in local function")
        stream.next()
        return "error"
      }
      
      try {
        // 确保mode.token存在且为函数
        if (typeof mode.token === 'function') {
          style = mode.token(stream, state.localState)
        } else if (typeof mode === 'function') {
          // 如果mode本身是函数，直接调用
          style = mode(stream, state.localState)
        } else {
          console.warn("Mode does not have a valid token function")
          style = null
        }
      } catch (e) {
        console.warn("Error in mode token function:", e)
        style = null
      }
      
      // 确保流至少前进了一个字符，防止死循环
      if (stream.pos === startPos) {
        stream.next()
        style = style || "error"
      }
      
      if (typeof close == "string") pat = close
      else if (close && close.test) pat = close
      else if (close && close.join) pat = new RegExp("\\s*\\b" + close.join("\\b|\\b") + "\\b")
      else pat = null
      return maybeBackup(stream, pat, style)
    }
  }

  function getMode(spec, text) {
    if (!spec || spec.length == 0) return null
    if (spec.length == 1) return spec[0]
    for (var i = 1; i < spec.length; i += 2)
      if (spec[i].test ? spec[i].test(text) : spec[i] == text) return spec[i + 1]
    return null
  }

  function addTags(out, tagName, mode) {
    var list = out[tagName] || (out[tagName] = [])
    try {
      var modeSpec = CodeMirror.resolveMode(mode)
      // 检查模式是否存在，如果不存在则跳过
      if (!modeSpec) {
        console.warn("CodeMirror mode '" + mode + "' not found, skipping tag '" + tagName + "'")
        return
      }
      
      // 验证模式是否有效
      if (typeof modeSpec !== 'function' && (!modeSpec.token || typeof modeSpec.token !== 'function')) {
        console.warn("Invalid mode specification for '" + mode + "', skipping tag '" + tagName + "'")
        return
      }
      
      if (typeof mode == "object") {
        var close = mode.close
        if (close) close = new RegExp(close.source || close, "i")
        list.push([null, null, {mode: modeSpec, close: close}])
      } else {
        list.push([null, null, modeSpec])
      }
    } catch (e) {
      console.error("Error adding mode '" + mode + "' for tag '" + tagName + "':", e)
    }
  }

  return {
    startState: function () {
      var state = CodeMirror.startState(htmlMode)
      return {token: html, inTag: null, localMode: null, localState: null, htmlState: state}
    },

    copyState: function (state) {
      var local
      if (state.localState) {
        local = CodeMirror.copyState(state.localMode, state.localState)
      }
      return {token: state.token, inTag: state.inTag,
              localMode: state.localMode, localState: local,
              htmlState: CodeMirror.copyState(htmlMode, state.htmlState)}
    },

    token: function (stream, state) {
      return state.token(stream, state)
    },

    indent: function (state, textAfter, line) {
      if (!state.localMode || /^\s*<\//.test(textAfter))
        return htmlMode.indent(state.htmlState, textAfter, line)
      else if (state.localMode.indent)
        return state.localMode.indent(state.localState, textAfter, line)
      else
        return CodeMirror.Pass
    },

    innerMode: function (state) {
      return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode}
    }
  }
});

// 注册MIME类型
CodeMirror.defineMIME("text/css", "css");
CodeMirror.defineMIME("text/x-scss", {name: "css", mediaTypes: {}, mediaFeatures: {}, propertyKeywords: {}});
CodeMirror.defineMIME("text/x-less", {name: "css", mediaTypes: {}, mediaFeatures: {}, propertyKeywords: {}});

CodeMirror.defineMIME("application/xml", "xml");
CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

CodeMirror.defineMIME("text/x-sql", "sql");
CodeMirror.defineMIME("text/x-mysql", {name: "sql", client: {}});
CodeMirror.defineMIME("text/x-mariadb", {name: "sql", client: {}});
CodeMirror.defineMIME("text/x-cassandra", {name: "sql", client: {}});
CodeMirror.defineMIME("text/x-plsql", {name: "sql", client: {}});
CodeMirror.defineMIME("text/x-mssql", {name: "sql", client: {}});

CodeMirror.defineMIME("text/x-python", "python");
CodeMirror.defineMIME("text/x-cython", {name: "python", extra_keywords: []});

CodeMirror.defineMIME("text/html", "htmlmixed");
CodeMirror.defineMIME("application/xhtml+xml", "htmlmixed");

// Java 语法模式
CodeMirror.defineMode("clike", function(config, parserConfig) {
  var indentUnit = config.indentUnit,
      statementIndentUnit = parserConfig.statementIndentUnit || indentUnit,
      dontAlignCalls = parserConfig.dontAlignCalls,
      keywords = parserConfig.keywords || {},
      types = parserConfig.types || {},
      builtin = parserConfig.builtin || {},
      blockKeywords = parserConfig.blockKeywords || {},
      defKeywords = parserConfig.defKeywords || {},
      atoms = parserConfig.atoms || {},
      hooks = parserConfig.hooks || {},
      multiLineStrings = parserConfig.multiLineStrings,
      indentStatements = parserConfig.indentStatements !== false,
      indentSwitch = parserConfig.indentSwitch !== false,
      namespaceSeparator = parserConfig.namespaceSeparator,
      isPunctuationChar = parserConfig.isPunctuationChar || /[\[\]{}\(\),;\.:]/,
      numberStart = parserConfig.numberStart || /[\d\.]/,
      number = parserConfig.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\d*\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?$/i,
      isOperatorChar = parserConfig.isOperatorChar || /[+\-*&%=<>!?|~^@]/,
      isIdentifierChar = parserConfig.isIdentifierChar || /[\w\$_\xa1-\uffff]/;

  var curPunc, isDefKeyword;

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }
    if (isPunctuationChar.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (numberStart.test(ch)) {
      stream.backUp(1);
      if (stream.match(number)) return "number";
      stream.next();
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (isOperatorChar.test(ch)) {
      while (!stream.match(/^\s/, false) && isOperatorChar.test(stream.peek())) {
        stream.next();
      }
      return "operator";
    }
    stream.eatWhile(isIdentifierChar);

    if (namespaceSeparator) while (stream.match(namespaceSeparator))
      stream.eatWhile(isIdentifierChar);

    var cur = stream.current();
    if (contains(keywords, cur)) {
      if (contains(blockKeywords, cur)) curPunc = "newstatement";
      if (contains(defKeywords, cur)) isDefKeyword = true;
      return "keyword";
    }
    if (contains(types, cur)) return "type";
    if (contains(builtin, cur)) return "builtin";
    if (contains(atoms, cur)) return "atom";
    return "variable";
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {end = true; break;}
        escaped = !escaped && next == "\\";
      }
      if (end || !(escaped || multiLineStrings))
        state.tokenize = null;
      return "string";
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }

  function Context(indented, column, type, info, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.info = info;
    this.align = align;
    this.prev = prev;
  }
  function pushContext(state, col, type, info) {
    var indent = state.indented;
    if (state.context && state.context.type == "statement" && type != "statement")
      indent = state.context.indented;
    return state.context = new Context(indent, col, type, info, null, state.context);
  }
  function popContext(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  function typeBefore(stream, state, pos) {
    if (state.prevToken == "variable" || state.prevToken == "type") return true;
  }

  function isStatement(context, pattern) {
    var first = pattern && pattern.charAt(0);
    return context.type == "statement" || context.type == "switchstatement" &&
      first == "case" || first == "default";
  }

  function contains(words, word) {
    if (typeof words === "function") {
      return words(word);
    } else {
      return words.propertyIsEnumerable(word);
    }
  }

  return {
    startState: function(basecolumn) {
      return {
        tokenize: null,
        context: new Context((basecolumn || 0) - indentUnit, 0, "top", null, false),
        indented: 0,
        startOfLine: true,
        prevToken: null
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (stream.eatSpace()) return null;
      curPunc = isDefKeyword = null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style == "comment" || style == "meta") return style;
      if (ctx.align == null) ctx.align = true;

      if (curPunc == ";" || curPunc == ":" || (curPunc == "," && stream.match(/^\s*(?:\/\/.*)?$/, false)))
        while (state.context.type == "statement") popContext(state);
      else if (curPunc == "{") {
        pushContext(state, stream.column(), "}");
      } else if (curPunc == "[") {
        pushContext(state, stream.column(), "]");
      } else if (curPunc == "(") {
        pushContext(state, stream.column(), ")");
      } else if (curPunc == "}") {
        while (ctx.type == "statement") ctx = popContext(state);
        if (ctx.type == "}") ctx = popContext(state);
        while (ctx.type == "statement") ctx = popContext(state);
      } else if (curPunc == ctx.type) {
        popContext(state);
      } else if (indentStatements &&
                 (((ctx.type == "}" || ctx.type == "top") && curPunc != ";") ||
                  (ctx.type == "statement" && curPunc == "newstatement"))) {
        pushContext(state, stream.column(), "statement", stream.current());
      }

      if (style == "variable" &&
          ((state.prevToken == "def" ||
            (parserConfig.typeFirstDefinitions && typeBefore(stream, state) &&
             isStatement(ctx, stream.current()) && stream.match(/^\s*\(/, false))))) {
        style = "def";
      }

      if (hooks.token) {
        var result = hooks.token(stream, state, style);
        if (result !== undefined) style = result;
      }

      if (style == "def" && parserConfig.styleDefs !== false)
        style = "variable";

      state.startOfLine = false;
      state.prevToken = isDefKeyword ? "def" : style || curPunc;
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase && state.tokenize != null || state.typeAtEndOfLine) return CodeMirror.Pass;
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      var closing = firstChar == ctx.type;
      if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
      if (parserConfig.dontIndentStatements)
        while (ctx.type == "statement" && parserConfig.dontIndentStatements.test(ctx.info))
          ctx = ctx.prev;
      if (hooks.indent) {
        var hook = hooks.indent(state, ctx, textAfter, indentUnit);
        if (typeof hook == "number") return hook;
      }
      var switchBlock = ctx.prev && ctx.prev.info == "switch";
      if (parserConfig.allmanIndentation && /[{}]/.test(firstChar)) {
        while (ctx.type != "top" && ctx.type != "}") ctx = ctx.prev;
        return ctx.indented;
      }
      if (ctx.type == "statement")
        return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit);
      if (ctx.align && (!dontAlignCalls || ctx.type != ")"))
        return ctx.column + (closing ? 0 : 1);
      if (ctx.type == "}" && ctx.prev.type == "statement")
        return ctx.prev.indented;
      return ctx.indented + (closing ? 0 : indentUnit);
    },

    electricInput: indentSwitch ? /^\s*(?:case .*?:|default:|\{\}?)$/ : /^\s*[{}]$/,
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    blockCommentContinue: " * ",
    lineComment: "//",
    fold: "brace"
  };
});

// Java 语言定义
CodeMirror.defineMode("java", function(config, parserConfig) {
  return CodeMirror.getMode(config, {
    name: "clike",
    keywords: {
      "abstract": true, "assert": true, "boolean": true, "break": true, "byte": true,
      "case": true, "catch": true, "char": true, "class": true, "const": true,
      "continue": true, "default": true, "do": true, "double": true, "else": true,
      "enum": true, "extends": true, "final": true, "finally": true, "float": true,
      "for": true, "goto": true, "if": true, "implements": true, "import": true,
      "instanceof": true, "int": true, "interface": true, "long": true, "native": true,
      "new": true, "package": true, "private": true, "protected": true, "public": true,
      "return": true, "short": true, "static": true, "strictfp": true, "super": true,
      "switch": true, "synchronized": true, "this": true, "throw": true, "throws": true,
      "transient": true, "try": true, "void": true, "volatile": true, "while": true
    },
    types: {
      "String": true, "Object": true, "Integer": true, "Long": true, "Double": true,
      "Float": true, "Boolean": true, "Character": true, "Byte": true, "Short": true,
      "List": true, "Map": true, "Set": true, "Collection": true, "ArrayList": true,
      "HashMap": true, "HashSet": true, "LinkedList": true, "TreeMap": true, "TreeSet": true
    },
    atoms: {
      "true": true, "false": true, "null": true
    },
    blockKeywords: {
      "if": true, "else": true, "while": true, "for": true, "do": true, "try": true,
      "catch": true, "finally": true, "switch": true, "case": true, "default": true,
      "class": true, "interface": true, "enum": true
    },
    defKeywords: {
      "class": true, "interface": true, "enum": true, "package": true, "import": true
    },
    typeFirstDefinitions: true,
    atoms: {"true": true, "false": true, "null": true},
    number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:\d[\d_]*\.?[\d_]*|\.[\d_]+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?$/i,
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      }
    },
    modeProps: {fold: ["brace", "import"], closeBrackets: {triples: '"""'}}
  });
});

CodeMirror.defineMIME("text/x-java", "java");
CodeMirror.defineMIME("text/x-java-source", "java");