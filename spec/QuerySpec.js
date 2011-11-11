describe("Query", function() {
  
  describe("Manipulation", function() {
    var q;
    
    it('should return the first value for each query param', function() {
      q = new Query('?a=1&a=2&b=3&b=4&c=567');
      expect(q.getParamValue('a')).toEqual('1');
      expect(q.getParamValue('b')).toEqual('3');
      expect(q.getParamValue('c')).toEqual('567');
    });
    
    it('should return arrays for multi-valued query params', function() {
      q = new Query('?a=1&a=2&b=3&b=4&c=567');
      expect(q.getParamValues('a')[0]).toEqual('1');
      expect(q.getParamValues('a')[1]).toEqual('2');
      expect(q.getParamValues('b')[0]).toEqual('3');
      expect(q.getParamValues('b')[1]).toEqual('4');
      expect(q.getParamValues('c')[0]).toEqual('567');
    });

    it('should be able to add a new query param to a blank url', function() {
      q = new Query('').addParam('q', 'books');
      expect(q.toString()).toEqual('?q=books');
    });
       
    it('should be able to delete a query param', function() {
      q = new Query('?a=1&b=2&c=3&a=eh').deleteParam('b');
      expect(q.toString()).toEqual('?a=1&c=3&a=eh');
    });

    it('should be able to delete a query param by value', function() {
      q = new Query('a=1&b=2&c=3&a=eh').deleteParam('a', 'eh');
      expect(q.toString()).toEqual('?b=2&c=3');
    });

    it('should be able to add a null param', function() {
      q = new Query('?a=1&b=2&c=3').addParam('d');
      expect(q.toString()).toEqual('?a=1&b=2&c=3&d=');
    });

    it('should be able to add a key and a value', function() {
      q = new Query('?a=1&b=2&c=3').addParam('d', '4');
      expect(q.toString()).toEqual('?a=1&b=2&c=3&d=4');
    });

    it('should be able to prepend a key and a value', function() {
      q = new Query('?a=1&b=2&c=3').addParam('d', '4', 0);
      expect(q.toString()).toEqual('?d=4&a=1&b=2&c=3');
    });

    it('should be able to delete and replace a query param', function() {
      q = new Query('?a=1&b=2&c=3').deleteParam('a').addParam('a', 'eh');
      expect(q.toString()).toEqual('?b=2&c=3&a=eh');
    });

    it('should be able to directly replace a query param', function() {
      q = new Query('?a=1&b=2&c=3').replaceParam('a', 'eh');
      expect(q.toString()).toEqual('?a=eh&b=2&c=3');
    });

    it('should be able to replace a query param value that does not exist', function() {
      q = new Query().replaceParam('page', 2);
      expect(q.toString()).toEqual('?page=2');
    });
  });
    
  describe("Semicolon as query param separator", function() {
    var q;

    it('should replace semicolons with ampersands', function() {
      q = new Query('?one=1;two=2;three=3');
      expect(q.toString()).toEqual('?one=1&two=2&three=3');
    });

    it('should replace semicolons with ampersands, delete the first param and add another', function() {
      q = new Query('?one=1;two=2;three=3&four=4')
          .deleteParam('one')
          .addParam('test', 'val', 1);
      expect(q.toString()).toEqual('?two=2&test=val&three=3&four=4');
    });
    
  });

  describe("Comparing encoded vs. non or partially encoded query param keys and values", function() {
    var q;

    it('is able to find the value of an encoded multiword key from a non encoded search', function() {
      q = new Query('?a=1&this%20is%20a%20multiword%20key=value&c=3')
      expect(q.getParamValue('this is a multiword key')).toEqual('value');
    });
    
    it('is able to find all value s of an encoded multiword key from a non encoded search', function() {
      q = new Query('?a=1&this%20is%20a%20multiword%20key=value&c=3')
      expect(q.getParamValues('this is a multiword key')[0]).toEqual('value');
    });

    it('is be able to delete a multiword encoded key', function() {
      q = new Query('?a=1&this%20is%20a%20multiword%20key=value&c=3')
        .deleteParam('this is a multiword key');
      expect(q.toString()).toEqual('?a=1&c=3');
    });

    it('is be able to delete a multiword encoded key by its value', function() {
      q = new Query('?a=1&b=this is a multiword value&c=3')
        .deleteParam('b', 'this%20is%20a%20multiword%20value');
      expect(q.toString()).toEqual('?a=1&c=3');
    });

    it('is able to replace a multiword query param', function() {
      q = new Query('?this is a multiword key=1')
        .replaceParam('this%20is%20a%20multiword%20key', 2);
      expect(q.toString()).toEqual('?this%20is%20a%20multiword%20key=2');
    });

    it('should be able to search for a plus-separated word pair', function() {
      q = new Query('?multi+word=true').replaceParam('multi word', 2); 
      expect(q.toString()).toEqual('?multi word=2');
    });
  });
});
