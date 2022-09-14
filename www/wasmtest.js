// just keep a global ref to the instance around for convenience
var instance;
// this function will be imported for wasm to use
function console_log_ex(location, size) {
    var buffer = new Uint8Array(instance.exports.memory.buffer, location, size);
    var decoder = new TextDecoder();
    var string = decoder.decode(buffer);
    console.log(string);
}
// define our imports
var imports = {
    env: {
        console_log_ex: console_log_ex
    }
};

async function go() {
  let response = await fetch('wasmtest.wasm');
  let body = await response.arrayBuffer();
  let {module, instance} = await WebAssembly.instantiate(body, imports);
  window.module = module;
  window.instance = instance;

  let index_of_slice_struct = instance.exports.fill(9);
  let slices_view = new DataView(instance.exports.memory.buffer);
  // let ary = new Uint32Array(instance.exports.memory.buffer, index_of_slice_struct, 8);
  let ptr = slices_view.getUint32(index_of_slice_struct, true);
  let len = slices_view.getUint32(index_of_slice_struct+4, true);

  let slice_content = new Uint8Array(instance.exports.memory.buffer, ptr, len);

  window.junk = {
    index_of_slice_struct,
    slices_view,
    ptr,
    len,
    slice_content,
  };

  console.log(junk);

}

go();
