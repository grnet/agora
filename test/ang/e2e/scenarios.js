'use strict';

describe('agoraApp', function() {

  it('should get the home page', function() {

    browser.get('');

    expect('Hello, World!').toEqual('Hello, World!');
  });
});
