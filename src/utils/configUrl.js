let host
if (process.env.NODE_ENV === 'test') {
  host = 'http://111.231.101.78:9002'
} else if (process.env.NODE_ENV === 'production') {
  host = ''
} else if (process.env.NODE_ENV === 'lib') {
  host = ''
} else if (process.env.NODE_ENV === 'development') {
  host = 'http://127.0.0.1:8081'
}
const connfig = {
  host: host
}

export default connfig
