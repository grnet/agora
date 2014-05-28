'use strict';

describe('agoraApp', function() {

  it('should get the home page', function() {

    browser.driver.get('http://localhost:1337/');

    expect(true).toEqual(true);
  });
});
