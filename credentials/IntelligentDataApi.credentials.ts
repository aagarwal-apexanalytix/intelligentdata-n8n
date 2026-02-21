import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IntelligentDataApi implements ICredentialType {
	name = 'intelligentDataApi';
	displayName = 'Intelligent Data API';
	documentationUrl = 'https://portal.smartvmapi.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your SmartVM API key (starts with "svm"). Get one at https://portal.smartvmapi.com.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.smartvmapi.com',
			required: true,
			description: 'API base URL. Use https://api.smartvmapi.com for production.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};
}
