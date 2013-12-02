var expect = require('chai').expect

var Uri = (typeof(require) === 'function') ? require('../Uri') : window.Uri

describe('Uri', function() {
  var u

  beforeEach(function() {
    u = new Uri('http://test.com')
  })

  it('can replace protocol', function() {
    u.protocol('https')
    expect(u.toString()).to.equal('https://test.com')
  })

  it('can replace protocol with colon suffix', function() {
    u.protocol('https:')
    expect(u.toString()).to.equal('https://test.com')
  })

  it('keeps authority prefix when protocol is removed', function() {
    u.protocol(null)
    expect(u.toString()).to.equal('//test.com')
  })

  it('can disable authority prefix but keep protocol', function() {
    u.hasAuthorityPrefix(false)
    expect(u.toString()).to.equal('http://test.com')
  })

  it('can add user info', function() {
    u.userInfo('username:password')
    expect(u.toString()).to.equal('http://username:password@test.com')
  })

  it('can add user info with trailing at', function() {
    u.userInfo('username:password@')
    expect(u.toString()).to.equal('http://username:password@test.com')
  })

  it('can add a hostname to a relative path', function() {
    u = new Uri('/index.html')
    u.host('wherever.com')
    expect(u.toString()).to.equal('wherever.com/index.html')
  })

  it('can change a hostname ', function() {
    u.host('wherever.com')
    expect(u.toString()).to.equal('http://wherever.com')
  })

  it('should not add a port when there is no hostname', function() {
    u = new Uri('/index.html')
    u.port(8080)
    expect(u.toString()).to.equal('/index.html')
  })

  it('should be able to change the port', function() {
    u.port(8080)
    expect(u.toString()).to.equal('http://test.com:8080')
  })

  it('should be able to add a path to a domain', function() {
    u = new Uri('test.com')
    u.path('/some/article.html')
    expect(u.toString()).to.equal('test.com/some/article.html')
  })

  it('should be able to change a path', function() {
    u.path('/some/article.html')
    expect(u.toString()).to.equal('http://test.com/some/article.html')
  })

  it('should be able to delete a path', function() {
    u = new Uri('http://test.com/index.html')
    u.path(null)
    expect(u.toString()).to.equal('http://test.com')
  })

  it('should be able to empty a path', function() {
    u = new Uri('http://test.com/index.html')
    u.path('')
    expect(u.toString()).to.equal('http://test.com')
  })

  it('should be able to add a query to nothing', function() {
    u = new Uri('')
    u.query('this=that&something=else')
    expect(u.toString()).to.equal('?this=that&something=else')
  })

  it('should be able to add a query to a relative path', function() {
    u = new Uri('/some/file.html')
    u.query('this=that&something=else')
    expect(u.toString()).to.equal('/some/file.html?this=that&something=else')
  })

  it('should be able to add a query to a domain', function() {
    u = new Uri('test.com')
    u.query('this=that&something=else')
    expect(u.toString()).to.equal('test.com/?this=that&something=else')
  })

  it('should be able to swap a query', function() {
    u = new Uri('www.test.com?this=that&a=1&b=2c=3')
    u.query('this=that&something=else')
    expect(u.toString()).to.equal('www.test.com/?this=that&something=else')
  })

  it('should be able to delete a query', function() {
    u = new Uri('www.test.com?this=that&a=1&b=2c=3')
    u.query(null)
    expect(u.toString()).to.equal('www.test.com')
  })

  it('should be able to empty a query', function() {
    u = new Uri('www.test.com?this=that&a=1&b=2c=3')
    u.query('')
    expect(u.toString()).to.equal('www.test.com')
  })

  it('should be able to add an anchor to a domain', function() {
    u = new Uri('test.com')
    u.anchor('content')
    expect(u.toString()).to.equal('test.com/#content')
  })

  it('should be able to add an anchor with a hash prefix to a domain', function() {
    u = new Uri('test.com')
    u.anchor('#content')
    expect(u.toString()).to.equal('test.com/#content')
  })

  it('should be able to add an anchor to a path', function() {
    u = new Uri('a/b/c/123.html')
    u.anchor('content')
    expect(u.toString()).to.equal('a/b/c/123.html#content')
  })

  it('should be able to change an anchor', function() {
    u = new Uri('/a/b/c/index.html#content')
    u.anchor('about')
    expect(u.toString()).to.equal('/a/b/c/index.html#about')
  })

  it('should be able to empty an anchor', function() {
    u = new Uri('/a/b/c/index.html#content')
    u.anchor('')
    expect(u.toString()).to.equal('/a/b/c/index.html')
  })

  it('should be able to delete an anchor', function() {
    u = new Uri('/a/b/c/index.html#content')
    u.anchor(null)
    expect(u.toString()).to.equal('/a/b/c/index.html')
  })

  it('should be able to get single encoded values', function() {
    u = new Uri('http://example.com/search?q=%40')
    expect(u.getQueryParamValue('q')).to.equal('@')
  })

  it('should be able to get double encoded values', function() {
    u = new Uri('http://example.com/search?q=%2540')
    expect(u.getQueryParamValue('q')).to.equal('%40')
  })

  it('should be able to work with %40 values', function() {
    u = new Uri('http://example.com/search?q=%40&stupid=yes')
    u.deleteQueryParam('stupid')
    expect(u.toString()).to.equal('http://example.com/search?q=%40')
  })

  it('should be able to work with %25 values', function() {
    u = new Uri('http://example.com/search?q=100%25&stupid=yes')
    u.deleteQueryParam('stupid')
    expect(u.toString()).to.equal('http://example.com/search?q=100%25')
  })

  it('should insert missing slash when origin and path have no slash', function () {
    u = new Uri('http://test.com')
    u.setPath('relativePath')
    expect(u.toString()).to.equal('http://test.com/relativePath')
  })

  it('should remove extra slash when origin and path both provide a slash', function () {
    u = new Uri('http://test.com/')
    u.setPath('/relativePath')
    expect(u.toString()).to.equal('http://test.com/relativePath')
  })

  it('should remove extra slashes when origin and path both provide too many slashes', function () {
    u = new Uri('http://test.com//')
    u.setPath('//relativePath')
    expect(u.toString()).to.equal('http://test.com/relativePath')
  })

  it('should be able to clone a separate copy which does not share state', function() {
    var a = new Uri('?a=1'),
        b = a.clone().addQueryParam('b', '2')
    expect(a.toString()).to.not.equal(b.toString())
  })

  it('can add a trailing slash to the path', function() {
    var str = new Uri('http://www.example.com/path?arr=1&arr=2')
      .addTrailingSlash()
      .toString()
    expect(str).to.equal('http://www.example.com/path/?arr=1&arr=2')
  })

  it('preserves the format of file uris', function() {
    var str = 'file://c:/parent/child.ext'
    var uri = new Uri(str)
    expect(uri.toString()).to.equal(str)
  })

  it('correctly composes url encoded urls', function() {
     var originalQuery = '?k=%40v'
     var parsed = new Uri('http://example.com' + originalQuery)
     expect(parsed.query()).to.equal(originalQuery)
  })
})
