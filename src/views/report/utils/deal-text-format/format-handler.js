import f from 'lodash/fp'
import numeral from 'numeral'
import { FormatType } from './format-def'

export const formatHandler = {
  [FormatType.NORMAL_TEXT]: f.identity,
  [FormatType.NUM_THOUSAND]: n => numeral(n).format('0,0'),
  [FormatType.NUM_THOUSAND_DECIMAL2]: n => numeral(n).format('0,0.00'),
  [FormatType.PERCENT]: n => numeral(n).format('0%'),
  [FormatType.PERCENT_DECIMAL2]: n => numeral(n).format('0.00%'),
  [FormatType.DOLLAR_THOUSAND]: n => `¥${numeral(n).format('0')}`,
  [FormatType.DOLLAR_THOUSAND_DECIMAL2]: n => `¥${numeral(n).format('0.00')}`,
}
