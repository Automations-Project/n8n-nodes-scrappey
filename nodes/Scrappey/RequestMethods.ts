import { IExecuteFunctions } from 'n8n-workflow';
import { handleBody } from './requestBodyBuilder';
import { genericHttpRequest } from '../../GenericFunctions';

export const PostRequest = async function (this: IExecuteFunctions) {
	const body = handleBody(this);
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};
