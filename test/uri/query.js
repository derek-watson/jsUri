var expect = require('chai').expect

var Uri = (typeof(require) === 'function') ? require('../../Uri') : window.Uri

describe('Uri', function() {
  describe('query', function() {

    it('correctly parses query param expressions with multiple = separators', function() {
      var back = new Uri('?back=path/to/list?page=1').getQueryParamValue('back')
      expect(back).to.equal('path/to/list?page=1')
    })

    describe('construction', function() {
      var q

      it('should decode entities when parsing', function(){
        q = new Uri('?email=user%40example.com')
        expect(q.getQueryParamValue('email')).to.equal('user@example.com')
      })

      it('should include an equal sign if there was one present without a query value', function() {
        q = new Uri('?11=')
        expect(q.toString()).to.equal('?11=')
      })

      it('should not include an equal sign if one was not present originally', function() {
        q = new Uri('?11')
        expect(q.toString()).to.equal('?11')
      })

      it('should preserve missing equals signs across many keys', function() {
        q = new Uri('?11&12&13&14')
        expect(q.toString()).to.equal('?11&12&13&14')
      })

      it('should preserve missing equals signs in a mixed scenario', function() {
        q = new Uri('?11=eleven&12=&13&14=fourteen')
        expect(q.toString()).to.equal('?11=eleven&12=&13&14=fourteen')
      })
    })

    describe('manipulation', function() {
      var q

      it('should return the first value for each query param', function() {
        q = new Uri('?a=1&a=2&b=3&b=4&c=567')
        expect(q.getQueryParamValue('a')).to.equal('1')
        expect(q.getQueryParamValue('b')).to.equal('3')
        expect(q.getQueryParamValue('c')).to.equal('567')
      })

      it('should return arrays for multi-valued query params', function() {
        q = new Uri('?a=1&a=2&b=3&b=4&c=567')
        expect(q.getQueryParamValues('a')[0]).to.equal('1')
        expect(q.getQueryParamValues('a')[1]).to.equal('2')
        expect(q.getQueryParamValues('b')[0]).to.equal('3')
        expect(q.getQueryParamValues('b')[1]).to.equal('4')
        expect(q.getQueryParamValues('c')[0]).to.equal('567')
      })

      it('should be able to add a new query param to a blank url', function() {
        q = new Uri('').addQueryParam('q', 'books')
        expect(q.toString()).to.equal('?q=books')
      })

      it('should be able to delete a query param', function() {
        q = new Uri('?a=1&b=2&c=3&a=eh').deleteQueryParam('b')
        expect(q.toString()).to.equal('?a=1&c=3&a=eh')
      })

      it('should be able to delete a query param by value', function() {
        q = new Uri('?a=1&b=2&c=3&a=eh').deleteQueryParam('a', 'eh')
        expect(q.toString()).to.equal('?a=1&b=2&c=3')
      })

      it('should be able to add a null param', function() {
        q = new Uri('?a=1&b=2&c=3').addQueryParam('d')
        expect(q.toString()).to.equal('?a=1&b=2&c=3&d=')
      })

      it('should be able to add a key and a value', function() {
        q = new Uri('?a=1&b=2&c=3').addQueryParam('d', '4')
        expect(q.toString()).to.equal('?a=1&b=2&c=3&d=4')
      })

      it('should be able to prepend a key and a value', function() {
        q = new Uri('?a=1&b=2&c=3').addQueryParam('d', '4', 0)
        expect(q.toString()).to.equal('?d=4&a=1&b=2&c=3')
      })

      it('should return query param values correctly', function() {
        q = new Uri('').addQueryParam('k', 'value@example.com')
        expect(q.getQueryParamValue('k')).to.equal('value@example.com')
      })

      it('should escape param values correctly', function() {
        q = new Uri('http://example.com').addQueryParam('k', 'user@example.org')
        expect(q.toString()).to.equal('http://example.com/?k=user%40example.org')
      })

      it('should be able to delete and replace a query param', function() {
        q = new Uri('?a=1&b=2&c=3').deleteQueryParam('a').addQueryParam('a', 'eh')
        expect(q.toString()).to.equal('?b=2&c=3&a=eh')
      })

      it('should be able to directly replace a query param', function() {
        q = new Uri('?a=1&b=2&c=3').replaceQueryParam('a', 'eh')
        expect(q.toString()).to.equal('?a=eh&b=2&c=3')
      })

      it('should be able to replace a query param value that does not exist', function() {
        q = new Uri().replaceQueryParam('page', 2)
        expect(q.toString()).to.equal('?page=2')
      })

      it('should be able to handle multiple values for the same key', function() {
        q = new Uri().addQueryParam('a', 1)
        expect(q.toString()).to.equal('?a=1')
        expect(q.getQueryParamValues('a').length).to.equal(1)
        q.addQueryParam('a', 2)
        expect(q.toString()).to.equal('?a=1&a=2')
        expect(q.getQueryParamValues('a').length).to.equal(2)
        q.addQueryParam('a', 3)
        expect(q.toString()).to.equal('?a=1&a=2&a=3')
        expect(q.getQueryParamValues('a').length).to.equal(3)
        q.deleteQueryParam('a', 2)
        expect(q.toString()).to.equal('?a=1&a=3')
        expect(q.getQueryParamValues('a').length).to.equal(2)
        q.deleteQueryParam('a')
        expect(q.toString()).to.equal('')
        expect(q.getQueryParamValues('a').length).to.equal(0)
      })
    })

    describe('semicolon as query param separator', function() {
      var q

      it('should replace semicolons with ampersands', function() {
        q = new Uri('?one=1;two=2;three=3')
        expect(q.toString()).to.equal('?one=1&two=2&three=3')
      })

      it('should replace semicolons with ampersands, delete the first param and add another', function() {
        q = new Uri('?one=1;two=2;three=3&four=4').deleteQueryParam('one').addQueryParam('test', 'val', 1)
        expect(q.toString()).to.equal('?two=2&test=val&three=3&four=4')
      })
    })

    describe('comparing encoded vs. non or partially encoded query param keys and values', function() {
      var q

      it('is able to find the value of an encoded multiword key from a non encoded search', function() {
        q = new Uri('?a=1&this%20is%20a%20multiword%20key=value&c=3')
        expect(q.getQueryParamValue('this is a multiword key')).to.equal('value')
      })

      it('is able to on the fly decode an encoded param value', function() {
        q = new Uri('?a=1&b=this%20is%20a%20multiword%20val&c=3')
        expect(q.getQueryParamValue('b')).to.equal('this is a multiword val')
      })

      it('is able to on the fly decode a space-encoded param value', function() {
        q = new Uri('?a=1&b=this is a multiword value&c=3')
        expect(q.getQueryParamValue('b')).to.equal('this is a multiword value')
      })

      it('is able to on the fly decode a double-encoded param value', function() {
        q = new Uri('?a=1&b=this%2520is%2520a%2520multiword%2520value&c=3')
        expect(q.getQueryParamValue('b')).to.equal('this%20is%20a%20multiword%20value')
      })

      it('is able to find all value s of an encoded multiword key from a non encoded search', function() {
        q = new Uri('?a=1&this%20is%20a%20multiword%20key=value&c=3')
        expect(q.getQueryParamValues('this is a multiword key')[0]).to.equal('value')
      })

      it('is be able to delete a multiword encoded key', function() {
        q = new Uri('?a=1&this%20is%20a%20multiword%20key=value&c=3').deleteQueryParam('this is a multiword key')
        expect(q.toString()).to.equal('?a=1&c=3')
      })

      it('is able to replace a multiword query param', function() {
        q = new Uri('?this is a multiword key=1').replaceQueryParam('this%20is%20a%20multiword%20key', 2)
        expect(q.toString()).to.equal('?this%20is%20a%20multiword%20key=2')
      })

      it('should be able to search for a plus-separated word pair', function() {
        q = new Uri('?multi+word+key=true').replaceQueryParam('multi word key', 2)
        expect(q.toString()).to.equal('?multi word key=2')
      })
    })
  })
})
