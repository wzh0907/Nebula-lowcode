import f from 'lodash/fp'

const formatTypeListGenerator = f.compose(
  f.map(key => ({name: formatName[key], type: key})),
  f.keys
)

export const FormatType = {
  NORMAL_TEXT: 'NORMAL_TEXT',
  NUM_THOUSAND: 'NUM_THOUSAND',
  NUM_THOUSAND_DECIMAL2: 'NUM_THOUSAND_DECIMAL2',
  PERCENT: 'PERCENT',
  PERCENT_DECIMAL2: 'PERCENT_DECIMAL2',
  DOLLAR_THOUSAND: 'DOLLAR_THOUSAND',
  DOLLAR_THOUSAND_DECIMAL2: 'DOLLAR_THOUSAND_DECIMAL2',
}

export const formatName = {
  [FormatType.NORMAL_TEXT]: '普通文本',
  [FormatType.NUM_THOUSAND]: '12,345',
  [FormatType.NUM_THOUSAND_DECIMAL2]: '1,234.10',
  [FormatType.PERCENT]: '12%',
  [FormatType.PERCENT_DECIMAL2]: '12.34%',
  [FormatType.DOLLAR_THOUSAND]: '¥123,456',
  [FormatType.DOLLAR_THOUSAND_DECIMAL2]: '¥123,346.78',
}

export const formatTypeList = formatTypeListGenerator(FormatType)
