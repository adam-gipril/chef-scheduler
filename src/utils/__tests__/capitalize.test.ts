import { capitalize } from '..';

describe('util: capitalize', () => {
  const string = 'my BEEFY haunches';
  const capitalized = capitalize(string);

  it('capitalizes the first character of a string', () => {
    expect(capitalized[0]).toBe('M');
  });

  it('converts every other character to lowercase', () => {
    const [, ...rest] = capitalized;
    rest.forEach(char => expect(char).toBe(char.toLowerCase()));
  });
});
