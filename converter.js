function convert (json, name) {
  if (!name) {
    name = 'Foo';
  }
  let rootStruct={name, defines: []} //{name:string, type: string, index: string}
  let structs = [rootStruct]; //{name:'',defines:[]}

  Object.keys(json).map(key => {
    let keyType = '';
    switch (typeof json[key]) {
      case 'boolean':
        keyType = 'boolean';
        break;
      case 'number':
        keyType = 'i32';
        break;
      case 'string':
        keyType = 'string';
        break;
      case 'object':
        if (Array.isArray(json[key])) {
          if (json[key].length) {
            if (typeof json[key][0] === 'number') {
              keyType = `list<i32>`;
            } else if (typeof json[key][0] === 'string') {
              keyType = `list<string>`;
            } else {
              let newStructs = convert(json[key][0], key);
              let rootName = newStructs[newStructs.length - 1].name;
              keyType = `list<${rootName}>`;
              newStructs.map(item=>{
                structs.unshift(item)
              })

            } // 多维数组先不管
          }
        } else {
          let newStructs = convert(json[key], key);
          let rootName = newStructs[newStructs.length - 1].name;
          keyType = rootName;
          newStructs.map(item=>{
            structs.unshift(item)
          })
        }


        break;
      case 'function':
        break;
    }
    if (keyType) {
      let index = rootStruct.defines.length+1;
      let name = key
      rootStruct.defines.push({
        index,name, type: keyType,
      })
    }else{
      console.error('no keytype')
    }
  });

  return structs;
}

function print(structs=[]){
  return structs.map(struct=>{
    return`struct ${struct.name}{
${struct.defines.map(define=>{
return `    ${define.index}: required ${define.type} ${define.name}`
}).join('\n')}
}`
  }).join('\n\n')

}
