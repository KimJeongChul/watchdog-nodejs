# Watchdog nodejs

## Configure
```json
config.json (exampe)
{
    "webserverExecCmd": "./go-webserver",
    "webserverAddr": "https://localhost:9443/v2/healthCheck/", 
    "limitCnt": 3,
    "mailAddr": "[GOOGLE_EMAIL_ADDRESS]",
    "mailPassword": "[GOOGLE EMAIL PASSWORD]"
}
```
```bash
$ npm install
$ node watch.js
```
### Alive
![image](https://user-images.githubusercontent.com/10591350/97842351-d687fb80-1d2a-11eb-8eaa-d0839406145b.png)

### Failed
![image](https://user-images.githubusercontent.com/10591350/97843291-611d2a80-1d2c-11eb-9b2a-3d80aadec099.png)
![image](https://user-images.githubusercontent.com/10591350/97843357-80b45300-1d2c-11eb-93ea-361b9b660983.png)


### GMAIL
Set your google account -> https://support.google.com/accounts/answer/6010255 
https://myaccount.google.com/lesssecureapps
