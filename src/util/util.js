/**
 * [{
 *  id: ,
 * name:,
 * childNodes: []
 * }]
 * @param {*} arr 
 */

function treeToArray(arr, newArr) {
    for (let i = 0; i< arr.length; i++) {
        newArr.push({
            Id: arr[i].Id,
            Name: arr[i].Name
        })
        if (arr[i].hasOwnProperty('ChildNodes')) {
            treeToArray(arr[i].ChildNodes, newArr)
        }
    }
    return newArr
}
export {
    treeToArray
}