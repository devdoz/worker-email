export interface EmailMessage<Body = unknown> {
	readonly from: string
	readonly to: string
	readonly headers: Headers
	readonly raw: ReadableStream
	readonly rawSize: number

	setReject(reason: String): void
	forward(rcptTo: string, headers?: Headers): Promise<void>
}

export interface Env {
	email: any
}

export default {
	async email(message: EmailMessage, env: Env, ctx: Content) {
		const forward = await env.email.get('forward')
		if (!forward) {
			console.error('Not found forward email')
			message.setReject('Not found forward email')
			return
		}

		const allows = await env.email.get('allow')
		const allowList: string[] = JSON.parse(allows)
		if (allowList !== null && allowList.length > 0) {
			if (allowList.indexOf(message.from) == -1) {
				console.error('Address is not allow')
				message.setReject('Address is not allow')
				return
			}
		}

		const blocks = await env.email.get('block')
		const blockList: string[] = JSON.parse(blocks)
		if (blockList !== null && blockList.length > 0) {
			if (blockList.indexOf(message.from) != -1) {
				console.error('Address is blocked')
				message.setReject('Address is blocked')
				return
			}
		}

		const block_domains = await env.email.get('block_domains')
		const blockDomains: string[] = JSON.parse(block_domains)
		if (blockDomains !== null && blockDomains.length > 0) {
			blockDomains.forEach(item => {
				if (message.from.includes(item)) {
					console.error('Domain is blocked')
					message.setReject('Domain is blocked')
					return false
				}
			})
		}

		await message.forward(forward)
		console.log('forward success')
	},
}
