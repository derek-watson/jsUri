!function ($) {
  var uri = function(str) {
    return new Uri(str);
  }, 
  methods: {
    uri: uri
  };
  $.ender(methods, true);
}(ender);
