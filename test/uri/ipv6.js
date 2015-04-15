var expect = require('chai').expect

var Uri = (typeof(require) === 'function') ? require('../../Uri') : window.Uri

describe('Uri', function() {

  var u

  it('understand ipv6 host', function (){
    expect(new Uri('https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:12:').toString()).to.equal('https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:12')
    expect(new Uri('https://[::ffff:192.169.0.1]:12:').toString()).to.equal('https://[::ffff:192.169.0.1]:12')
    expect(new Uri('https://[2001:db8::68]:12:').toString()).to.equal('https://[2001:db8::68]:12')
  })

  it('should correct host and port on ipv6', function (){
    u = new Uri('ssh://[2001:db8:85a3:8d3:1319:8a2e:370:7348]')
    u.setHost('[2001:db8:85a3:8d3:1319:8a2e:370:73ff]');
    u.setPort(12);
    expect(u.toString()).to.equal('ssh://[2001:db8:85a3:8d3:1319:8a2e:370:73ff]:12')
  })

  it('should correct host and port on ipv6 colon uri', function (){
    u = new Uri('ssh://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:')
    u.setHost('[2001:db8:85a3:8d3:1319:8a2e:370:73ff]');
    u.setPort(12);
    expect(u.toString()).to.equal('ssh://[2001:db8:85a3:8d3:1319:8a2e:370:73ff]:12')
  })

  it('should correctly set path on ipv6 uri', function (){
    u = new Uri('https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:12')
    u.setPath('relativePath')
    expect(u.toString()).to.equal('https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:12/relativePath')
  })

  it('should correctly host, port and path on ipv6 colon uri', function (){
    u = new Uri('ssh://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:')
    u.setHost('[2001:db8:85a3:8d3:1319:8a2e:370:73ff]');
    u.setPort(12);
    u.setPath('relativePath')
    expect(u.toString()).to.equal('ssh://[2001:db8:85a3:8d3:1319:8a2e:370:73ff]:12:relativePath')
  })

  it('should correctly set path on ipv6 colon uri', function (){
    u = new Uri('https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:12:')
    u.setPath('relativePath')
    expect(u.toString()).to.equal('https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]:12:relativePath')
  })
})
