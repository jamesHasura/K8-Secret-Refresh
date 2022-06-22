const schedule = require('node-schedule');
const k8s = require('@kubernetes/client-node');
const axios = require('axios')

// Setup node k8s client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sApiAppsV1 = kc.makeApiClient(k8s.AppsV1Api);
const options = { "headers": { "Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } };

// gets a credential from an endpoint 
async function getToken() {
	try {
		const newToken = await axios.get(process.env.TOKEN_REFRESH_ENDPOINT, null, {
			'Content-Type': 'application/json'
		})
		return newToken.data.token // JPMC TO CHANGE BASED ON THEIR PAYLOAD 
	} catch (e) {
		throw e
	}
}

// update the secret manager 
async function updateSecretManager(token) {
	try {
		const patchPayload = [
			{
				"op": "replace",
				"path": "/data/token",
				"value": Buffer.from(`${token}`).toString('base64')

			}]
		// Update Secret in deployment 
		const patchRes = await k8sApi.patchNamespacedSecret("jpmc-secret", 'default', patchPayload, undefined, undefined, undefined, undefined, options)
		return patchRes.body
	} catch (e) {
		throw e
	}
}
// change the spec of the deployment which triggers rolling update
async function restartDeployment() {
	try {
		const patchDeploymentSpec = [
			{
				"op": "replace",
				"path": "/spec/template/metadata/annotations/scriptExecutedAt",
				"value": Date.now().toString()

			}
		];
		const patchRes = await k8sApiAppsV1.patchNamespacedDeployment('hasura', 'default', patchDeploymentSpec, undefined, undefined, undefined, undefined, options)
		return patchRes
	} catch (e) {
		throw e
	}

}
// job to retrieve the token and update the deployment
function refreshEnvWithNewToken() {
	return getToken().then(token => {
		updateSecretManager(token).then((res) => {
			restartDeployment().then((res) => {
				return res
			}).catch((e) => {
				throw e
			})
		}).catch((e) => {
			console.error(e)
			throw e
		})
	}).catch((e) => {
		console.error(e)
		throw e
	})
}


// Run the script on start
const currDate = new Date()
console.log("script started a job at: " + currDate)
refreshEnvWithNewToken((res) => {
	console.log("script successfully ran at: " + Date.now())
}).catch((e) => {
	console.error(e)
	throw e
})

// Reccuring cron job to refresh the token
const currMins = currDate.getMinutes()
schedule.scheduleJob(`${process.env.TOKEN_REFRESH_PERIOD}`, function () {
	console.log("script started a job at: " + currMins)
	refreshEnvWithNewToken().then(() => {
		console.log("script successfully ran at: " + Date.now())
		return true
	}).catch((e) => {
		console.error(e)
		throw e
	})
})