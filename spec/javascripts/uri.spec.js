describe("Uri", function() {

  describe("Construction and re-stringification", function() {
    
    it("should convert empty constructor call to blank url", function() {
      expect(new Uri().toString()).toEqual('');
    });
    
    it("can construct empty string", function() {
      expect(new Uri().toString()).toEqual('');
    });
    
    it("can construct single slash", function() {
      expect(new Uri('/').toString()).toEqual('/');
    });
    
    it("can construct a relative path with a trailing slash", function() {
      expect(new Uri('tutorial1/').toString()).toEqual('tutorial1/');
    });
    
    it("can construct a relative path with leading and trailing slashes", function() {
      expect(new Uri('/experts/').toString()).toEqual('/experts/');
    });
    
    it("can construct a relative filename with leading slash", function() {
      expect(new Uri('/index.html').toString()).toEqual('/index.html');
    });
    
    it("can construct a relative directory and filename", function() {
      expect(new Uri('tutorial1/2.html').toString()).toEqual('tutorial1/2.html');
    });
    
    it("can construct a relative parent directory", function() {
      expect(new Uri('../').toString()).toEqual('../');
    });
    
    it("can construct a relative great grandparent directory", function() {
      expect(new Uri('../../../').toString()).toEqual('../../../');
    });
    
    it("can construct a relative current directory", function() {
      expect(new Uri('./').toString()).toEqual('./');
    });
    
    it("can construct a relative current directory sibling doc", function() {
      expect(new Uri('./index.html').toString()).toEqual('./index.html');
    });
    
    it("can construct a simple three level domain", function() {
      expect(new Uri('www.example.com').toString()).toEqual('www.example.com');
    });
    
    it("can construct a simple absolute url", function() {
      expect(new Uri('http://www.example.com/index.html').toString()).toEqual('http://www.example.com/index.html');
    });
    
    it("can construct a secure absolute url", function() {
      expect(new Uri('https://www.example.com/index.html').toString()).toEqual('https://www.example.com/index.html');
    });
    
    it("can construct a simple url with a custom port", function() {
      expect(new Uri('http://www.example.com:8080/index.html').toString()).toEqual('http://www.example.com:8080/index.html');
    });
    
    it("can construct a secure url with a custom port", function() {
      expect(new Uri('https://www.example.com:4433/index.html').toString()).toEqual('https://www.example.com:4433/index.html');
    });
    
    it("can construct a relative path with a hash part", function() {
      expect(new Uri('/index.html#about').toString()).toEqual('/index.html#about');
    });
    
    it("can construct a relative path with a hash part", function() {
      expect(new Uri('/index.html#about').toString()).toEqual('/index.html#about');
    });
    
    it("can construct an absolute path with a hash part", function() {
      expect(new Uri('http://example.com/index.html#about').toString()).toEqual('http://example.com/index.html#about');
    });
    
    it("can construct a relative path with a query string", function() {
      expect(new Uri('/index.html?a=1&b=2').toString()).toEqual('/index.html?a=1&b=2');
    });
    
    it("can construct an absolute path with a query string", function() {
      expect(new Uri('http://www.test.com/index.html?a=1&b=2').toString()).toEqual('http://www.test.com/index.html?a=1&b=2');
    });
    
    it("can construct an absolute path with a query string and hash", function() {
      expect(new Uri('http://www.test.com/index.html?a=1&b=2#a').toString()).toEqual('http://www.test.com/index.html?a=1&b=2#a');
    });
    
    it("can construct a url with multiple synonymous query values", function() {
      expect(new Uri('http://www.test.com/index.html?arr=1&arr=2&arr=3&arr=3&b=2').toString())
        .toEqual('http://www.test.com/index.html?arr=1&arr=2&arr=3&arr=3&b=2');
    });
    
    it("can construct a url with blank query value", function() {
      expect(new Uri('http://www.test.com/index.html?arr=1&arr=&arr=2').toString())
        .toEqual('http://www.test.com/index.html?arr=1&arr=&arr=2');
    });

    it("can construct a url without a scheme", function() {
      expect(new Uri('//www.test.com/').toString())
        .toEqual('//www.test.com/');
    });
	
    it('can construct an object using the old syntax', function() {
      expect(new jsUri('www.test.com/helloworld.html').toString())
        .toEqual('www.test.com/helloworld.html');
    });
  });

  describe("Manipulation", function() {
    var u;

    beforeEach(function() {
      u = new Uri('http://test.com');
    });
    
    it('can replace protocol', function() {
      u.protocol('https');
      expect(u.toString()).toEqual('https://test.com');
    });
    
    it('can replace protocol with colon suffix', function() {
      u.protocol('https:');
      expect(u.toString()).toEqual('https://test.com');
    });
    
    it('keeps authority prefix when protocol is removed', function() {
      u.protocol(null);
      expect(u.toString()).toEqual('//test.com');
    });
    
    it('can disable authority prefix but keep protocol', function() {
      u.hasAuthorityPrefix(false);
      expect(u.toString()).toEqual('http://test.com');
    });
    
    it('can add user info', function() {
      u.userInfo('username:password');
      expect(u.toString()).toEqual('http://username:password@test.com');
    });
    
    it('can add user info with trailing at', function() {
      u.userInfo('username:password@');
      expect(u.toString()).toEqual('http://username:password@test.com');
    });

    it('can add a hostname to a relative path', function() {
      u = new Uri('/index.html');
      u.host('wherever.com');
      expect(u.toString()).toEqual('wherever.com/index.html');
    });

    it('can change a hostname ', function() {
      u.host('wherever.com');
      expect(u.toString()).toEqual('http://wherever.com');
    });

    it('should not add a port when there is no hostname', function() {
      u = new Uri('/index.html');
      u.port(8080);
      expect(u.toString()).toEqual('/index.html');
    });
    
    it('should be able to change the port', function() {
      u.port(8080);
      expect(u.toString()).toEqual('http://test.com:8080');
    });
    
    it('should be able to add a path to a domain', function() {
      u = new Uri('test.com');
      u.path('/some/article.html');
      expect(u.toString()).toEqual('test.com/some/article.html');
    });
    
    it('should be able to change a path', function() {
      u.path('/some/article.html');
      expect(u.toString()).toEqual('http://test.com/some/article.html');
    });

    it('should be able to delete a path', function() {
      u = new Uri('http://test.com/index.html');
      u.path(null);
      expect(u.toString()).toEqual('http://test.com');
    });

    it('should be able to empty a path', function() {
      u = new Uri('http://test.com/index.html');
      u.path('');
      expect(u.toString()).toEqual('http://test.com');
    });
    
    it('should be able to add a query to nothing', function() {
      u = new Uri('');
      u.query('this=that&something=else');
      expect(u.toString()).toEqual('?this=that&something=else');
    });
    
    it('should be able to add a query to a relative path', function() {
      u = new Uri('/some/file.html');
      u.query('this=that&something=else');
      expect(u.toString()).toEqual('/some/file.html?this=that&something=else');
    });
    
    it('should be able to add a query to a domain', function() {
      u = new Uri('test.com');
      u.query('this=that&something=else');
      expect(u.toString()).toEqual('test.com/?this=that&something=else');
    });

    it('should be able to swap a query', function() {
      u = new Uri('www.test.com?this=that&a=1&b=2;c=3');
      u.query('this=that&something=else');
      expect(u.toString()).toEqual('www.test.com/?this=that&something=else');
    });
    
    it('should be able to delete a query', function() {
      u = new Uri('www.test.com?this=that&a=1&b=2;c=3');
      u.query(null);
      expect(u.toString()).toEqual('www.test.com');
    });
    
    it('should be able to empty a query', function() {
      u = new Uri('www.test.com?this=that&a=1&b=2;c=3');
      u.query('');
      expect(u.toString()).toEqual('www.test.com');
    });
    
    it('should be able to add an anchor to a domain', function() {
      u = new Uri('test.com');
      u.anchor('content');
      expect(u.toString()).toEqual('test.com/#content');
    });
    
    it('should be able to add an anchor with a hash prefix to a domain', function() {
      u = new Uri('test.com');
      u.anchor('#content');
      expect(u.toString()).toEqual('test.com/#content');
    });

    it('should be able to add an anchor to a path', function() {
      u = new Uri('a/b/c/123.html');
      u.anchor('content');
      expect(u.toString()).toEqual('a/b/c/123.html#content');
    });

    it('should be able to change an anchor', function() {
      u = new Uri('/a/b/c/index.html#content');
      u.anchor('about');
      expect(u.toString()).toEqual('/a/b/c/index.html#about');
    });
    
    it('should be able to empty an anchor', function() {
      u = new Uri('/a/b/c/index.html#content');
      u.anchor('');
      expect(u.toString()).toEqual('/a/b/c/index.html');
    });
    
    it('should be able to delete an anchor', function() {
      u = new Uri('/a/b/c/index.html#content');
      u.anchor(null);
      expect(u.toString()).toEqual('/a/b/c/index.html');
    });
  });
  
  describe("Fluent setters", function() {
    var u;
    
    it('can fluently add a path and anchor', function() {
      u = new Uri('www.yahoo.com').setPath('/index.html').setAnchor('content');
      expect(u.toString()).toEqual('www.yahoo.com/index.html#content');
    });
    
    it('can fluently replace host and protocol', function() {
      u = new Uri('www.yahoo.com/index.html').setHost('test.com').setProtocol('https');
      expect(u.toString()).toEqual('https://test.com/index.html');
    });

    it('can fluently construct a url out of nothing', function() {
      u = new Uri()
        .setPath('/index.html')
        .setAnchor('content')
        .setHost('www.test.com')
        .setPort(8080)
        .setUserInfo('username:password')
        .setProtocol('https')
        .setQuery('this=that&some=thing');
      expect(u.toString()).toEqual('https://username:password@www.test.com:8080/index.html?this=that&some=thing#content');
    });

    it('can fluently destroy all parts of a url', function() {
      u = new Uri('https://username:password@www.test.com:8080/index.html?this=that&some=thing#content')
        .setPath(null)
        .setAnchor(null)
        .setHost(null)
        .setPort(null)
        .setUserInfo(null)
        .setProtocol(null)
        .setQuery(null);
      expect(u.toString()).toEqual('');
    });
  });
  
  describe("Query manipulation wrappers", function() {
    var u;
    
    it('should return the first value for each query param', function() {
      u = new Uri('?a=1&a=2&b=3&b=4&c=567');
      expect(u.getQueryParamValue('a')).toEqual('1');
      expect(u.getQueryParamValue('b')).toEqual('3');
      expect(u.getQueryParamValue('c')).toEqual('567');
    });
    
    it('should return arrays for multi-valued query params', function() {
      u = new Uri('?a=1&a=2&b=3&b=4&c=567');
      expect(u.getQueryParamValues('a')[0]).toEqual('1');
      expect(u.getQueryParamValues('a')[1]).toEqual('2');
      expect(u.getQueryParamValues('b')[0]).toEqual('3');
      expect(u.getQueryParamValues('b')[1]).toEqual('4');
      expect(u.getQueryParamValues('c')[0]).toEqual('567');
    });

    it('should be able to add a new query param to a blank url', function() {
      u = new Uri('').addQueryParam('q', 'books');
      expect(u.toString()).toEqual('?q=books');
    });
       
    it('should be able to add query params to an absolute domain', function() {
      u = new Uri('http://www.microsoft.com').addQueryParam('testing', '123').addQueryParam('one', 1);
      expect(u.toString()).toEqual('http://www.microsoft.com/?testing=123&one=1');
    });

    it('should be able to delete a query param', function() {
      u = new Uri('test.com?a=1&b=2&c=3&a=eh').deleteQueryParam('b');
      expect(u.toString()).toEqual('test.com/?a=1&c=3&a=eh');
    });

    it('should be able to delete a query param by value', function() {
      u = new Uri('test.com?a=1&b=2&c=3&a=eh').deleteQueryParam('a', 'eh');
      expect(u.toString()).toEqual('test.com/?b=2&c=3');
    });

    it('should be able to add a null param', function() {
      u = new Uri('?a=1&b=2&c=3').addQueryParam('d');
      expect(u.toString()).toEqual('?a=1&b=2&c=3&d=');
    });

    it('should be able to add a key and a value', function() {
      u = new Uri('?a=1&b=2&c=3').addQueryParam('d', '4');
      expect(u.toString()).toEqual('?a=1&b=2&c=3&d=4');
    });

    it('should be able to prepend a key and a value', function() {
      u = new Uri('?a=1&b=2&c=3').addQueryParam('d', '4', 0);
      expect(u.toString()).toEqual('?d=4&a=1&b=2&c=3');
    });

    it('should be able to delete and replace a query param', function() {
      u = new Uri('?a=1&b=2&c=3').deleteQueryParam('a').addQueryParam('a', 'eh');
      expect(u.toString()).toEqual('?b=2&c=3&a=eh');
    });

    it('should be able to directly replace a query param', function() {
      u = new Uri('?a=1&b=2&c=3').replaceQueryParam('a', 'eh');
      expect(u.toString()).toEqual('?a=eh&b=2&c=3');
    });

    it('should be able to replace a query param value that does not exist', function() {
      u = new Uri().replaceQueryParam('page', 2);
      expect(u.toString()).toEqual('?page=2');
    });
  });
  
  describe("Object cloning", function() {
    it('should be able to clone a separate copy which does not share state', function() {
      var a = new Uri('?a=1'), b = a.clone().addQueryParam('b', '2');
      expect(a.toString()).not.toEqual(b.toString());
    });
  });
  
});
