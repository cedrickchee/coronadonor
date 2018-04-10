import { buildApi, get, post, patch, destroy } from "redux-bees"

const apiEndpoints = {
	// Nouns
	getNouns: {
		method: get,
		path: "/nouns"
	},
	getNoun: {
		method: get,
		path: "/nouns/:description"
	},
	createNoun: {
		method: post,
		path: "/nouns"
	},

	// Verbs
	getVerbs: {
		method: get,
		path: "/verbs"
	},
	getVerb: {
		method: get,
		path: "/verbs/:description"
	},
	createVerb: {
		method: post,
		path: "/verbs"
	},

	// Donations
	getDonations: {
		method: get,
		path: "/donations"
	},
	getDonation: {
		method: get,
		path: "/donations/:scenario"
	},
	createDonation: {
		method: post,
		path: "/donations"
	},
	updateDonation: {
		method: patch,
		path: "/donations/:id"
	},
	destroyDonation: {
		method: destroy,
		path: "/donations/:id"
	},

	// Events
	getEvents: {
		method: get,
		path: "/events"
	},
	createEvent: {
		method: post,
		path: "/events"
	},
	updateEvent: {
		method: patch,
		path: "/events/:id"
	},
	destroyEvent: {
		method: destroy,
		path: "/events/:id"
	},

	// Proofs
	getProofs: {
		method: get,
		path: "/proofs"
	},
	createProof: {
		method: post,
		path: "/proofs"
	},
	updateProof: {
		method: patch,
		path: "/proofs/:id"
	},
	destroyProof: {
		method: destroy,
		path: "/proofs/:id"
	},

	// Scenarios
	getScenarios: {
		method: get,
		path: "/scenarios"
	},
	getScenario: {
		method: get,
		path: "/scenarios/:id"
	},
	createScenario: {
		method: post,
		path: "/scenarios"
	},
	updateScenario: {
		method: patch,
		path: "/scenarios/:id"
	},
	destroyScenario: {
		method: destroy,
		path: "/scenarios/:id"
	},
	dismissScenario: {
		method: patch,
		path: "/scenarios/:id"
	},
	interactWithScenario: {
		method: patch,
		path: "/scenarios/:id"
	},

	// Users
	getUsers: {
		method: get,
		path: "/users"
	},
	getUser: {
		method: get,
		path: "/users?filter[email]=:email"
	},
	getUserById: {
		method: get,
		path: "/users/:id"
	},
	createUser: {
		method: post,
		path: "/users"
	},
	updateUser: {
		method: patch,
		path: "/users/:id"
	},
	destroyUser: {
		method: destroy,
		path: "/users/:id"
	},

	// Scenarios related to users
	getUserDonations: {
		method: get,
		path: "/users/:id/donated"
	},
	getUserDos: {
		method: get,
		path: "/users/:id/done"
	},
	getUserRequests: {
		method: get,
		path: "/users/:id/requested"
	},
	getUserVerifications: {
		method: get,
		path: "/users/:id/verified"
	},

	// Login
	attemptLogin: {
		method: post,
		path: "/users/sign_in"
	}
}

let baseUrl

if (window.location.hostname === "localhost") {
	console.log("localhost detected, using dev URL")
	baseUrl = "http://localhost:4000"
} else {
	console.info("Live site, using production database")
	baseUrl = "https://lion-uat.herokuapp.com"
}

const config = {
	baseUrl: baseUrl
}

export default buildApi(apiEndpoints, config)
