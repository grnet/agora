module.exports = function(mongoose) {
	var ServiceProviderProfileSchema = new mongoose.Schema({  
		createdDate: { type: Date, required: true },
		modifiedDate: { type: Date, required: true },
		version: { type: String, required: true },
		intellectualPropertyRights: { type: String, rating: Number, tags: Array, required: false },
		csp: { type: String, rating: Number, tags: Array, required: false },
		ownership: { type: String, rating: Number, tags: Array, required: false },
		nationalLawGovernance: { type: String, rating: Number, tags: Array, required: false },
		concordanceNationalPrivacyActs: { type: String, rating: Number, tags: Array, required: false },
		externalSecurityAuditCertificate: { type: String, rating: Number, tags: Array, required: false },
		subcontractors: { type: String, rating: Number, tags: Array, required: false },
		protectionMinorsUsers: { type: String, rating: Number, tags: Array, required: false },
		serviceLevelAgreement: { type: String, rating: Number, tags: Array, required: false },
		csSecurity: { type: String, rating: Number, tags: Array, required: false },
		securityIncidentsHandling: { type: String, rating: Number, tags: Array, required: false },
		dataBackupRestore: { type: String, rating: Number, tags: Array, required: false },
		compatibility: { type: String, rating: Number, tags: Array, required: false },
		dataProtection: { type: String, rating: Number, tags: Array, required: false },
		personnel: { type: String, rating: Number, required: false },
		penalty: { type: String, rating: Number, required: false },
		supervision: { type: String, rating: Number, tags: Array, required: false },
		dataAvailability: { type: String, rating: Number, tags: Array, required: false },
		edpAudit: { type: String, rating: Number, tags: Array, required: false },
		qualityReview: { type: String, rating: Number, tags: Array, required: false },
		notification: { type: String,rating: Number, required: false },
		billing: { type: String, rating: Number, required: false },
		aai: { type: String, rating: Number, tags: Array, required: false },
		userProvisioning: { type: String, rating: Number, tags: Array, required: false },
		reportingMeteringSalesEstimates: { type: String, rating: Number, tags: Array, required: false },
		networkConnectivityAssociatedNetworkingCosts: { type: String, rating: Number, tags: Array, required: false },
		service_id: { type: String, required: true }
	});

var ServiceProviderProfile = mongoose.model('ServiceProviderProfile', ServiceProviderProfileSchema);

return ServiceProviderProfile;
}
