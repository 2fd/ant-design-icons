import { camelcase } from './utils'

describe('camelcase', () => {
  const cases = {
    'signal-3g': 'Signal3G',
    'video-4k-box': 'Video4KBox',
  }

  for (const [value, expected] of Object.entries(cases)) {
    test(`should format "${value}" to "${expected}"`, () => expect(camelcase(value)).toBe(expected))
  }
})
