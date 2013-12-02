var expect = require('chai').expect

var Uri = (typeof(require) === 'function') ? require('../../Uri') : window.Uri

describe('Uri', function() {
  describe('toString()', function() {
    it('should convert empty constructor call to blank url', function() {
      expect(new Uri().toString()).to.equal('')
    })

    it('can construct empty string', function() {
      expect(new Uri().toString()).to.equal('')
    })

    it('can construct single slash', function() {
      expect(new Uri('/').toString()).to.equal('/')
    })

    it('can construct a relative path with a trailing slash', function() {
      expect(new Uri('tutorial1/').toString()).to.equal('tutorial1/')
    })

    it('can construct a relative path with leading and trailing slashes', function() {
      expect(new Uri('/experts/').toString()).to.equal('/experts/')
    })

    it('can construct a relative filename with leading slash', function() {
      expect(new Uri('/index.html').toString()).to.equal('/index.html')
    })

    it('can construct a relative directory and filename', function() {
      expect(new Uri('tutorial1/2.html').toString()).to.equal('tutorial1/2.html')
    })

    it('can construct a relative parent directory', function() {
      expect(new Uri('../').toString()).to.equal('../')
    })

    it('can construct a relative great grandparent directory', function() {
      expect(new Uri('../../../').toString()).to.equal('../../../')
    })

    it('can construct a relative current directory', function() {
      expect(new Uri('./').toString()).to.equal('./')
    })

    it('can construct a relative current directory sibling doc', function() {
      expect(new Uri('./index.html').toString()).to.equal('./index.html')
    })

    it('can construct a simple three level domain', function() {
      expect(new Uri('www.example.com').toString()).to.equal('www.example.com')
    })

    it('can construct a simple absolute url', function() {
      expect(new Uri('http://www.example.com/index.html').toString()).to.equal('http://www.example.com/index.html')
    })

    it('can construct a secure absolute url', function() {
      expect(new Uri('https://www.example.com/index.html').toString()).to.equal('https://www.example.com/index.html')
    })

    it('can construct a simple url with a custom port', function() {
      expect(new Uri('http://www.example.com:8080/index.html').toString()).to.equal('http://www.example.com:8080/index.html')
    })

    it('can construct a secure url with a custom port', function() {
      expect(new Uri('https://www.example.com:4433/index.html').toString()).to.equal('https://www.example.com:4433/index.html')
    })

    it('can construct a relative path with a hash part', function() {
      expect(new Uri('/index.html#about').toString()).to.equal('/index.html#about')
    })

    it('can construct a relative path with a hash part', function() {
      expect(new Uri('/index.html#about').toString()).to.equal('/index.html#about')
    })

    it('can construct an absolute path with a hash part', function() {
      expect(new Uri('http://example.com/index.html#about').toString()).to.equal('http://example.com/index.html#about')
    })

    it('can construct a relative path with a query string', function() {
      expect(new Uri('/index.html?a=1&b=2').toString()).to.equal('/index.html?a=1&b=2')
    })

    it('can construct an absolute path with a query string', function() {
      expect(new Uri('http://www.test.com/index.html?a=1&b=2').toString()).to.equal('http://www.test.com/index.html?a=1&b=2')
    })

    it('can construct an absolute path with a query string and hash', function() {
      expect(new Uri('http://www.test.com/index.html?a=1&b=2#a').toString()).to.equal('http://www.test.com/index.html?a=1&b=2#a')
    })

    it('can construct a url with multiple synonymous query values', function() {
      expect(new Uri('http://www.test.com/index.html?arr=1&arr=2&arr=3&arr=3&b=2').toString()).to.equal('http://www.test.com/index.html?arr=1&arr=2&arr=3&arr=3&b=2')
    })

    it('can construct a url with blank query value', function() {
      expect(new Uri('http://www.test.com/index.html?arr=1&arr=&arr=2').toString()).to.equal('http://www.test.com/index.html?arr=1&arr=&arr=2')
    })

    it('can construct a url without a scheme', function() {
      expect(new Uri('//www.test.com/').toString()).to.equal('//www.test.com/')
    })

    it('can construct a path and single query kvp', function() {
      expect(new Uri('/contacts?name=m').toString()).to.equal('/contacts?name=m')
    })

    it('returns successfully returns the origin with a scheme, auth, host and port', function() {
      expect(new Uri('http://me:here@test.com:81/this/is/a/path').origin()).to.equal('http://me:here@test.com:81')
    })
  })
})
