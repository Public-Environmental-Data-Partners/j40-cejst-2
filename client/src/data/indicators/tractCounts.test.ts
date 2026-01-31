import {
  TOTAL_TRACT_COUNT,
  DEFAULT_DISADVANTAGED_COUNT,
  INDICATOR_TRACT_COUNTS,
  getSelectedTractCount,
} from './tractCounts';

describe('tractCounts', () => {
  describe('constants', () => {
    it('TOTAL_TRACT_COUNT is 74134', () => {
      expect(TOTAL_TRACT_COUNT).toBe(74_134);
    });

    it('DEFAULT_DISADVANTAGED_COUNT is 28569', () => {
      expect(DEFAULT_DISADVANTAGED_COUNT).toBe(28_569);
    });

    it('INDICATOR_TRACT_COUNTS includes expected indicator ids with counts', () => {
      expect(INDICATOR_TRACT_COUNTS.lowInc).toBe(25_987);
      expect(INDICATOR_TRACT_COUNTS.asthma).toBe(130);
      expect(INDICATOR_TRACT_COUNTS.tribalLands).toBe(320);
    });
  });

  describe('getSelectedTractCount', () => {
    it('returns DEFAULT_DISADVANTAGED_COUNT when identifiedAsDisadvantaged and no indicators', () => {
      expect(
          getSelectedTractCount({
            identifiedAsDisadvantaged: true,
            indicators: {},
          }),
      ).toBe(DEFAULT_DISADVANTAGED_COUNT);
    });

    it('returns DEFAULT_DISADVANTAGED_COUNT when identifiedAsDisadvantaged and all indicators false', () => {
      expect(
          getSelectedTractCount({
            identifiedAsDisadvantaged: true,
            indicators: {lowInc: false, asthma: false},
          }),
      ).toBe(DEFAULT_DISADVANTAGED_COUNT);
    });

    it('returns per-burden count when single indicator selected', () => {
      expect(
          getSelectedTractCount({
            identifiedAsDisadvantaged: false,
            indicators: {lowInc: true},
          }),
      ).toBe(25_987);
    });

    it('returns sum when multiple indicators selected', () => {
      expect(
          getSelectedTractCount({
            identifiedAsDisadvantaged: false,
            indicators: {lowInc: true, asthma: true},
          }),
      ).toBe(25_987 + 130);
    });

    it('ignores unchecked indicators', () => {
      expect(
          getSelectedTractCount({
            identifiedAsDisadvantaged: false,
            indicators: {lowInc: true, asthma: false},
          }),
      ).toBe(25_987);
    });

    it('ignores unknown indicator ids', () => {
      expect(
          getSelectedTractCount({
            identifiedAsDisadvantaged: false,
            indicators: {unknownId: true},
          }),
      ).toBe(0);
    });
  });
});
