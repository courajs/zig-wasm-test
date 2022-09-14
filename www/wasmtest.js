// WebAssembly is all little endian
// https://webassembly.org/docs/portability/
const LITTLE_ENDIAN = true;

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

function get_slice(instance, slice_ptr_index) {
  // const Slice = packed struct {
  //     ptr: u32,
  //     len: u32,
  // };
  let slice_ptr_view = new DataView(instance.exports.memory.buffer, slice_ptr_index, 2*4);
  let data_ptr = slice_ptr_view.getUint32(0, LITTLE_ENDIAN);
  let data_len = slice_ptr_view.getUint32(4, LITTLE_ENDIAN);

  return new Uint8Array(instance.exports.memory.buffer, data_ptr, data_len);
}

async function go() {
  let response = await fetch('wasmtest.wasm');
  let body = await response.arrayBuffer();
  let {module, instance} = await WebAssembly.instantiate(body, imports);

  let index_of_slice_ptr = instance.exports.fill(300);
  let slice_content = get_slice(instance, index_of_slice_ptr);
  let full_content = new Uint8Array(instance.exports.memory.buffer);

  window.junk = {
    instance,
    module,
    slice_content,
    full_content,
  };

  console.log(junk);
  console.log(instance.exports);
}

go();
