module.exports = {
  dev: {
    opsServer: 'http://10.0.10.67:8880',
    fileServer: 'https://filesystem.api.jituancaiyun.com/sfs/webUpload/srvfile?fileType=2&src=cdn',
    deploy: 'http://deploy.uban360.net'
  },
  pro: {
    opsServer: 'http://192.168.200.3:8888',
    fileServer: 'http://192.169.208.21:8081/sfs/webUpload/srvfile?fileType=2&src=cdn',
    deploy: 'https://deploy.uban360.com'
  }
}
