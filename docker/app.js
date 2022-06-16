const schedule = require('node-schedule');
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


const currMins = new Date().getMinutes()
console.log("ran at: " + currMins)
schedule.scheduleJob(`*/${currMins+ 7} * * * * *`, function(fireDate){
	console.log(new Date())
	k8sApi.listNamespacedPod('default').then((res) => {
    console.log(res.body);
});
});



