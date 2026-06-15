import { DISCOVER_LINKS, MORE_LINKS } from '@/constants/navigation';

describe('navigation discovery links', () => {
  it('includes all planned public parity routes on the home discover surface', () => {
    expect(DISCOVER_LINKS.map((item) => item.href)).toEqual(
      expect.arrayContaining([
        '/belgeler',
        '/topluluk',
        '/almanyada-yasam',
        '/ekibimize-katil',
        '/tatil',
      ])
    );
  });

  it('exposes the new public content screens from Daha Fazla', () => {
    expect(MORE_LINKS.map((item) => item.href ?? item.external ?? '')).toEqual(
      expect.arrayContaining([
        '/topluluk',
        '/almanyada-yasam',
        '/ekibimize-katil',
        '/tatil',
      ])
    );
  });
});
