export class Recorder {
	
	constructor(width,height,codec) {
		
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker#browser_compatibility
		if(window.showSaveFilePicker&&(codec===0x6A706567||codec===0x706E6720)) {
			this.codec = codec;
			this.record = false;
			this.frameSize = [];
			this.width = width;
			this.height = height;
			this.bufferSize = (this.width*this.height)<<2;
			this.DataBuf = Module._malloc(this.bufferSize);
			this.DataArr = new Uint8Array(Module.HEAPU8.buffer,this.DataBuf,this.bufferSize);
			this.pixelBuf = Module._malloc(this.bufferSize);
			this.pixelArr = new Uint8Array(Module.HEAPU8.buffer,this.pixelBuf,this.bufferSize);
			this.encoder = Module.cwrap((this.codec==0x6A706567?"encodeJPG":"encodePNG"),"number",["number","number","number","number","number"]);
			this.input = document.createElement("input");
			this.input.type = "button";
			
			Object.assign(this.input.style,{
				"cursor":"pointer",
				"position":"absolute",
				"background":"#F00",
				"border":"none",
				"width":"17px",
				"height":"17px",
				"border-radius":"50%"
			});
			
			const onClick = async (e)=>{
				if(this.record===false) {
					const handle = await window.showSaveFilePicker({types:[{accept:{"video/quicktime":[".mov"]}}]});
					this.input.style.background = "#808080";
					this.writable = await handle.createWritable();
					const headerBuf = Module._malloc(11<<2);
					const headerArr = new Uint32Array(Module.HEAPU32.buffer,headerBuf,11);
					(Module.cwrap("header","void",["number"]))(headerArr.byteOffset);
					this.writable.write(headerArr);
					Module._free(headerBuf);
					this.record = true;
				}
				else {
					this.record = false;
					const frameSizeBuf = Module._malloc(this.frameSize.length<<2);
					const frameSizeArr = new Uint32Array(Module.HEAPU32.buffer,frameSizeBuf,this.frameSize.length);
					for(var n=0; n<this.frameSize.length; n++) frameSizeArr[n] = this.frameSize[n];
					const moovBuf = Module._malloc((184+(6*this.frameSize.length))<<2);
					const moovArr = new Uint32Array(Module.HEAPU32.buffer,moovBuf,184+(6*this.frameSize.length));
					(Module.cwrap("moov","void",["number","number","number","number","number","number"]))(moovArr.byteOffset,this.codec,width,height,frameSizeArr.byteOffset,this.frameSize.length);
					this.writable.write(moovArr);
					const mdatSizeBuf = Module._malloc(2<<2);
					const mdatSizeArr = new Uint32Array(Module.HEAPU32.buffer,mdatSizeBuf,2);
					(Module.cwrap("mdatSize","void",["number","number","number"]))(mdatSizeArr.byteOffset,frameSizeArr.byteOffset,this.frameSize.length);
					this.writable.write({type:"write",position:9<<2,data:mdatSizeArr});
					Module._free(mdatSizeBuf);
					Module._free(frameSizeBuf);
					Module._free(moovBuf);
					this.writable.close();
					this.writable = undefined;
					this.frameSize = [];
					this.input.style.background = "#F00";
				}
			}
			this.input.addEventListener("click",onClick);
			
			const resize = (e)=>{
				const sx = window.innerWidth/width;
				const sy = window.innerHeight/height;
				if(sx<sy) {
					Object.assign(this.input.style,{"right":"14px","top":(14+((window.innerHeight-height*sx)>>1))+"px"});
				}
				else {
					Object.assign(this.input.style,{"right":(14+((window.innerWidth-width*sy)>>1))+"px","top":"14px"});
				}
			}
			
			let tid = 0;
			window.addEventListener("resize",(e)=>{
				if(tid) clearTimeout(tid);
				tid = setTimeout((e)=>resize(),15);
			});
			resize();
			document.body.appendChild(this.input);
		}
		else {
			
			const p = document.createElement("p");
			p.textContent = "Not Supported: ";
			Object.assign(p.style,{"font-family":"Helvetica, sans-serif","font-size":"12px","color":"#DDD","position":"absolute","z-index":1024,"left":"6px","top":"0"});
			
			const a = document.createElement("a");
			a.textContent = "https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker#browser_compatibility";
			a.href = "https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker#browser_compatibility";
			
			Object.assign(a.style,{"color":"#DDD"});
			p.appendChild(a);
			document.body.appendChild(p);
		}
	}
	
	active() {
		return this.input&&this.record&&this.writable;
	}
	
	capture(gl) {
		gl.readPixels(0,0,this.width,this.height,gl.RGBA,gl.UNSIGNED_BYTE,this.pixelArr);
		const size = this.encoder(this.DataArr.byteOffset,this.pixelArr.byteOffset,this.width,this.height,4);
		if(size) {
			this.frameSize.push(size);
			this.writable.write(new Uint8Array(Module.HEAPU8.buffer,this.DataBuf,size));
		}
	}
};