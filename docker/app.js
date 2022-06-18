const schedule = require('node-schedule');
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();


console.log(Buffer.from("bobby").toString('base64'))
const currMins = new Date().getMinutes()
console.log("ran at: " + currMins)
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
let result = k8sApi.listNamespacedSecret('default').then(res => console.log(res.body.items[1].metadata.name))
/*
const patch = [
	{
		"op": "replace",
		"path": "/data/username",
		"value": Buffer.from("jim").toString('base64')

	}
];
const options = { "headers": { "Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } };
*/
const k8sApiAppsV1 = kc.makeApiClient(k8s.AppsV1Api);
const patch = [
	{
		"op": "replace",
		"path": "/spec/template/metadata/labels/restartedAt",
		"value": "WTF141451"

	}
];
const options = { "headers": { "Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } };

k8sApiAppsV1.patchNamespacedDeployment('hasura', 'default', patch, undefined, undefined, undefined, undefined, options).then((res) => {
	console.log(res)
}).catch((err) => {
	console.log(err);
})

// schedule.scheduleJob(`*/4 * * * * * `, async function (fireDate) {
/**
 console.log(new Date())
k8sApi.patchNamespacedSecret("jpmc-secret", 'default', patch, undefined, undefined, undefined, undefined, options).then((res) => {
	const resa = res.body;
	console.log(resa);
}).catch((err) => {
	console.log(err)
});
});
*/



