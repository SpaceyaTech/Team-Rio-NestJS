import { textToTitle } from '../text-to-title.util';

describe('textToTitle', () => {
  it('should be defined', () => {
    expect(textToTitle).toBeDefined();
  });

  it('should convert a string to title case', () => {
    expect(textToTitle('foo')).toEqual('Foo');
  });

  it('should convert a multi-word text to title case', () => {
    expect(textToTitle('foo bar')).toEqual('Foo Bar');
  });

  it('should convert a multi-case string to title case', () => {
    expect(textToTitle('fOo')).toEqual('Foo');
  });

  it('should convert a multi-case multi-word text to title case', () => {
    expect(textToTitle('fOo bAr')).toEqual('Foo Bar');
  });
});
