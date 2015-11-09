'use strict';

exports.section = function(name, options) {
  if (!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
};

exports.yell = function (msg) {
    return msg.toUpperCase();
};

exports.setChecked = function (value, currentValue) {
    if(value == currentValue) {
        return "checked"
    } else {
        return "";
    }
};

exports.getGravatarURL = function (user, size) {
    return user.gravatar(size);
}

exports.isActiveURL = function (url, route) {
  return url === route ? "active" : "";
}

exports.isHiddenURL = function (url, route) {
  return url === route ? "" : "hidden";
}

exports.equal = function(lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
}


// Compare
// Usage:
// {{#compare unicorns ponies operator="<"}}
//  I knew it, unicorns are just low-quality ponies!
// {{/compare}}

exports.compare = function(lvalue, rvalue, options) {

  if (arguments.length < 3)
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

  operator = options.hash.operator || "==";

  var operators = {
    '==': function (l, r) {
      return l == r;
    },
    '===': function (l, r) {
      return l === r;
    },
    '!=': function (l, r) {
      return l != r;
    },
    '<': function (l, r) {
      return l < r;
    },
    '>': function (l, r) {
      return l > r;
    },
    '<=': function (l, r) {
      return l <= r;
    },
    '>=': function (l, r) {
      return l >= r;
    },
    'typeof': function (l, r) {
      return typeof l == r;
    }
  }

  if (!operators[operator])
    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

  var result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }

}
