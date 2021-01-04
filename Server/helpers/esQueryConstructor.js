
function createQueryEs(dic){
    //Check if special keys are present:
    //Must all be equal
    const bool = "mustAllBeEqual" in dic ? dic["mustAllBeEqual"] == 1 ? "must" : "should" 
    : "should"

    if ("mustAllBeEqual" in dic) delete dic['mustAllBeEqual']
    //ExactEqual (all words)
    const matchType = "contains" in dic ? dic["contains"] == 1 ? "match_phrase" : "match" 
    : "match"
    if ("contains" in dic) delete dic['contains']
    //case Sensitive
    const caseSensitive = "caseSensitive" in dic ? dic["caseSensitive"] == 1 ? ".keyword" : "" 
    : ""

    if ("caseSensitive" in dic) delete dic['caseSensitive']

    //Loop and create:
    var array = []
    for (const key in dic){
        array.push({
            [matchType]:{
                [key + caseSensitive]:dic[key]
            }
        })
    }
    newDic = {"bool":{
        [bool]: array
    }}

    return newDic
}

module.exports = {
    createQueryEs
}