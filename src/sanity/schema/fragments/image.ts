import { defineQuery } from 'next-sanity';
import groq from 'groq';
import * as v from 'valibot';

const defineFragment = (fragment: string) => {
  const schema = v.string;
  return defineQuery(fragment);
};

const imageFragment = defineFragment(groq`
  {
    _type,
    crop{
      _type,
      right,
      top,
      left,
      bottom
    },
    hotspot{
      _type,
      x,
      y,
      height,
      width,
    },
    asset->{...}
  }
`);
export { imageFragment };
