export function createWorker<Input, Result>(worker: Worker | URL) {
	const workerObj = worker instanceof URL ? new Worker(worker) : worker

	return {
		run: (data: Input) => {
			return new Promise<Result>((resolve, reject) => {
				workerObj.onmessage = (e: MessageEvent<Result>) => {
					resolve(e.data)
				}

				workerObj.onerror = (e) => {
					reject(e)
				}

				workerObj.postMessage(data)
			})
		},
		terminate: () => workerObj.terminate(),
	}
}
