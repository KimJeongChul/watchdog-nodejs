const request=require('request');
const {v4:uuidv4}=require('uuid');
const ps=require('ps-node');
const spawn=require('child_process').spawn;
const nodemailer = require('nodemailer');
var config = require('./config.json')

let isAlive=false;
let noResCnt=0;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: config.mailAddr,
        pass: config.mailPassword
    },
    tls: {
        rejectUnauthorize: false,
    }
  });

// startServer Start your webserver
function startServer(){
	serverSpawned=spawn(config.webserverExecCmd, ['./serverConfig.json']);
	serverSpawned.stdout.on('data',(data)=>{
		console.log('Spawned Std:'+data);
	});
	serverSpawned.stderr.on('data',(data)=>{
		console.log('Spawned Err:'+data);
	});
	serverSpawned.on('exit',(code)=>{
		console.log('Spawned Code:'+code);
    });
    return serverSpawned
};

// checkServer Check your webserver process
function checkServer(callback){
	ps.lookup({command:config.webserverExecCmd},(err,result)=>{
		console.log(result)
		if(result.length>0) callback(true);
		else callback(false);
	});
};

// Periodically check if the process is alive.
setInterval(()=>{
    checkServer((alive)=>{
        isAlive=alive;
        if(alive) {
            console.log('Process is alive');
        } else {
            console.log('Process is dead');
            serverSpawned = startServer();
        }
    });

    // Send request generate uuidv4! 
    request({
            method:'GET',
            uri:config.webserverAddr+uuidv4(),
            strictSSL:false
        }, (err,res,body)=>{
            if(err || body != "200"){
                // If the config nubmer of requests does not come, kill the webserver process and restart it.
                console.log("body : " + body + " err : " + err)
                noResCnt++;
                if(noResCnt>config.limitCnt) {
                    if(isAlive){
                        console.log('Kill Process');
                        serverSpawned.kill();
                        // Notify Email
                        let info = transporter.sendMail({
                            from: `"WatchDog" <${config.mailAddr}>`,
                            to: config.mailAddr,
                            subject: '[NOTIFY] Webserver Failed',
                            text: "Check your webserver status!",
                        }, function(err, info) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('Email Sent : ' + info.response);
                            }
                        });
                        setTimeout(()=>{
                            console.log('Start Process');
                            serverSpawned = startServer();
                        },3000);
                    } else {
                        console.log('Start Process');
                        noResCnt=0;
                        serverSpawned = startServer();
                    };
                };
            } else {
                noResCnt=0;
            };	
        }
    );
    
},5000);
