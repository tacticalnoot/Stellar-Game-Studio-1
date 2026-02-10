self.onmessage = (e) => { const { payload } = e.data; self.postMessage({ proof: new Uint8Array(), publicInputs: new Uint8Array(), payload }); };
